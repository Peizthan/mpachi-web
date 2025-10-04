import Link from "next/link";
import { instagramUrl } from "@/config/navigation";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-sm text-ink-primary">
      <div className="bg-[color:var(--color-shell-peach)]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-start md:justify-between md:px-6">
          <div className="max-w-sm space-y-2">
            <p className="text-base font-semibold text-ink-primary">María Paz Jiménez</p>
            <p className="text-ink-teal">
              Psicóloga clínica especializada en bienestar emocional para niñas, niños, adolescentes y adultos.
            </p>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold text-ink-primary">Contacto</p>
            <address className="not-italic space-y-1 text-ink-teal">
              <p>
                <a
                  className="transition hover:text-ink-magenta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-sun-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-shell-peach)]"
                  href="mailto:mariapazj@gmail.com"
                >
                  mariapazj@gmail.com
                </a>
              </p>
              <p>
                <a
                  className="transition hover:text-ink-magenta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-sun-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-shell-peach)]"
                  href="tel:+595983448991"
                >
                  +595 983 448991
                </a>
              </p>
            </address>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold text-ink-primary">Redes sociales</p>
            <Link
              className="inline-flex items-center gap-2 text-ink-teal transition hover:text-ink-magenta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-sun-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-shell-peach)]"
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Abrir Instagram de María Paz Jiménez"
            >
              <svg
                aria-hidden
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-4 w-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 3.75h8A4.25 4.25 0 0 1 20.25 8v8A4.25 4.25 0 0 1 16 20.25H8A4.25 4.25 0 0 1 3.75 16V8A4.25 4.25 0 0 1 8 3.75Z" />
                <circle cx="12" cy="12" r="3.25" />
                <path d="M16.5 7.5h.01" />
              </svg>
              @psi.mariapazjimenez
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-soft bg-[color:var(--color-shell-peach)] px-4 py-4 text-center text-xs text-ink-teal md:px-6">
        {currentYear} María Paz Jiménez. Todos los derechos reservados.
      </div>
    </footer>
  );
}
