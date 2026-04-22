-- Site settings key-value store for admin configuration
create table if not exists public.site_settings (
  key text primary key,
  value text,
  updated_at timestamptz default now(),
  updated_by uuid references public.profiles(id) on delete set null
);

alter table public.site_settings enable row level security;

-- Only admins can read or write settings
create policy "Admin read site_settings"
  on public.site_settings for select
  using (
    exists (
      select 1 from public.profiles where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admin write site_settings"
  on public.site_settings for all
  using (
    exists (
      select 1 from public.profiles where id = auth.uid() and role = 'admin'
    )
  );

-- Seed default settings
insert into public.site_settings (key, value) values
  ('site_name', 'MPachi'),
  ('site_tagline', 'Guías de crianza para familias'),
  ('contact_email', ''),
  ('whatsapp_number', ''),
  ('instagram_url', ''),
  ('facebook_url', ''),
  ('tiktok_url', ''),
  ('maintenance_mode', 'false')
on conflict (key) do nothing;
