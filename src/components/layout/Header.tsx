"use client";

import Link from "next/link";
import { useState } from "react";
import { mainNavigation } from "@/config/navigation";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((open) => !open);

  return (
    <header className="relative z-50 border-b border-soft bg-[color:var(--color-shell-peach)] backdrop-blur supports-[backdrop-filter]:bg-[color:var(--color-shell-peach)] dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-base font-semibold tracking-tight text-ink-primary dark:text-white">
            María Paz Jiménez
          </Link>
          <span className="hidden text-sm text-ink-magenta md:inline" aria-hidden>
            Psicóloga clínica
          </span>
        </div>
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-md border border-soft text-ink-teal transition hover:bg-surface-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--color-accent-yellow)] focus-visible:ring-offset-[color:var(--color-shell-peach)] dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900 md:hidden"
          aria-controls="primary-navigation"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
          onClick={toggleMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-6 w-6"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <nav
          id="primary-navigation"
          aria-label="Navegación principal"
          className={`${isMenuOpen ? "flex" : "hidden"} absolute left-0 top-full z-40 w-full border-b border-soft bg-surface px-4 py-4 text-sm font-medium text-ink-teal shadow-lg focus-within:block dark:border-slate-800 dark:bg-slate-950 md:static md:block md:w-auto md:border-none md:bg-transparent md:p-0 md:text-ink-teal md:shadow-none md:dark:text-slate-100`}
        >
          <ul className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
            {mainNavigation.map((item) => (
              <li key={item.href} className="list-none">
                <Link
                  href={item.href}
                  className="flex w-full items-center rounded px-3 py-2 transition hover:bg-surface-alt hover:text-ink-magenta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--color-accent-yellow)] focus-visible:ring-offset-[color:var(--color-surface)] dark:hover:bg-slate-900 md:w-auto"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
