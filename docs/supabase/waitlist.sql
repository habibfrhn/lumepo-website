create extension if not exists "pgcrypto";

create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  email_normalized text generated always as (lower(trim(email))) stored,
  created_at timestamptz not null default now(),
  marketing_consent boolean not null default true,
  status text not null default 'pending'
    check (status in ('pending','confirmed','unsubscribed')),
  source text,
  landing_path text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  ip_hash text,
  user_agent text,
  converted_at timestamptz,
  user_id uuid references auth.users(id) on delete set null,
  constraint waitlist_email_basic_check
    check (position('@' in email) > 1 and position('.' in email) > 3)
);

create unique index if not exists waitlist_email_normalized_uidx
  on public.waitlist_signups (email_normalized);

create index if not exists waitlist_created_at_idx
  on public.waitlist_signups (created_at desc);

create index if not exists waitlist_status_idx
  on public.waitlist_signups (status);

create index if not exists waitlist_user_id_idx
  on public.waitlist_signups (user_id);

alter table public.waitlist_signups enable row level security;
