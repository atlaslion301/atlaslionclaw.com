let client = null;

function getClient() {
  if (client) return client;
  if (!window.supabase || !window.supabase.createClient) throw new Error('Supabase SDK failed to load.');
  client = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_PUBLISHABLE_KEY);
  return client;
}

async function saveLead(email, leadType) {
  const supabase = getClient();
  const { error } = await supabase.from('leads').insert([{ email, lead_type: leadType, source_page: window.location.pathname }]);
  if (!error) return { ok: true };
  if ((error.code === '23505') || /duplicate key/i.test(error.message || '')) return { ok: true, duplicate: true };
  return { ok: false, error };
}

const RATE_WINDOW_MS = 60000;
const RATE_MAX = 3;
function canSubmit(formId) {
  const k = `rate-${formId}`;
  const now = Date.now();
  const arr = JSON.parse(localStorage.getItem(k) || '[]').filter(ts => now - ts < RATE_WINDOW_MS);
  if (arr.length >= RATE_MAX) {
    localStorage.setItem(k, JSON.stringify(arr));
    return false;
  }
  arr.push(now);
  localStorage.setItem(k, JSON.stringify(arr));
  return true;
}

async function requestFreePdf(email) {
  const resp = await fetch('/api/free-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) return { ok: false, error: data.error || 'Free PDF request failed' };
  return data;
}

function wire(formId, msgId, label, leadType) {
  const form = document.getElementById(formId);
  const msg = document.getElementById(msgId);
  if (!form || !msg) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const email = fd.get('email');
    const honey = (fd.get('company_website') || '').toString().trim();
    if (honey) return void (msg.textContent = 'Submission blocked.');
    if (!canSubmit(formId)) return void (msg.textContent = 'Too many attempts. Please wait a minute.');

    msg.textContent = 'Submitting...';
    try {
      if (leadType === 'free_pdf') {
        const result = await requestFreePdf(email);
        if (result.ok) {
          msg.textContent = result.emailed
            ? `Free PDF sent to ${email}. Check your inbox.`
            : `Saved ${email}. Email sender not configured yet.`;
          form.reset();
        } else {
          msg.textContent = `Error: ${result.error}`;
        }
        return;
      }

      if (leadType === 'paid_waitlist') {
        const supabase = getClient();
        const { data: sessData } = await supabase.auth.getSession();
        const session = sessData?.session;

        if (!session?.access_token || !session?.user?.email) {
          const next = encodeURIComponent('/#paid');
          window.location.href = `/login?next=${next}`;
          return;
        }

        const checkoutResp = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: String(session.user.email).toLowerCase(),
            accessToken: session.access_token
          })
        });
        const checkout = await checkoutResp.json();
        if (!checkoutResp.ok || !checkout.url) {
          msg.textContent = `Error: ${checkout.error || 'Checkout failed'}`;
          return;
        }
        window.location.href = checkout.url;
        return;
      }

      const result = await saveLead(email, leadType);
      if (result.ok) {
        msg.textContent = result.duplicate ? `${label}: already subscribed (${email}).` : `${label} success! Added ${email}.`;
        form.reset();
      } else {
        msg.textContent = `Error: ${result.error?.message || 'Insert failed'}`;
      }
    } catch (err) {
      msg.textContent = `Error: ${err.message}`;
    }
  });
}

wire('freeForm', 'freeMsg', 'Free PDF', 'free_pdf');
wire('paidForm', 'paidMsg', 'Waitlist', 'paid_waitlist');