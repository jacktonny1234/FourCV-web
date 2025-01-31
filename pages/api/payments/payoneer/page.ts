import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import Payoneer from 'payoneer-sdk';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const payoneer = new Payoneer({
  clientId: process.env.PAYONEER_CLIENT_ID,
  clientSecret: process.env.PAYONEER_CLIENT_SECRET,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { plan }: { plan: '1month' | '6month' | '1year' } = req.body;
    const plans = {
      '1month': 500,
      '6month': 2500,
      '1year': 4500,
    };

    try {
      const payment = await payoneer.createPayment({
        amount: plans[plan],
        currency: 'USD',
        description: `Payment for ${plan} plan`,
        redirectUrl: `${req.headers.origin}/success`,
        cancelUrl: `${req.headers.origin}/cancel`,
      });

      res.status(200).json({ id: payment.id });
    } catch (error) {
      res.status(500).json({ error: (error as any).message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
