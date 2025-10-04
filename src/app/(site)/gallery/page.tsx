import Image from "next/image";
import Link from "next/link";
import { getGalleryItems } from "@/lib/cms";
import { instagramUrl } from "@/config/navigation";

export default async function GalleryPage() {
  const galleryItems = await getGalleryItems();

  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-16 md:px-6">
      <div className="space-y-3 text-center md:text-left">
        <h1 className="text-4xl font-semibold text-ink-primary dark:text-white">Galería de proyectos</h1>
        <p className="text-base text-ink-teal dark:text-slate-300">
          Experiencias clínicas y formativas realizadas por María Paz Jiménez. Las imágenes se gestionan desde el CMS para mantener la galería actualizada.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {galleryItems.map((item) => (
          <figure
            key={item.id}
            className="space-y-3 rounded-2xl border border-soft bg-surface p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-alt">
              <Image
                src={item.imageUrl}
                alt={item.alt || `Registro fotográfico: ${item.title}`}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
            <figcaption className="space-y-1 text-sm text-ink-teal dark:text-slate-300">
              <p className="font-semibold text-ink-primary dark:text-white">{item.title}</p>
              {item.description ? <p>{item.description}</p> : null}
            </figcaption>
          </figure>
        ))}
      </div>
      <aside className="rounded-2xl border border-soft bg-surface-alt p-6 text-sm text-ink-teal">
        <h2 className="text-base font-semibold text-ink-primary">Más historias en Instagram</h2>
        <p className="mt-2 text-ink-teal">
          Sigue a María Paz para ver registros de talleres, cápsulas educativas y testimonios.
        </p>
        <Link
          href={instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ink-magenta underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-sun-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-surface)]"
        >
          Ir a Instagram
          <span aria-hidden>-&gt;</span>
        </Link>
      </aside>
    </div>
  );
}
