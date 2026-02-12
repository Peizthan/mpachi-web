# MPACHI Web

Single-page site for digital guides and 1:1 consultations. Built as a clean, fast Vite + React SPA with Tailwind styling and anchor-based navigation.

## Stack

- Vite
- React + TypeScript
- Tailwind CSS
- shadcn/ui

## Local development

```sh
git clone <YOUR_GIT_URL>
cd mpachi-web
npm install
npm run dev
```

## Scripts

- `npm run dev` - start local dev server
- `npm run build` - production build
- `npm run preview` - preview the production build
- `npm run lint` - lint the codebase

## Deployment (Vercel)

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`

## Notes

- Main page lives in [src/pages/Index.tsx](src/pages/Index.tsx).
- Navigation uses in-page anchors: `#inicio`, `#productos`, `#sobre-mi`, `#consultas`, `#blog`.
