-- Page content (editable homepage sections) and discount codes

-- =========================================================
-- page_content table
-- =========================================================

create table if not exists public.page_content (
  key text primary key,
  value text not null default '',
  label text not null default '',
  section text not null default 'home',
  updated_at timestamptz not null default timezone('utc', now()),
  updated_by uuid references public.profiles (id) on delete set null
);

create index if not exists idx_page_content_section on public.page_content (section);

alter table public.page_content enable row level security;

drop policy if exists "Public can read page content" on public.page_content;
create policy "Public can read page content"
on public.page_content
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can manage page content" on public.page_content;
create policy "Admins can manage page content"
on public.page_content
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

-- Default content seeds
insert into public.page_content (key, value, label, section) values
  ('hero_title',           'Qué hacer cuando mi hijo/a explota',                         'Título principal del héroe',             'home'),
  ('hero_subtitle',        'Guías prácticas para manejar crisis emocionales en la primera infancia', 'Subtítulo del héroe',        'home'),
  ('hero_description',     'Organizadas por edad, diseñadas para padres que quieren entender y apoyar mejor a sus hijos', 'Descripción del héroe', 'home'),
  ('about_title',          'Sobre Mí',                                                   'Título sección Sobre Mí',                'about'),
  ('about_bio_1',          'Soy María Paz Jiménez, psicóloga clínica especializada en trabajar con niños, adolescentes y familias desde un enfoque basado en evidencia. Mi práctica se centra en la Terapia de Aceptación y Compromiso (ACT) y en recursos prácticos de educación emocional.', 'Párrafo 1 - Sobre Mí', 'about'),
  ('about_bio_2',          'Con más de 8 años de experiencia, he trabajado en contextos variados: clínica privada, instituciones educativas y espacios comunitarios. Mi pasión es acompañar a familias a entender las emociones de sus hijos y desarrollar herramientas concretas para la vida.', 'Párrafo 2 - Sobre Mí', 'about'),
  ('about_bio_3',          'Creo que la educación emocional es fundamental. Por eso, además de mi trabajo en consultoría, co-fundé BEING: Educación Emocional, un proyecto que lleva recursos lúdicos y prácticos a familias con niños de 3 a 12 años.', 'Párrafo 3 - Sobre Mí', 'about'),
  ('consultations_title',  'Consultas',                                                  'Título sección Consultas',               'consultations'),
  ('consultations_subtitle','Acompañamiento personalizado para tu familia',              'Subtítulo sección Consultas',            'consultations'),
  ('consultations_duration','45 minutos de sesión personalizada',                        'Duración de la sesión',                  'consultations'),
  ('consultations_price',   'Precio: 80 U$S (dólares americanos)',                       'Precio de la consulta',                  'consultations'),
  ('consultations_schedule','Turnos limitados los viernes (sujeto a disponibilidad)',    'Disponibilidad',                         'consultations'),
  ('consultations_whatsapp','https://wa.me/595983448991',                               'URL de WhatsApp para reservas',          'consultations'),
  ('blog_title',           'Blog',                                                       'Título sección Blog',                    'blog'),
  ('blog_subtitle',        'Artículos y recursos para el bienestar emocional de tu familia', 'Subtítulo sección Blog',             'blog'),
  ('blog_post_1_title',    'Entendiendo los berrinches',                                 'Artículo 1 - Título',                    'blog'),
  ('blog_post_1_body',     'Qué son realmente y por qué tu hijo/a los necesita para crecer emocionalmente.', 'Artículo 1 - Descripción', 'blog'),
  ('blog_post_2_title',    'La validación emocional',                                   'Artículo 2 - Título',                    'blog'),
  ('blog_post_2_body',     'Una herramienta poderosa para conectar con tu hijo sin necesidad de controlar sus emociones.', 'Artículo 2 - Descripción', 'blog'),
  ('blog_post_3_title',    'Autocuidado para padres',                                   'Artículo 3 - Título',                    'blog'),
  ('blog_post_3_body',     'Por qué cuidar tu bienestar emocional es esencial para acompañar a tus hijos.', 'Artículo 3 - Descripción', 'blog')
on conflict (key) do nothing;

-- =========================================================
-- discount_codes table
-- =========================================================

create table if not exists public.discount_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text,
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value integer not null check (discount_value > 0),
  currency text not null default 'usd',
  max_uses integer,
  current_uses integer not null default 0,
  valid_from timestamptz,
  valid_until timestamptz,
  is_active boolean not null default true,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_discount_codes_code on public.discount_codes (code);
create index if not exists idx_discount_codes_is_active on public.discount_codes (is_active);

create or replace function public.update_discount_codes_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists discount_codes_updated_at_trigger on public.discount_codes;
create trigger discount_codes_updated_at_trigger
before update on public.discount_codes
for each row
execute function public.update_discount_codes_updated_at();

alter table public.discount_codes enable row level security;

-- Admins can manage all discount codes
drop policy if exists "Admins can manage discount codes" on public.discount_codes;
create policy "Admins can manage discount codes"
on public.discount_codes
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

-- Authenticated users can validate a code (read-only: just code + active status)
drop policy if exists "Authenticated users can validate discount codes" on public.discount_codes;
create policy "Authenticated users can validate discount codes"
on public.discount_codes
for select
to authenticated
using (is_active = true);
