-- Run this in Supabase SQL Editor

create table if not exists public.leads (
  id bigserial primary key,
  email text not null,
  lead_type text not null check (lead_type in ('free_pdf','paid_waitlist')),
  source_page text not null default '/',
  created_at timestamptz not null default now(),
  unique(email, lead_type)
);

alter table public.leads enable row level security;

-- Allow public inserts from landing page (MVP)
drop policy if exists leads_insert_public on public.leads;
create policy leads_insert_public
on public.leads
for insert
to anon
with check (true);

-- Optional: prevent public reads
-- no select policy added on purpose
