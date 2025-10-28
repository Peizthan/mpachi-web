export default function TypeSpecimen() {
  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-5xl tracking-wideH1 font-[400] font-futura text-brand-navy">
          Futura Heading — Growth & Optimism
        </h1>
        <p className="mt-3 text-lg text-slate-700">
          Primary sans for headings and UI. Use generous tracking for hero titles.
        </p>
      </div>

      <div>
        <h2 className="text-4xl tracking-wideH2 font-znikomit text-brand-orange">
          Znikomit Display — Accent Serif
        </h2>
        <p className="mt-2 text-base text-slate-700">
          Use for pull quotes, section accents, or brand marks. Pair with brand coral/orange.
        </p>
      </div>

      <div>
        <h3 className="text-4xl font-modernfantasy text-brand-teal">
          Modern Fantasy — Decorative
        </h3>
        <p className="mt-2 text-base text-slate-700">
          Decorative only, large sizes; avoid long paragraphs.
        </p>
      </div>
    </section>
  );
}