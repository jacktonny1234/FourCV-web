import { useState } from 'react';

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState('1month');

  const handleCheckout = async (paymentMethod: string) => {
    setLoading(true);
    const res = await fetch(`/api/payments/${paymentMethod}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ plan }),
    });
    const { id } = await res.json();
    if (paymentMethod === 'paypal') {
      window.location.href = `https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=${id}`;
    } else if (paymentMethod === 'payoneer') {
      window.location.href = `https://payoneer.com/checkout?payment_id=${id}`;
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Checkout</h1>
      <select value={plan} onChange={(e) => setPlan(e.target.value)}>
        <option value="1month">1 Month - $5</option>
        <option value="6month">6 Months - $25</option>
        <option value="1year">1 Year - $45</option>
      </select>
      <button onClick={() => handleCheckout('paypal')} disabled={loading}>
        {loading ? 'Loading...' : 'Pay with PayPal'}
      </button>
      <button onClick={() => handleCheckout('payoneer')} disabled={loading}>
        {loading ? 'Loading...' : 'Pay with Payoneer'}
      </button>
    </div>
  );
}
