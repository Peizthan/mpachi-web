const credentials = [
  "Psicóloga clínica, Pontificia Universidad Católica de Chile",
  "Diplomado en Psicoterapia Focal y Técnicas de Regulación Emocional, Universidad de Chile",
  "Certificación en intervención familiar basada en apego",
  "Miembro del Colegio de Psicólogos de Chile"
];

const testimonials = [
  {
    quote:
      "El acompañamiento de María Paz nos permitió comprender mejor las necesidades emocionales de nuestra hija y crear acuerdos como familia.",
    author: "Familia Rivas - Programa de orientación parental"
  },
  {
    quote:
      "Su estilo cercano y respetuoso me ayudó a desarrollar herramientas para manejar la ansiedad y los cambios laborales.",
    author: "Paciente adulto, proceso individual"
  }
];

export default function AboutPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-16 px-4 py-16 md:px-6">
      <section className="space-y-6">
        <h1 className="text-4xl font-semibold text-ink-primary dark:text-white">Sobre María Paz</h1>
        <p className="text-base leading-relaxed text-ink-teal dark:text-slate-300">
          María Paz Jiménez es psicóloga clínica con más de una década de experiencia en psicoterapia individual, infanto-juvenil y procesos grupales. Ha colaborado con instituciones educativas, centros de salud mental y organizaciones que impulsan el bienestar integral. Fundó BEING para ofrecer un espacio seguro y ético que promueva la autoconciencia, la resiliencia y el desarrollo socioemocional.
        </p>
        <p className="text-base leading-relaxed text-ink-teal dark:text-slate-300">
          Utiliza enfoques basados en evidencia como la terapia cognitivo-conductual, la mentalización y las terapias sistémicas, integrando la perspectiva de género y la diversidad familiar. Sus procesos priorizan la psicoeducación clara, los acuerdos terapéuticos y la coordinación interprofesional cuando es necesario.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-ink-primary dark:text-white">Credenciales y formación</h2>
          <ul className="space-y-2 text-sm text-ink-teal dark:text-slate-300">
            {credentials.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span aria-hidden className="mt-1 h-2 w-2 rounded-full bg-[color:var(--color-ink-emerald)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-ink-primary dark:text-white">Filosofía de trabajo</h2>
          <p className="text-sm text-ink-teal dark:text-slate-300">
            <q className="font-medium text-ink-primary dark:text-white">
              La terapia nos permite comprender la historia propia con amabilidad y construir nuevas alternativas para relacionarnos con nosotros mismos y con quienes nos rodean.
            </q>
            Cada sesión es un espacio ético, confidencial y respetuoso de la diversidad.
          </p>
          <p className="text-sm text-ink-teal dark:text-slate-300">
            María Paz integra ejercicios de regulación emocional, recursos psicoeducativos y estrategias colaborativas con redes familiares y escolares cuando es necesario.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-ink-primary dark:text-white">Testimonios</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <blockquote
              key={testimonial.author}
              className="space-y-3 rounded-2xl border border-soft bg-surface p-6 text-sm text-ink-teal shadow-soft dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              <p className="leading-relaxed">{testimonial.quote}</p>
              <footer className="text-xs font-semibold uppercase tracking-wide text-ink-muted dark:text-slate-200">
                {testimonial.author}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>
    </div>
  );
}
