import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  try {
    const { email } = req.body || {};
    const cleanEmail = String(email || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ ok: false, error: 'Invalid email' });
    }

    const { STRIPE_SECRET_KEY, STRIPE_PRICE_ID, PUBLIC_BASE_URL } = process.env;
    if (!STRIPE_SECRET_KEY || !STRIPE_PRICE_ID || !PUBLIC_BASE_URL) {
      return res.status(500).json({ ok: false, error: 'Stripe env vars missing' });
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY);
    const base = PUBLIC_BASE_URL.replace(/\/$/, '');

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
      customer_email: cleanEmail,
      success_url: `${base}/?paid=success`,
      cancel_url: `${base}/?paid=cancel`,
      metadata: { product: 'openclaw_paid_pdf', email: cleanEmail }
    });

    return res.status(200).json({ ok: true, url: session.url });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || 'Checkout session failed' });
  }
}
