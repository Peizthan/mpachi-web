-- Seed data for local development.
-- Inserts sample guides into the catalog (safe to run multiple times via ON CONFLICT DO NOTHING).

insert into public.guides (id, title, slug, description, content, category, price_cents, currency, is_published, is_active)
values
  (
    '00000000-0000-0000-0000-000000000001',
    'Guía 0-1 años: Entendiendo los primeros berrinches',
    'guia-0-1-anos',
    'Estrategias para los primeros meses de vida. Aprende a interpretar el llanto y las señales emocionales de tu bebé.',
    E'## Bienvenida\n\nEsta guía te acompañará en los primeros 12 meses de vida de tu hijo/a.\n\n## ¿Por qué llora mi bebé?\n\nEl llanto es la única forma de comunicación que tiene un bebé. No existe el "llanto de capricho" en esta etapa.\n\n## Estrategias de regulación\n\n1. Contención física: cargarlo con seguridad\n2. Voz suave y constante\n3. Movimiento rítmico\n4. Ambiente calmado\n\n## Autocompasión para padres\n\nNo tienes que hacerlo perfecto. La consistencia amorosa es suficiente.',
    'crianza-0-1',
    1500,
    'usd',
    true,
    true
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'Guía 1-3 años: La etapa de los "no"',
    'guia-1-3-anos',
    'Herramientas para navegar las crisis emocionales intensas en la primera infancia.',
    E'## La autonomía emerge\n\nEntre el año y los tres años, tu hijo/a descubre que es una persona separada de ti. Los "no" son una expresión de identidad, no rebeldía.\n\n## Los berrinches son normales\n\nUn berrinche no es un problema de conducta. Es un sistema nervioso que aún no puede regularse solo.\n\n## Qué hacer durante un berrinche\n\n1. Mantén la calma (o finge tenerla)\n2. Nombra la emoción: "Veo que estás muy enojado"\n3. No negocies en el pico de la crisis\n4. Ofrece contacto físico si lo acepta\n5. Cuando pase, conecten y validen\n\n## Lo que NO funciona\n\n- Gritar más fuerte\n- Ignorar completamente\n- Castigar la emoción',
    'crianza-1-3',
    1500,
    'usd',
    true,
    true
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'Guía 3-5 años: Construyendo inteligencia emocional',
    'guia-3-5-anos',
    'Preescolar y la importancia de la comunicación. Herramientas concretas para el día a día.',
    E'## La edad del "¿por qué?"\n\nA los 3-5 años el lenguaje explota. Tu hijo/a puede hablar sobre sus emociones si le enseñas el vocabulario.\n\n## El vocabulario emocional\n\nEnseña nombres de emociones: alegría, tristeza, miedo, enojo, vergüenza, sorpresa.\n\nUsa libros, canciones, y el día a día para practicar.\n\n## La validación emocional en práctica\n\n"Entiendo que estás triste porque no podíamos quedarnos más tiempo en el parque. Tiene sentido que te duela eso."\n\n## Límites con conexión\n\nLos límites no son castigos. Son actos de amor que comunican: "Yo te cuido incluso cuando no te gusta lo que digo."',
    'crianza-3-5',
    1500,
    'usd',
    true,
    true
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    'Pack Completo 0-5 años',
    'pack-completo-0-5',
    'Las tres guías en un pack especial. Ahorra 25% comparado con compras individuales.',
    E'## Acceso completo 0-5 años\n\nEste pack incluye el contenido de las tres guías:\n\n- Guía 0-1 años: Entendiendo los primeros berrinches\n- Guía 1-3 años: La etapa de los "no"\n- Guía 3-5 años: Construyendo inteligencia emocional\n\n## Pensado para familias en crecimiento\n\nSi tu hijo/a tiene hoy 1 año, también querrás tener las herramientas para cuando llegue a los 3.\n\nCon este pack accedés a todo el material de una sola vez.',
    'pack',
    3375,
    'usd',
    true,
    true
  )
on conflict (id) do nothing;

-- Default site settings (safe to run multiple times)
insert into public.site_settings (key, value) values
  ('site_name', 'MPachi'),
  ('site_tagline', 'Guías de crianza para familias'),
  ('contact_email', ''),
  ('whatsapp_number', '+595983448991'),
  ('instagram_url', ''),
  ('facebook_url', ''),
  ('tiktok_url', ''),
  ('maintenance_mode', 'false')
on conflict (key) do nothing;

