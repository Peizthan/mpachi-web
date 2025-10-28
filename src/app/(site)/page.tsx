import Link from "next/link";
import { instagramUrl } from "@/config/navigation";

const callToActions = [
  { label: "Conocer servicios", href: "/services" },
  { label: "Formulario para pacientes", href: "/contact" }
];

const featuredServices = [
  {
    title: "Psicoterapia para adolescentes",
    description:
      "Procesos terapéuticos que acompañan los cambios emocionales, sociales y académicos en la adolescencia."
  },
  {
    title: "Orientación a madres, padres y cuidadores",
    description:
      "Sesiones breves para abordar desafíos de crianza y coordinar estrategias familiares."
  },
  {
    title: "Talleres de bienestar emocional",
    description:
      "Programas grupales y corporativos para cultivar habilidades socioemocionales."
  }
];

export default function HomePage() {
  return (
    <div className="space-y-24 pb-24">
      <section className="relative isolate bg-[color:var(--color-base-cream)]">
        <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 py-24 md:px-6 md:py-32">
          <div className="space-y-6 md:max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-surface-alt px-3 py-1 text-sm font-medium text-ink-primary">
              <span className="inline-flex h-2 w-2 rounded-full bg-[color:var(--color-ink-primary)]" aria-hidden />
              Bienestar emocional con perspectiva integral
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-ink-primary md:text-5xl">
              Acompañamiento terapéutico para cada etapa de la vida
            </h1>
            <p className="text-lg text-indigo-950 md:text-xl">
              María Paz Jiménez es psicóloga clínica con más de 10 años de experiencia en psicoterapia individual y familiar. La práctica integra enfoques basados en evidencia y un trato humano, cercano y respetuoso.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {callToActions.map((cta) => (
                <Link
                  key={cta.href}
                  href={cta.href}
                  className="flex min-w-[200px] items-center justify-center rounded-full bg-[color:var(--color-shell-peach)] px-6 py-3 text-sm font-semibold text-ink-primary shadow-soft transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-sun-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-surface)]"
                >
                  {cta.label}
                </Link>
              ))}
            </div>
            <aside className="flex items-center gap-2 rounded-2xl border border-soft bg-surface px-4 py-3 text-sm text-ink-indigo-950 shadow-soft">
              <span className="font-medium">Conoce más en mis redes:</span>
              <Link
                href={instagramUrl}
                className="inline-flex items-center gap-2 font-semibold text-ink-magenta underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-sun-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-surface)]"
                target="_blank"
                rel="noreferrer"
              >
                @psi.mariapazjimenez
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-6xl flex-col gap-8 px-4 md:px-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-ink-primary">Servicios destacados</p>
          <h2 className="text-3xl font-semibold text-ink-primary">Herramientas clínicas para generar cambios sostenibles</h2>
          <p className="text-base text-ink-indigo-950">
            Cada proceso se adapta a la historia personal, incorporando recursos terapéuticos, psicoeducación y un acompañamiento cercano a familias y organizaciones.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-3">
          {featuredServices.map((service) => (
            <article
              key={service.title}
              className="space-y-3 rounded-xl border border-soft bg-surface p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-[color:var(--color-sun-accent)] focus-within:ring-offset-2 focus-within:ring-offset-[color:var(--color-surface)]"
            >
              <h3 className="text-xl font-semibold text-ink-primary">{service.title}</h3>
              <p className="text-sm text-ink-indigo-950">{service.description}</p>
              <Link
                className="inline-flex items-center gap-2 text-sm font-semibold text-ink-magenta underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-sun-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-surface)]"
                href="/services"
              >
                Ver detalles
                <span aria-hidden>-&gt;</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="grid gap-6 rounded-3xl bg-surface p-10 shadow-soft md:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-ink-primary">Conoce a María Paz</h2>
            <p className="text-base leading-relaxed text-ink-indigo-950">
              Psicóloga clínica titulada de la Pontificia Universidad Católica de Chile, diplomada en psicoterapia focal, intervención familiar y regulaciones emocionales. Ha colaborado con instituciones educativas, equipos interdisciplinarios de salud mental y proyectos de prevención de riesgos psicosociales.
            </p>
            <p className="text-base leading-relaxed text-ink-indigo-950">
              Su enfoque integra la terapia cognitivo-conductual, mentalización y psicoterapia basada en apego, privilegiando un espacio seguro y una comunicación clara.
            </p>
            <div>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-ink-magenta underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-sun-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-surface)]"
              >
                Ver biografía completa
                <span aria-hidden>-&gt;</span>
              </Link>
            </div>
          </div>
          <div className="space-y-4 rounded-2xl border border-dashed border-soft bg-surface-alt p-6">
            <h3 className="text-lg font-semibold text-ink-primary">Próximos talleres</h3>
            <ul className="space-y-2 text-sm text-ink-indigo-950">
              <li>Taller “Regulación emocional en niños” – Octubre</li>
              <li>Programa para equipos educativos – Noviembre</li>
              <li>Charlas para organizaciones – Bajo solicitud</li>
            </ul>
            <p className="text-sm text-ink-indigo-950">
              Suscríbete al área educativa para recibir invitaciones y material de apoyo exclusivo.
            </p>
            <Link
              href="/subscription"
              className="inline-flex items-center gap-2 text-sm font-semibold text-ink-magenta underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-sun-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-surface)]"
            >
              Explorar área educativa
              <span aria-hidden>-&gt;</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
