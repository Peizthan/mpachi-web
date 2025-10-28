import BrandPalette from "@/components/brand/BrandPalette";
import TypeSpecimen from "@/components/brand/TypeSpecimen";
import { LeafBadge } from "@/components/brand/LeafBadge";

export default function BrandShowcasePage() {
  return (
    <main className="min-h-dvh bg-gradient-to-b from-brand-yellow/30 via-white to-brand-sky/20">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <LeafBadge>Psicología clínica — mundo amarillo</LeafBadge>

        <h1 className="mt-6 text-6xl md:text-7xl font-futura tracking-wideH1 text-brand-navy leading-[1.05]">
          María Paz Jiménez <span className="text-brand-orange">Re-branding</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-700">
          Represent the internal world in constant construction and evolution. The leaf stands for life and growth.
        </p>

        <div className="mt-10 flex gap-4">
          <a
            href="#contact"
            className="rounded-xl bg-brand-teal px-6 py-3 text-white font-medium shadow-soft hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-teal/60"
          >
            Get in touch
          </a>
          <a
            href="#about"
            className="rounded-xl border border-brand-navy/20 px-6 py-3 text-brand-navy hover:bg-brand-navy/5"
          >
            Learn more
          </a>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-2">
          <BrandPalette />
          <TypeSpecimen />
        </div>
      </section>
    </main>
  );
}