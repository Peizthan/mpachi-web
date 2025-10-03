import type { Metadata, Viewport } from "next";
import { Quicksand, Lexend_Deca, Caveat } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-brand-display",
});

const lexendDeca = Lexend_Deca({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-brand-body",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-brand-script",
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
  themeColor: "#FFFFFF",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`scroll-smooth ${quicksand.variable} ${lexendDeca.variable} ${caveat.variable}`}>
      <body className="font-sans antialiased">
        <a href="#contenido-principal" className="skip-link">
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
