export default function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="bg-[color:var(--color-mint-tint)] py-16">{children}</div>;
}
