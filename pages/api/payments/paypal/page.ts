import { NextApiRequest, NextApiResponse } from 'next';
import paypal from 'paypal-rest-sdk';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY);

paypal.configure({
  mode: 'sandbox', // or 'live'
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { plan }: { plan: '1month' | '6month' | '1year' } = req.body;
    const plans = {
      '1month': 500,
      '6month': 2500,
      '1year': 4500,
    };

    const create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/cancel`,
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: plan,
                sku: plan,
                price: (plans[plan] / 100).toFixed(2),
                currency: 'USD',
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: 'USD',
            total: (plans[plan] / 100).toFixed(2),
          },
          description: `Payment for ${plan} plan`,
        },
      ],
    };

    paypal.payment.create(create_payment_json, function (error: any, payment: any) {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(200).json({ id: payment.id });
      }
    });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
