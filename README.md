# MPACHI Web

MPACHI Web is a Vite + React application for selling and delivering parenting guides, managing user accounts, and supporting future direct web sales. The current codebase includes public marketing pages, Supabase authentication, a user dashboard, and an admin panel foundation.

## Current status

- Public landing page and navigation are implemented.
- Supabase auth is connected for email/password login and signup.
- Protected user dashboard and admin routes exist.
- Baseline Supabase schema is now versioned in migrations.
- Direct checkout and monetization flows are not implemented yet.

## Stack

- Vite
- React + TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase
- React Router
- TanStack Query

## Local development

```sh
git clone <YOUR_GIT_URL>
cd mpachi-web
npm install
npm run dev
```

## Environment variables

Create a local `.env` based on `.env.example`.

Required variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Do not commit real secrets. `.env` is ignored by git.

## Scripts

- `npm run dev` - start local dev server
- `npm run build` - production build
- `npm run build:dev` - development-mode build
- `npm run preview` - preview the production build
- `npm run lint` - lint the codebase

## Supabase workflow

The project now stores schema in Supabase migrations.

Key files:

- [supabase/config.toml](supabase/config.toml)
- [supabase/migrations/20260417000100_init_app_schema.sql](supabase/migrations/20260417000100_init_app_schema.sql)
- [supabase/seed.sql](supabase/seed.sql)

Common commands:

```sh
npx supabase link --project-ref khrsqcnkedwmuykxkxyn
npx supabase db push
```

If CLI role auth fails, use the database password route:

```powershell
$env:SUPABASE_DB_PASSWORD="YOUR_DB_PASSWORD"
npx supabase db push
```

## Deployment

Vercel configuration:

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`

Production requires these Vercel env vars:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## App structure

- Public landing page: [src/pages/Index.tsx](src/pages/Index.tsx)
- Auth page: [src/pages/Auth.tsx](src/pages/Auth.tsx)
- User dashboard: [src/pages/Dashboard.tsx](src/pages/Dashboard.tsx)
- Admin dashboard: [src/pages/AdminDashboard.tsx](src/pages/AdminDashboard.tsx)
- Auth context: [src/context/AuthContext.tsx](src/context/AuthContext.tsx)
- Supabase client: [src/supabaseClient.ts](src/supabaseClient.ts)

## Next priorities

1. Finish registration lifecycle and auto-profile verification.
2. Harden environment and CI safety.
3. Implement store, checkout, and payment confirmation flow.
4. Grant guide access from verified purchases.
