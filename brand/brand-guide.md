# Brand Guide: Maria Paz Jimenez / BEING

## Paleta de colores

| Nombre | Hex | Uso sugerido |
| --- | --- | --- |
| Base Crema Suave | #FFFFFF | Fondo principal blanco para todas las páginas |
| Crema Radiante | #FFFFFF | Tarjetas sobre fondo blanco |
| Crema Resalte | #FFFFFF | Callouts sobre fondo blanco |
| Rayo Dorado | #FFDE21 | Botones primarios, iconos de llamada a la accion, resaltados |
| Azul Noche | #1F2B6C | Titulares, enlaces principales, texto de alto contraste |
| Teal Profundo | #0F6F79 | Subtitulos, indicadores de navegacion, etiquetas |
| Ciruela Vibrante | #7A2E8A | Badges, citas destacadas, elementos decorativos |
| Magenta Viva | #B8336A | Palabras clave, bullets personalizados |
| Esmeralda Clara | #0F7F4B | Estados exitosos, listados positivos, iconografia |
| Coral Calido | #D84563 | Alertas suaves, recordatorios |
| Grafito Nocturno | #2D2A2E | Texto invertido sobre fondos contrastantes, iconos neutros |
| Durazno Suave | #FFE8DB | Fondos de cabecera y pie, bloques destacados cálidos |

```css
:root {
  --color-base-cream: #FFFFFF;
  --color-surface: #FFFFFF;
  --color-surface-alt: #FFFFFF;
  --color-accent-yellow: #FFDE21;
  --color-ink-primary: #1F2B6C;
  --color-ink-teal: #0F6F79;
  --color-ink-plum: #7A2E8A;
  --color-ink-magenta: #B8336A;
  --color-ink-emerald: #0F7F4B;
  --color-ink-coral: #D84563;
  --color-ink-graphite: #2D2A2E;
}
```

**Implementacion:** centraliza las variables en `src/app/globals.css` (Next.js) o `src/app.css` (Svelte) y aplica los tonos de texto con clases utilitarias (ej.: `.text-primary { color: var(--color-ink-primary); }`). Para fondos o botones, utiliza `background-color: var(--color-accent-yellow);` y combina con texto oscuro (`var(--color-ink-graphite)`) para garantizar contraste AA.

## Tipografias

- **Titulos y palabras clave:** sans serif redondeada. Google Fonts sugeridas: `Quicksand` (400, 500, 600) o `Poppins`.
- **Subtitulos y cuerpo de texto:** sans serif estrecha y ligera. Sugerencia: `Lexend Deca` (300, 400, 500).
- **Acentos manuscritos:** `Caveat` (400) para frases destacadas cortas.

| Elemento | Familia | Peso | Tamano | Line-height |
| --- | --- | --- | --- | --- |
| h1 | Quicksand | 600 | clamp(2.5rem, 5vw, 3.5rem) | 1.15 |
| h2 | Quicksand | 500 | clamp(1.9rem, 4vw, 2.6rem) | 1.2 |
| h3 / Subtitulo | Quicksand | 500 | clamp(1.5rem, 3vw, 2.1rem) | 1.25 |
| Parrafo | Lexend Deca | 400 | 1rem - 1.125rem | 1.6 |
| Microcopy | Lexend Deca | 300 | 0.875rem | 1.4 |
| Script highlight | Caveat | 400 | clamp(1.4rem, 3vw, 2rem) | 1.3 |

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400&family=Lexend+Deca:wght@300;400;500&family=Quicksand:wght@400;500;600&display=swap" rel="stylesheet">
```

### Ejemplo Next.js con `next/font`

```ts
import { Quicksand, Lexend_Deca, Caveat } from "next/font/google";

export const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
});

export const lexend = Lexend_Deca({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
});

export const caveat = Caveat({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
});
```

```css
:root {
  --font-display: "Quicksand", sans-serif;
  --font-body: "Lexend Deca", sans-serif;
  --font-script: "Caveat", cursive;
}

.hero-title {
  font-family: var(--font-display);
  color: var(--color-ink-primary);
}

.body-copy {
  font-family: var(--font-body);
  color: var(--color-ink-teal);
}

.script-highlight {
  font-family: var(--font-script);
  color: var(--color-ink-magenta);
}
```

## Iconografia e ilustraciones

- Estilo flat, contornos suaves (2-3 px) y tonos pastel que ahora contrastan con el fondo crema.
- El isotipo BEING (contorno cuadrado con corazon central) puede pintarse en `var(--color-accent-yellow)` sobre fondos `var(--color-ink-primary)` o viceversa.
- Usa trazos en `var(--color-ink-primary)` o `var(--color-ink-teal)` para asegurar visibilidad contra el fondo claro.

```css
.logo-border {
  background-image: url("/assets/logo-heart.svg");
  background-size: 32px;
  background-repeat: repeat-y;
  filter: hue-rotate(12deg) saturate(120%);
}

.watermark {
  background: url("/assets/logo-heart.svg") center/200px no-repeat;
  opacity: 0.1;
  mix-blend-mode: multiply;
}
```

## Formas y patrones

- Mantener ondas, arcos y flechas pero recoloreados con la paleta arcoiris (azul noche, teal, magenta, esmeralda, amarillo).
- Para separar secciones en el fondo crema, usa bloques `background-color: #FFFFFF;`.

```css
.wave-divider {
  background-color: #FFFFFF;
  background-size: cover;
}

.arrow-dotted::after {
  content: "";
  display: block;
  width: 160px;
  height: 32px;
  background: url("/assets/arrow-dotted.svg") center/contain no-repeat;
  filter: hue-rotate(320deg) saturate(120%);
}
```

## Guia de uso y accesibilidad

- Contraste AA validado sobre #FFFFFF: Azul Noche (12.3:1), Teal Profundo (5.6:1), Ciruela Vibrante (7.7:1), Magenta Viva (5.4:1), Esmeralda Clara (4.8:1), Coral Calido (4.0:1). Utiliza textos largos con colores >= 4.5:1; reserva coral para negritas cortas.
- Botones amarillos (#FFDE21) deben llevar texto en Azul Noche (#1F2B6C) o Grafito (#2D2A2E) para 7.3:1.
- Aplica `outline: 3px solid var(--color-accent-yellow);` para el foco en componentes.
- Mantener espaciado generoso (padding vertical de 56px desktop / 40px mobile) y max-width 70ch para parrafos.
- Siempre incluir `aria-label` en iconos, `alt` descriptivo y roles adecuados.

## Estructura de entrega

```
/brand/
  brand-guide.md
  brand-tokens.json
/public/assets/
  logo-heart.svg
  pattern-wave.svg
  arrow-dotted.svg
  icon-fruit-orange.svg
```

### brand-tokens.json base

```json
{
  "color": {
    "creamBase": "#FFFFFF",
    "creamSurface": "#FFFFFF",
    "creamHighlight": "#FFFFFF",
    "accentYellow": "#FFDE21",
    "inkNavy": "#1F2B6C",
    "inkTeal": "#0F6F79",
    "inkPlum": "#7A2E8A",
    "inkMagenta": "#B8336A",
    "inkEmerald": "#0F7F4B",
    "inkGraphite": "#2D2A2E",
    "accentCoral": "#D84563"
  },
  "font": {
    "display": "\"Quicksand\", sans-serif",
    "body": "\"Lexend Deca\", sans-serif",
    "script": "\"Caveat\", cursive"
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

### Importacion en Next.js

```ts
import tokens from "@/brand/brand-tokens.json";

export const theme = {
  ...tokens,
  buttonPrimary: {
    background: tokens.color.accentYellow,
    color: tokens.color.inkNavy,
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

En Svelte, importa con `import tokens from "$lib/brand/brand-tokens.json";` y aplica los valores directamente en el componente.

