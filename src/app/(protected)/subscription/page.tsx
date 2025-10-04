import Link from "next/link";
import { getEducationalResources } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function SubscriptionPage() {
  const resources = await getEducationalResources();

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 md:px-6">
      <header className="space-y-3 text-center md:text-left">
        <p className="text-sm font-semibold uppercase tracking-wide text-ink-emerald">Área educativa</p>
        <h1 className="text-4xl font-semibold text-ink-primary dark:text-white">Recursos para pacientes y suscriptores</h1>
        <p className="text-base text-ink-teal dark:text-slate-300">
          Accede a artículos, videos, guías descargables y ejercicios prácticos actualizados mensualmente. Esta sección estará protegida mediante autenticación cuando se integre el proveedor seleccionado (por ejemplo, NextAuth + Sanity).
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {resources.map((resource) => (
          <article
            key={resource.id}
            className="relative flex h-full flex-col justify-between rounded-2xl border border-soft bg-surface p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="space-y-3">
              <span className="inline-flex w-fit rounded-full bg-surface-alt px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink-emerald dark:bg-slate-900/60 dark:text-white">
                {resource.type}
              </span>
              <h2 className="text-2xl font-semibold text-ink-primary dark:text-white">{resource.title}</h2>
              <p className="text-sm text-ink-teal dark:text-slate-300">{resource.summary}</p>
            </div>
            <div className="mt-6 flex items-center justify-between text-xs text-ink-magenta">
              <time dateTime={resource.publishedAt}>
                Publicado el {new Date(resource.publishedAt).toLocaleDateString("es-CL")}
              </time>
              <Link className="text-sm font-semibold text-ink-emerald hover:text-ink-plum focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-sun-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-surface)]" href={resource.url}>
                Ver recurso -&gt;
              </Link>
            </div>
          </article>
        ))}
      </div>

      <section className="space-y-3 rounded-2xl border border-dashed border-soft bg-surface-alt p-6 text-sm text-ink-teal">
        <h2 className="text-base font-semibold text-ink-primary">¿Cómo funcionará el acceso?</h2>
        <ul className="list-disc space-y-2 pl-6 text-ink-teal">
          <li>Autenticación con NextAuth (email magic link y cuentas de pacientes).</li>
          <li>Contenido protegido en el CMS mediante roles y etiquetas.</li>
          <li>Verificación de suscripción antes de renderizar cada recurso.</li>
        </ul>
      </section>
    </div>
  );
}
