create table if not exists public.paid_pdf_tokens (
  id bigserial primary key,
  email text not null,
  token text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  stripe_session_id text,
  created_at timestamptz not null default now()
);

alter table public.paid_pdf_tokens enable row level security;
-- service role only (no anon policy)
