create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  wallet_balance numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create type transaction_status as enum ('pending', 'success', 'failed');

create table if not exists public.transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null,
  network text not null,
  phone text not null,
  size_mb integer not null,
  amount numeric(12,2) not null,
  status transaction_status not null default 'pending',
  provider_ref text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.transactions enable row level security;

create policy "profiles_select_own"
on public.profiles for select
using (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = id);

create policy "transactions_select_own"
on public.transactions for select
using (auth.uid() = user_id);

create policy "transactions_insert_own"
on public.transactions for insert
with check (auth.uid() = user_id);
