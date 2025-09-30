const services = [
  {
    title: "Psicoterapia para niñas, niños y adolescentes",
    target: "Niñas, niños y adolescentes entre 6 y 18 años",
    methodology:
      "Evaluación inicial con padres, sesiones individuales y trabajo colaborativo con familia y colegio. Se integran técnicas cognitivo-conductuales, juego terapéutico y psicoeducación.",
    duration: "Sesiones de 50 minutos",
  },
  {
    title: "Psicoterapia para personas adultas",
    target: "Adultos que enfrentan ansiedad, cambios vitales, duelos o desafíos laborales",
    methodology:
      "Intervención basada en terapia cognitivo-conductual, mentalización y estrategias de regulación emocional. Se establecen objetivos terapéuticos y seguimiento de avances.",
    duration: "Sesiones de 50 minutos",
  },
  {
    title: "Orientación a madres, padres y cuidadores",
    target: "Familias que requieren acompañamiento en crianza respetuosa y abordaje de conductas complejas",
    methodology:
      "Sesiones breves de intervención psicoeducativa, diseño de rutinas, acuerdos familiares y seguimiento del bienestar de niñas y niños.",
    duration: "Sesiones de 45 minutos",
  },
  {
    title: "Talleres y workshops",
    target: "Organizaciones, equipos educativos y comunidades",
    methodology:
      "Programas diseñados a medida en regulación emocional, prevención de riesgos psicosociales y habilidades socioemocionales.",
    duration: "Formato intensivo o ciclos modulares",
  },
];

const faqs = [
  {
    question: "¿Cómo se reserva una sesión inicial?",
    answer:
      "Completa el formulario en la sección de contacto indicando disponibilidad y el motivo de consulta. Recibirás una respuesta en menos de 48 horas hábiles.",
  },
  {
    question: "¿Se ofrecen sesiones en línea?",
    answer:
      "Sí, las sesiones pueden realizarse de manera virtual mediante plataformas seguras. Indícalo en el formulario de registro.",
  },
  {
    question: "¿Se coordina con equipos escolares u otros profesionales?",
    answer:
      "Cuando es pertinente y con autorización escrita, se coordinan reuniones con colegios, médicos u otros especialistas para sostener un plan integral.",
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-16 px-4 py-16 md:px-6">
      <header className="space-y-4 text-center md:text-left">
        <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">Servicios clínicos y formativos</h1>
        <p className="mx-auto max-w-3xl text-base text-slate-700 dark:text-slate-300">
          Acompañamiento terapéutico adaptado a cada etapa vital, orientación profesional para familias y espacios formativos para comunidades y organizaciones.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        {services.map((service) => (
          <article
            key={service.title}
            className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{service.title}</h2>
              <p className="text-sm font-medium uppercase tracking-wide text-emerald-600">{service.target}</p>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{service.methodology}</p>
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-slate-500">{service.duration}</p>
          </article>
        ))}
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Preguntas frecuentes</h2>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-xl border border-slate-200 bg-white px-6 py-4 text-sm text-slate-700 shadow-sm transition focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-semibold text-slate-900 marker:hidden dark:text-white">
                {faq.question}
                <span aria-hidden className="transition group-open:rotate-45">＋</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}