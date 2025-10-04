# Brand Guide: María Paz Jiménez / BEING

## Paleta de colores

| Nombre descriptivo | Hex | Uso recomendado |
| --- | --- | --- |
| Mint Sereno | #789D80 | Fondos principales suaves, tarjetas informativas |
| Bruma Teal | #A6DCE0 | Fondos alternos, contenedores de datos |
| Medianoche Empática | #0E2C4B | Textos destacados, botones primarios, barras superiores |
| Girasol Templado | #F2C94C | Llamados a la acción suaves, etiquetas positivas |
| Terracota cercana | #E38953 | Botones secundarios, íconos de interacción |
| Coral corazón | #D44B4E | Alerts amigables, micro-copy emocional |
| Lavanda calma | #7F66C9 | Badges, fondos de módulos especiales |
| Gris compañero | #7D7D97 | Tipografía secundaria, iconografía neutra |
| Espuma menta (tinte) | #D4E4D0 | Fondos muy claros para secciones largas |
| Marino crema (sombra) | #0B243C | Overlays, gradientes profundos |

```css
:root {
  --color-mint-base: #789D80;
  --color-teal-soft: #A6DCE0;
  --color-navy-deep: #0E2C4B;
  --color-sun-accent: #F2C94C;
  --color-terra-warm: #E38953;
  --color-coral-heart: #D44B4E;
  --color-lavender-soft: #7F66C9;
  --color-slate-neutral: #7D7D97;
  --color-mint-tint: #D4E4D0;
  --color-navy-shadow: #0B243C;
}
```

**Implementación:** define las variables en `src/app/globals.css` (Next.js) o `src/app.css` (Svelte) y reutiliza con `var(--color-sun-accent)` para botones y elementos interactivos.

## Tipografías

| Elemento | Familia | Peso | Tamaño / line-height |
| --- | --- | --- | --- |
| h1, palabras clave | Poppins / Quicksand | 600 | clamp(2.5rem, 5vw, 3.5rem) / 1.15 |
| h2, h3 | Quicksand | 500 | h2: clamp(1.9rem, 4vw, 2.6rem) / 1.2 · h3: clamp(1.5rem, 3vw, 2.1rem) / 1.25 |
| Subtítulos, párrafos | Lexend Deca / Nunito Sans | 400 | 1rem – 1.125rem / 1.6 |
| Microcopy / labels | Lexend Deca | 300 | 0.875rem / 1.4 |
| Frases resaltadas | Caveat / Patrick Hand | 400 | clamp(1.4rem, 3vw, 2rem) / 1.3 |

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400&family=Lexend+Deca:wght@300;400;500&family=Quicksand:wght@400;500;600&display=swap" rel="stylesheet">
```

### Ejemplo Next.js con `next/font`

```ts
import { Quicksand, Lexend_Deca, Caveat } from "next/font/google";

export const quicksand = Quicksand({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-display" });
export const lexend = Lexend_Deca({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-body" });
export const caveat = Caveat({ subsets: ["latin"], weight: "400", variable: "--font-script" });
```

```css
:root {
  --font-display: "Quicksand", sans-serif;
  --font-body: "Lexend Deca", sans-serif;
  --font-script: "Caveat", cursive;
}

.hero-title {
  font-family: var(--font-display);
  letter-spacing: 0.02em;
}

.body-copy {
  font-family: var(--font-body);
  color: var(--color-navy-deep);
}

.script-highlight {
  font-family: var(--font-script);
  color: var(--color-coral-heart);
}
```

## Iconografía e ilustraciones

- Estética flat, contornos simples y colores pastel.
- Mantén trazos uniformes (2–3 px) y esquinas redondeadas.
- Usa el isotipo BEING como marca de agua (opacity 0.12), como patrón `background-repeat: repeat-y` o como bullet personalizado.

```css
.logo-border {
  background-image: url("/assets/logo-heart.svg");
  background-size: 32px;
  background-repeat: repeat-y;
}

.watermark {
  background: url("/assets/logo-heart.svg") center/220px no-repeat;
  opacity: 0.12;
}
```

## Formas y patrones

- Líneas onduladas multicolor, arcos concéntricos cálidos, blobs irregulares y flechas punteadas.

```css
.wave-divider {
  background-image:
    linear-gradient(120deg, transparent 0 20%, var(--color-terra-warm) 20% 40%, transparent 40% 100%),
    url("/assets/wave.svg");
  background-repeat: repeat;
}

.blob-container {
  clip-path: path('M10 80 Q60 10 120 40 T220 70 Q180 140 90 120 Z');
  background: var(--color-mint-tint);
  padding: clamp(1.5rem, 5vw, 3rem);
}

.arrow-dotted::after {
  content: "";
  width: 140px;
  height: 32px;
  display: block;
  background: url("/assets/arrow-dotted.svg") center/contain no-repeat;
}
```

## Guía de uso y accesibilidad

- Contrastes AA: `#0E2C4B` / `#D4E4D0` (7.4:1), `#FFFFFF` / `#0E2C4B` (12.6:1), `#0B243C` / `#F2C94C` (6.2:1).
- Usa `var(--color-sun-accent)` para los estados de foco (`:focus-visible`).
- Máximo un acento cálido por bloque de texto; mantén encabezados ≤70 caracteres.
- Proporciona `aria-label` en iconos, `alt` descriptivos en imágenes y orden semántico de headings.

## Estructura sugerida

```
/brand/
  brand-guide.md
  brand-tokens.json
/public/assets/
  logo-heart.svg
  logo-heart-outline.svg
  pattern-wave.svg
  arrow-dotted.svg
  icon-fruit-orange.svg
```

### brand-tokens.json base

```json
{
  "color": {
    "mintBase": "#789D80",
    "tealSoft": "#A6DCE0",
    "navyDeep": "#0E2C4B",
    "sunAccent": "#F2C94C",
    "terraWarm": "#E38953",
    "coralHeart": "#D44B4E",
    "lavenderSoft": "#7F66C9",
    "slateNeutral": "#7D7D97",
    "mintTint": "#D4E4D0",
    "navyShadow": "#0B243C"
  },
  "font": {
    "display": "'Quicksand', sans-serif",
    "body": "'Lexend Deca', sans-serif",
    "script": "'Caveat', cursive"
  },
  "space": {
    "xs": "0.5rem",
    "sm": "1rem",
    "md": "1.5rem",
    "lg": "3rem"
  },
  "radius": {
    "soft": "12px",
    "pill": "999px"
  }
}
```

### Ejemplo de consumo en Next.js

```ts
import tokens from "@/brand/brand-tokens.json";

export const theme = {
  ...tokens,
  buttonPrimary: {
    background: tokens.color.navyDeep,
    color: "#FFFFFF",
    radius: tokens.radius.soft,
  },
};

export function CtaButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      style={{
        backgroundColor: theme.buttonPrimary.background,
        color: theme.buttonPrimary.color,
        borderRadius: theme.buttonPrimary.radius,
        padding: `${tokens.space.sm} ${tokens.space.md}`,
      }}
    >
      {children}
    </button>
  );
}
```
