import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  try {
    const { email, accessToken } = req.body || {};
    const cleanEmail = String(email || '').trim().toLowerCase();
    const token = String(accessToken || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ ok: false, error: 'Invalid email' });
    }

    const { STRIPE_SECRET_KEY, STRIPE_PRICE_ID, PUBLIC_BASE_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
    if (!STRIPE_SECRET_KEY || !STRIPE_PRICE_ID || !PUBLIC_BASE_URL || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({ ok: false, error: 'Server env vars missing' });
    }

    if (!token) {
      return res.status(401).json({ ok: false, error: 'Login required before checkout' });
    }

    const authResp = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${token}`
      }
    });
    if (!authResp.ok) {
      return res.status(401).json({ ok: false, error: 'Invalid or expired login session' });
    }
    const user = await authResp.json();
    const userEmail = String(user?.email || '').trim().toLowerCase();
    if (!userEmail || userEmail !== cleanEmail) {
      return res.status(403).json({ ok: false, error: 'Checkout email must match logged-in user' });
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
