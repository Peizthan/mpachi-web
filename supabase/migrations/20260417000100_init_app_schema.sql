-- MPACHI baseline schema (idempotent)
-- Includes tables, indexes, RLS policies, updated_at triggers,
-- and auth.users -> profiles auto-create trigger.

create extension if not exists pgcrypto;

-- =========================================================
-- Tables
-- =========================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text,
  avatar_url text,
  phone text,
  address text,
  city text,
  postal_code text,
  country text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.guides (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  description text,
  content text,
  image_url text,
  category text,
  author_id uuid not null references public.profiles (id) on delete cascade,
  is_published boolean not null default false,
  views_count integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  order_number text not null unique,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  total_amount numeric(10, 2) not null check (total_amount > 0),
  shipping_address text,
  shipping_city text,
  shipping_postal_code text,
  shipping_country text,
  payment_method text,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  guide_id uuid not null references public.guides (id) on delete restrict,
  quantity integer not null default 1 check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price > 0),
  subtotal numeric(10, 2) not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.access_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  action text not null,
  resource_type text,
  resource_id uuid,
  ip_address text,
  user_agent text,
  status_code integer,
  error_message text,
  created_at timestamptz not null default timezone('utc', now())
);

-- =========================================================
-- Indexes
-- =========================================================

create index if not exists idx_profiles_email on public.profiles (email);
create index if not exists idx_profiles_role on public.profiles (role);

create index if not exists idx_guides_author_id on public.guides (author_id);
create index if not exists idx_guides_category on public.guides (category);
create index if not exists idx_guides_is_published on public.guides (is_published);

create index if not exists idx_orders_user_id on public.orders (user_id);
create index if not exists idx_orders_status on public.orders (status);
create index if not exists idx_orders_created_at on public.orders (created_at desc);

create index if not exists idx_order_items_order_id on public.order_items (order_id);
create index if not exists idx_order_items_guide_id on public.order_items (guide_id);

create index if not exists idx_access_logs_user_id on public.access_logs (user_id);
create index if not exists idx_access_logs_created_at on public.access_logs (created_at desc);
create index if not exists idx_access_logs_action on public.access_logs (action);
create index if not exists idx_access_logs_resource_type on public.access_logs (resource_type);

-- =========================================================
-- updated_at trigger functions
-- =========================================================

create or replace function public.update_profiles_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.update_guides_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.update_orders_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists profiles_updated_at_trigger on public.profiles;
create trigger profiles_updated_at_trigger
before update on public.profiles
for each row
execute function public.update_profiles_updated_at();

drop trigger if exists guides_updated_at_trigger on public.guides;
create trigger guides_updated_at_trigger
before update on public.guides
for each row
execute function public.update_guides_updated_at();

drop trigger if exists orders_updated_at_trigger on public.orders;
create trigger orders_updated_at_trigger
before update on public.orders
for each row
execute function public.update_orders_updated_at();

-- =========================================================
-- auth.users -> profiles auto-create trigger
-- =========================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', null),
    'user'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- =========================================================
-- RLS
-- =========================================================

alter table public.profiles enable row level security;
alter table public.guides enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.access_logs enable row level security;

-- profiles policies

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles"
on public.profiles
for select
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

-- guides policies

drop policy if exists "Anyone can view published guides" on public.guides;
create policy "Anyone can view published guides"
on public.guides
for select
using (is_published = true);

drop policy if exists "Authors can view own guides" on public.guides;
create policy "Authors can view own guides"
on public.guides
for select
using (auth.uid() = author_id);

drop policy if exists "Authors can update own guides" on public.guides;
create policy "Authors can update own guides"
on public.guides
for update
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

drop policy if exists "Authenticated users can create guides" on public.guides;
create policy "Authenticated users can create guides"
on public.guides
for insert
with check (auth.uid() = author_id);

drop policy if exists "Admins can manage guides" on public.guides;
create policy "Admins can manage guides"
on public.guides
for all
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

-- orders policies

drop policy if exists "Users can view own orders" on public.orders;
create policy "Users can view own orders"
on public.orders
for select
using (auth.uid() = user_id);

drop policy if exists "Users can create own orders" on public.orders;
create policy "Users can create own orders"
on public.orders
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own pending orders" on public.orders;
create policy "Users can update own pending orders"
on public.orders
for update
using (auth.uid() = user_id and status = 'pending')
with check (auth.uid() = user_id);

drop policy if exists "Admins can view all orders" on public.orders;
create policy "Admins can view all orders"
on public.orders
for select
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders"
on public.orders
for update
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

-- order_items policies

drop policy if exists "Users can view own order items" on public.order_items;
create policy "Users can view own order items"
on public.order_items
for select
using (
  exists (
    select 1
    from public.orders o
    where o.id = order_items.order_id
      and o.user_id = auth.uid()
  )
);

drop policy if exists "Users can create items in own orders" on public.order_items;
create policy "Users can create items in own orders"
on public.order_items
for insert
with check (
  exists (
    select 1
    from public.orders o
    where o.id = order_items.order_id
      and o.user_id = auth.uid()
  )
);

drop policy if exists "Admins can view all order items" on public.order_items;
create policy "Admins can view all order items"
on public.order_items
for select
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

-- access_logs policies

drop policy if exists "Users can view own access logs" on public.access_logs;
create policy "Users can view own access logs"
on public.access_logs
for select
using (auth.uid() = user_id);

drop policy if exists "Admins can view all access logs" on public.access_logs;
create policy "Admins can view all access logs"
on public.access_logs
for select
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

drop policy if exists "System can insert access logs" on public.access_logs;
create policy "System can insert access logs"
on public.access_logs
for insert
with check (true);
