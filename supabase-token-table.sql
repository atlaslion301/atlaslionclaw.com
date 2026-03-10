create table if not exists public.pdf_access_tokens (
  id bigserial primary key,
  email text not null,
  token text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.pdf_access_tokens enable row level security;

-- service role only (no anon policies)
