import Link from "next/link";
import { getEducationalResources } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function SubscriptionPage() {
  const resources = await getEducationalResources();

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 md:px-6">
      <header className="space-y-3 text-center md:text-left">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">Área educativa</p>
        <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">Recursos para pacientes y suscriptores</h1>
        <p className="text-base text-slate-700 dark:text-slate-300">
          Accede a artículos, videos, guías descargables y ejercicios prácticos actualizados mensualmente. Esta sección estará protegida mediante autenticación cuando se integre el proveedor seleccionado (p. ej., NextAuth + Sanity).
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {resources.map((resource) => (
          <article
            key={resource.id}
            className="relative flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="space-y-3">
              <span className="inline-flex w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-100">
                {resource.type}
              </span>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{resource.title}</h2>
              <p className="text-sm text-slate-700 dark:text-slate-300">{resource.summary}</p>
            </div>
            <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
              <time dateTime={resource.publishedAt}>
                Publicado el {new Date(resource.publishedAt).toLocaleDateString("es-CL")}
              </time>
              <Link className="text-sm font-semibold text-emerald-600" href={resource.url}>
                Ver recurso →
              </Link>
            </div>
          </article>
        ))}
      </div>

      <section className="space-y-3 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50 p-6 text-sm text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-100">
        <h2 className="text-base font-semibold">¿Cómo funcionará el acceso?</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Autenticación con NextAuth (email magic link y cuentas de pacientes).</li>
          <li>Contenido protegido en el CMS mediante roles y etiquetas.</li>
          <li>Verificación de suscripción antes de renderizar cada recurso.</li>
        </ul>
      </section>
    </div>
  );
}