"use client";

import { FormEvent, useState } from "react";

const initialState = {
  name: "",
  email: "",
  reason: "",
  acceptsTerms: false,
};

type FormState = typeof initialState;

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (field: keyof FormState) => (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    const value = target.type === "checkbox" ? (target as HTMLInputElement).checked : target.value;

    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.name || !formState.email || !formState.reason || !formState.acceptsTerms) {
      setErrorMessage("Por favor, completa todos los campos y acepta los términos.");
      return;
    }

    setErrorMessage(null);
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      if (!response.ok) {
        throw new Error("Solicitud no procesada");
      }

      setStatus("success");
      setFormState(initialState);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage("Ocurrió un error. Intenta nuevamente más tarde.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-soft bg-surface p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-semibold text-ink-primary dark:text-slate-100">
          Nombre completo
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={formState.name}
          onInput={handleChange("name")}
          className="w-full rounded-lg border border-soft px-3 py-2 text-sm text-ink-teal shadow-sm transition focus:border-[color:var(--color-ink-emerald)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent-yellow)] dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-semibold text-ink-primary dark:text-slate-100">
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={formState.email}
          onInput={handleChange("email")}
          className="w-full rounded-lg border border-soft px-3 py-2 text-sm text-ink-teal shadow-sm transition focus:border-[color:var(--color-ink-emerald)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent-yellow)] dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="reason" className="text-sm font-semibold text-ink-primary dark:text-slate-100">
          Motivo de consulta
        </label>
        <textarea
          id="reason"
          name="reason"
          rows={4}
          required
          value={formState.reason}
          onInput={handleChange("reason")}
          className="w-full rounded-lg border border-soft px-3 py-2 text-sm text-ink-teal shadow-sm transition focus:border-[color:var(--color-ink-emerald)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent-yellow)] dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />
      </div>

      <div className="flex items-start gap-2">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          checked={formState.acceptsTerms}
          onChange={(event) =>
            setFormState((prev) => ({ ...prev, acceptsTerms: event.target.checked }))
          }
          className="mt-1 h-4 w-4 rounded border-soft text-ink-primary focus:ring-[color:var(--color-accent-yellow)]"
          required
        />
        <label htmlFor="terms" className="text-xs text-ink-teal dark:text-slate-300">
          Acepto los <a className="underline" href="/politica-de-privacidad">términos y condiciones</a> del servicio.
        </label>
      </div>

      {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
      {status === "success" ? <p className="text-sm text-ink-emerald">Gracias por tu mensaje. Te contactaremos pronto.</p> : null}

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-full bg-accent-yellow px-6 py-3 text-sm font-semibold text-ink-primary transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--color-ink-primary)] focus-visible:ring-offset-[color:var(--color-surface)] disabled:cursor-not-allowed"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Enviando…" : "Enviar solicitud"}
      </button>
    </form>
  );
}
