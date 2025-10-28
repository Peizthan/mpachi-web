import { ContactForm } from "@/components/forms/ContactForm";

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-4 py-16 md:grid-cols-[1fr_1.2fr] md:px-6">
      <section className="space-y-4">
        <h1 className="text-4xl font-semibold text-ink-primary dark:text-white">Registro de pacientes</h1>
        <p className="text-base text-ink-indigo-950 dark:text-slate-300">
          Completa el formulario y cuéntanos brevemente qué te motivó a acercarte. Recibirás un correo con la disponibilidad y los pasos para confirmar la primera sesión.
        </p>
        <div className="rounded-2xl border border-soft bg-surface-alt p-6 text-sm text-ink-indigo-950">
          <h2 className="text-base font-semibold text-ink-primary">Confidencialidad</h2>
          <p className="mt-2">
            La información se utiliza únicamente para coordinar la primera entrevista clínica. Los datos se almacenan cumpliendo la normativa internacional de protección de datos personales.
          </p>
        </div>
      </section>
      <ContactForm />
    </div>
  );
}
