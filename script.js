let client = null;

function getClient() {
  if (client) return client;
  if (!window.supabase || !window.supabase.createClient) {
    throw new Error('Supabase SDK failed to load (window.supabase missing).');
  }
  if (!window.SUPABASE_URL || !window.SUPABASE_PUBLISHABLE_KEY) {
    throw new Error('Supabase config missing (URL or publishable key).');
  }
  client = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_PUBLISHABLE_KEY);
  return client;
}

async function saveLead(email, leadType) {
  const supabase = getClient();
  const { error } = await supabase
    .from('leads')
    .insert([{ email, lead_type: leadType, source_page: window.location.pathname }]);

  if (!error) return { ok: true };
  if ((error.code === '23505') || /duplicate key/i.test(error.message || '')) {
    return { ok: true, duplicate: true };
  }
  return { ok: false, error };
}

const RATE_WINDOW_MS = 60 * 1000;
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

function wire(formId, msgId, label, leadType) {
  const form = document.getElementById(formId);
  const msg = document.getElementById(msgId);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const email = fd.get('email');
    const honey = (fd.get('company_website') || '').toString().trim();

    if (honey) {
      msg.textContent = 'Submission blocked.';
      return;
    }

    if (!canSubmit(formId)) {
      msg.textContent = 'Too many attempts. Please wait a minute and try again.';
      return;
    }

    msg.textContent = 'Submitting...';

    try {
      const result = await saveLead(email, leadType);
      if (result.ok) {
        msg.textContent = result.duplicate
          ? `${label}: you're already on this list with ${email}.`
          : `${label} success! Added ${email}.`;
        form.reset();
        return;
      }
      msg.textContent = `Error: ${result.error?.message || 'Insert failed'}`;
      console.error(result.error);
    } catch (err) {
      msg.textContent = `Error: ${err.message}`;
      console.error(err);
    }
  });
}

wire('freeForm', 'freeMsg', 'Free PDF', 'free_pdf');
wire('paidForm', 'paidMsg', 'Waitlist', 'paid_waitlist');