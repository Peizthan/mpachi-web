import { ContactForm } from "@/components/forms/ContactForm";

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-4 py-16 md:grid-cols-[1fr_1.2fr] md:px-6">
      <section className="space-y-4">
        <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">Registro de pacientes</h1>
        <p className="text-base text-slate-700 dark:text-slate-300">
          Completa el formulario y cuéntanos brevemente tu motivo de consulta. Recibirás un correo con la disponibilidad y los pasos para confirmar la primera sesión.
        </p>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-900/20 dark:text-emerald-100">
          <h2 className="text-base font-semibold">Confidencialidad</h2>
          <p className="mt-2">
            La información se utiliza únicamente para coordinar la primera entrevista clínica. Los datos se almacenan cumpliendo la normativa chilena de protección de datos personales.
          </p>
        </div>
      </section>
      <ContactForm />
    </div>
  );
}