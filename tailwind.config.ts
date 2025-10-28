import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: "#FED05D",
          orange: "#EC623A",
          coral:  "#F28C4F",
          sage:   "#6E9D7F",
          teal:   "#00ABA9",
          sky:    "#99D3DA",
          navy:   "#1B4762",
        },
      },
      fontFamily: {
        futura: ["Futura","system-ui","Helvetica","Arial","sans-serif"],
        znikomit: ["Znikomit","Georgia","serif"],
        modernfantasy: ["Modern Fantasy Demo Regular","Futura","system-ui","sans-serif"],
      },
      letterSpacing: {
        wideH1: "0.18em",   // per PDF: "Futura (espaciado 180 pt)" → wide display
        wideH2: "0.12em",   // "Znikomit (espaciado 120 pt)"
      },
      borderRadius: {
        leaf: "2rem", // soft, organic corners to echo leaf motif
      },
      boxShadow: {
        soft: "0 10px 25px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;