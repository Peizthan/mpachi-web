import React from "react";
import ColorSwatch from "./ColorSwatch";

const PALETTE = [
  { name: "brand.yellow", hex: "#FED05D" },
  { name: "brand.orange", hex: "#EC623A" },
  { name: "brand.coral",  hex: "#F28C4F" },
  { name: "brand.sage",   hex: "#6E9D7F" },
  { name: "brand.teal",   hex: "#00ABA9" },
  { name: "brand.sky",    hex: "#99D3DA" },
  { name: "brand.navy",   hex: "#1B4762" },
];

export default function BrandPalette() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {PALETTE.map((c) => <ColorSwatch key={c.name} {...c} />)}
    </section>
  );
}