"use client";

import { FormEvent, useState } from "react";

type FormState = {
  name: string;
  email: string;
  reason: string;
  acceptsTerms: boolean;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = {
  name: "",
  email: "",
  reason: "",
  acceptsTerms: false,
};

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleChange = (field: keyof FormState) => (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    const value = target.type === "checkbox" ? (target as HTMLInputElement).checked : target.value;

    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors: FieldErrors = {};

    if (!formState.name.trim()) {
      errors.name = "Ingresa tu nombre completo";
    }

    if (!formState.email.trim()) {
      errors.email = "Ingresa un correo electrónico válido";
    }

    if (!formState.reason.trim()) {
      errors.reason = "Cuéntanos brevemente el motivo de consulta";
    }

    if (!formState.acceptsTerms) {
      errors.acceptsTerms = "Debes aceptar los términos y condiciones";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStatus("error");
      setMessage("Revisa los campos resaltados para continuar");
      return;
    }

    setStatus("submitting");
    setMessage("");

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
      setMessage("Gracias por tu mensaje. Te contactaremos pronto.");
      setFormState(initialState);
      setFieldErrors({});
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("Ocurrió un error. Intenta nuevamente más tarde.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-soft bg-surface p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div role="alert" aria-live="assertive" className="min-h-[1.75rem] text-sm">
        {message ? (
          <p className={status === "success" ? "text-ink-emerald" : "text-[color:var(--color-coral-heart)]"}>
            {message}
          </p>
        ) : null}
      </div>

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
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? "name-error" : undefined}
          className="w-full rounded-lg border border-soft px-3 py-2 text-sm text-ink-indigo-950 shadow-sm transition hover:border-[color:var(--color-mint-base)] focus:border-[color:var(--color-ink-emerald)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-sun-accent)] dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />
        {fieldErrors.name ? (
          <p id="name-error" className="text-xs text-[color:var(--color-coral-heart)]">
            {fieldErrors.name}
          </p>
        ) : null}
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
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
          className="w-full rounded-lg border border-soft px-3 py-2 text-sm text-ink-indigo-950 shadow-sm transition hover:border-[color:var(--color-mint-base)] focus:border-[color:var(--color-ink-emerald)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-sun-accent)] dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />
        {fieldErrors.email ? (
          <p id="email-error" className="text-xs text-[color:var(--color-coral-heart)]">
            {fieldErrors.email}
          </p>
        ) : null}
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
          aria-invalid={Boolean(fieldErrors.reason)}
          aria-describedby={fieldErrors.reason ? "reason-error" : undefined}
          className="w-full rounded-lg border border-soft px-3 py-2 text-sm text-ink-indigo-950 shadow-sm transition hover:border-[color:var(--color-mint-base)] focus:border-[color:var(--color-ink-emerald)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-sun-accent)] dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />
        {fieldErrors.reason ? (
          <p id="reason-error" className="text-xs text-[color:var(--color-coral-heart)]">
            {fieldErrors.reason}
          </p>
        ) : null}
      </div>

      <div className="flex items-start gap-2">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          checked={formState.acceptsTerms}
          onChange={handleChange("acceptsTerms")}
          aria-invalid={Boolean(fieldErrors.acceptsTerms)}
          aria-describedby={fieldErrors.acceptsTerms ? "terms-error" : undefined}
          className="mt-1 h-4 w-4 rounded border-soft text-ink-primary focus:ring-[color:var(--color-sun-accent)] focus:ring-offset-1"
          required
        />
        <label htmlFor="terms" className="text-xs text-ink-indigo-950 dark:text-slate-300">
          Acepto los <a className="underline" href="/politica-de-privacidad">términos y condiciones</a> del servicio.
        </label>
      </div>
      {fieldErrors.acceptsTerms ? (
        <p id="terms-error" className="text-xs text-[color:var(--color-coral-heart)]">
          {fieldErrors.acceptsTerms}
        </p>
      ) : null}

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-full bg-accent-yellow px-6 py-3 text-sm font-semibold text-ink-primary transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-ink-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-surface)] disabled:cursor-not-allowed"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Enviando…" : "Enviar solicitud"}
      </button>
    </form>
  );
}
