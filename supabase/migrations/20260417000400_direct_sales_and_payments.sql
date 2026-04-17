-- Phase 2 direct sales: catalog fields + payment tracking.

alter table public.guides add column if not exists slug text;
alter table public.guides add column if not exists price_cents integer not null default 990 check (price_cents > 0);
alter table public.guides add column if not exists currency text not null default 'usd';
alter table public.guides add column if not exists is_active boolean not null default true;

create unique index if not exists idx_guides_slug_unique on public.guides (slug) where slug is not null;
create index if not exists idx_guides_is_active on public.guides (is_active);
create index if not exists idx_guides_price_cents on public.guides (price_cents);

alter table public.orders add column if not exists payment_provider text;
alter table public.orders add column if not exists payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded'));
alter table public.orders add column if not exists payment_provider_session_id text;
alter table public.orders add column if not exists payment_provider_payment_intent text;

create unique index if not exists idx_orders_provider_session_unique on public.orders (payment_provider_session_id) where payment_provider_session_id is not null;
create index if not exists idx_orders_payment_status on public.orders (payment_status);

alter table public.order_items drop constraint if exists order_items_order_id_guide_id_key;
alter table public.order_items add constraint order_items_order_id_guide_id_key unique (order_id, guide_id);

-- Make catalog visibility explicit for direct sales.
drop policy if exists "Anyone can view active published guides" on public.guides;
create policy "Anyone can view active published guides"
on public.guides
for select
using (is_published = true and is_active = true);
