import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mpachi.vercel.app"),
  title: {
    default: "María Paz Jiménez | Psicóloga Clínica",
    template: "%s | María Paz Jiménez",
  },
  description:
    "Psicoterapia para niños, adolescentes y adultos, asesorías a padres, talleres y recursos educativos liderados por María Paz Jiménez.",
  keywords: [
    "psicoterapia",
    "psicóloga clínica",
    "salud mental",
    "talleres de bienestar",
    "Chile",
    "María Paz Jiménez",
  ],
  authors: [{ name: "María Paz Jiménez" }],
  openGraph: {
    title: "María Paz Jiménez | Psicóloga Clínica",
    description:
      "Psicoterapia integral, orientación familiar y contenidos educativos para el bienestar emocional.",
    url: "https://mpachi.vercel.app",
    siteName: "María Paz Jiménez",
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "María Paz Jiménez | Psicóloga Clínica",
    description:
      "Psicoterapia integral, orientación familiar y contenidos educativos para el bienestar emocional.",
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#163C4D",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100`}
      >
        <a
          href="#contenido-principal"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-md focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-white"
        >
          Saltar al contenido principal
        </a>
        <Header />
        <main id="contenido-principal" className="min-h-[70vh]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}