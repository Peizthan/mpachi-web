import Link from "next/link";
import { instagramUrl } from "@/config/navigation";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-start md:justify-between md:px-6">
        <div className="max-w-sm space-y-2">
          <p className="text-base font-semibold text-slate-900 dark:text-white">María Paz Jiménez</p>
          <p>Psicóloga clínica especializada en bienestar emocional para niñas, niños, adolescentes y adultos.</p>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Contacto</p>
          <address className="not-italic space-y-1">
            <p>
              <a className="hover:underline" href="mailto:contacto@being.cl">
                contacto@being.cl
              </a>
            </p>
            <p>
              <a className="hover:underline" href="tel:+56900000000">
                +56 9 0000 0000
              </a>
            </p>
          </address>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Redes sociales</p>
          <Link className="inline-flex items-center gap-2 hover:underline" href={instagramUrl} target="_blank" rel="noreferrer">
            <span aria-hidden>📸</span>
            BEING en Instagram
          </Link>
        </div>
      </div>
      <div className="border-t border-slate-200 bg-white px-4 py-4 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 md:px-6">
        © {new Date().getFullYear()} María Paz Jiménez. Todos los derechos reservados.
      </div>
    </footer>
  );
}