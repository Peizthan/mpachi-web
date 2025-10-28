import React from "react";

type Swatch = { name: string; hex: string };
export default function ColorSwatch({ name, hex }: Swatch) {
  return (
    <div className="rounded-2xl shadow-soft border border-black/5 overflow-hidden">
      <div className="h-20" style={{ backgroundColor: hex }} />
      <div className="p-3 text-sm flex items-center justify-between">
        <span className="font-medium">{name}</span>
        <code className="text-xs text-slate-600">{hex}</code>
      </div>
    </div>
  );
}