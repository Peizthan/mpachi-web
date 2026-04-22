import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';

export interface PageContent {
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  about_title: string;
  about_bio_1: string;
  about_bio_2: string;
  about_bio_3: string;
  consultations_title: string;
  consultations_subtitle: string;
  consultations_duration: string;
  consultations_price: string;
  consultations_schedule: string;
  consultations_whatsapp: string;
  blog_title: string;
  blog_subtitle: string;
  blog_post_1_title: string;
  blog_post_1_body: string;
  blog_post_2_title: string;
  blog_post_2_body: string;
  blog_post_3_title: string;
  blog_post_3_body: string;
}

export const PAGE_CONTENT_DEFAULTS: PageContent = {
  hero_title: 'Qué hacer cuando mi hijo/a explota',
  hero_subtitle: 'Guías prácticas para manejar crisis emocionales en la primera infancia',
  hero_description: 'Organizadas por edad, diseñadas para padres que quieren entender y apoyar mejor a sus hijos',
  about_title: 'Sobre Mí',
  about_bio_1:
    'Soy María Paz Jiménez, psicóloga clínica especializada en trabajar con niños, adolescentes y familias desde un enfoque basado en evidencia. Mi práctica se centra en la Terapia de Aceptación y Compromiso (ACT) y en recursos prácticos de educación emocional.',
  about_bio_2:
    'Con más de 8 años de experiencia, he trabajado en contextos variados: clínica privada, instituciones educativas y espacios comunitarios. Mi pasión es acompañar a familias a entender las emociones de sus hijos y desarrollar herramientas concretas para la vida.',
  about_bio_3:
    'Creo que la educación emocional es fundamental. Por eso, además de mi trabajo en consultoría, co-fundé BEING: Educación Emocional, un proyecto que lleva recursos lúdicos y prácticos a familias con niños de 3 a 12 años.',
  consultations_title: 'Consultas',
  consultations_subtitle: 'Acompañamiento personalizado para tu familia',
  consultations_duration: '45 minutos de sesión personalizada',
  consultations_price: 'Precio: 80 U$S (dólares americanos)',
  consultations_schedule: 'Turnos limitados los viernes (sujeto a disponibilidad)',
  consultations_whatsapp: 'https://wa.me/595983448991',
  blog_title: 'Blog',
  blog_subtitle: 'Artículos y recursos para el bienestar emocional de tu familia',
  blog_post_1_title: 'Entendiendo los berrinches',
  blog_post_1_body: 'Qué son realmente y por qué tu hijo/a los necesita para crecer emocionalmente.',
  blog_post_2_title: 'La validación emocional',
  blog_post_2_body:
    'Una herramienta poderosa para conectar con tu hijo sin necesidad de controlar sus emociones.',
  blog_post_3_title: 'Autocuidado para padres',
  blog_post_3_body:
    'Por qué cuidar tu bienestar emocional es esencial para acompañar a tus hijos.',
};

type RawRow = { key: string; value: string };

const rowsToContent = (rows: RawRow[]): PageContent => {
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return Object.fromEntries(
    Object.entries(PAGE_CONTENT_DEFAULTS).map(([k, def]) => [k, map[k] ?? def])
  ) as PageContent;
};

export const usePageContent = () => {
  const [content, setContent] = useState<PageContent>(PAGE_CONTENT_DEFAULTS);
  const [loading, setLoading] = useState(true);

  const fetchContent = useCallback(async () => {
    try {
      const { data } = await supabase.from('page_content').select('key,value');
      if (data && data.length > 0) {
        setContent(rowsToContent(data as RawRow[]));
      }
    } catch {
      // silently fall back to defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return { content, loading };
};
