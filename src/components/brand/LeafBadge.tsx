export function LeafBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-leaf px-4 py-2 bg-brand-yellow/80 text-brand-navy shadow-soft">
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden className="opacity-80">
        <path d="M4 20c8-1 14-7 16-16 0 0-8 0-12 4S4 20 4 20Z" fill="currentColor"/>
      </svg>
      <span className="text-sm font-medium">{children}</span>
    </span>
  );
}