export default function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="bg-slate-900/5 py-16">{children}</div>;
}