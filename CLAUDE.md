# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Dev server on http://localhost:3000 — run WITHOUT rtk (long-running process)
rtk next build       # Production build
rtk npm run lint     # ESLint via next lint
```

RTK filters output for finite commands. Never use `rtk` with long-running processes (`dev`, `start`) — run them directly.

## Architecture

Single-page portfolio built with **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, **GSAP**, and **Supabase**.

### Data flow

The home page (`src/app/page.tsx`) is a Server Component that fetches skills, experiences, and projects from Supabase at request time via `getSupabasePublic()` (`src/lib/supabase-server.ts`), then passes them as `initialData` props to client components. If Supabase env vars are missing, it fails open and returns empty arrays.

### Key directories

- `src/app/` — layout, home page, API routes, sitemap, robots
- `src/components/` — page sections (Hero, About, Skills, Experience, Projects, Contact, Footer) + shared UI (Nav, ThemeProvider, ScrollProgress)
- `src/components/admin/` — admin CRUD forms (skills, experiences, projects)
- `src/app/admin/` — admin page + hooks (`useAdminSession`, `useAdminData`)
- `src/lib/` — Supabase clients, auth helpers, social URL config

### Admin panel (`/admin`)

Protected by middleware (`src/middleware.ts`) which adds `X-Robots-Tag: noindex` and optionally HTTP Basic Auth via `ADMIN_PATH_SECRET`. The admin UI uses client-side Supabase auth (session stored in localStorage) — **not** cookie-based. CRUD operations go through the Next.js API routes (`/api/skills`, `/api/experiences`, `/api/projects`) with JWT from the session passed as Bearer token.

### API routes

- `POST /api/contact` — sends email via Resend, rate-limits by IP using a `contact_rate_limit` Supabase table (5 requests / 10 min window, fail-open on DB error)
- `GET/POST /api/skills`, `GET/POST /api/experiences`, `GET/POST /api/projects` — CRUD for CMS data, require Bearer token
- `DELETE /api/skills/[id]`, `/api/experiences/[id]`, `/api/projects/[id]`

### Theme system

CSS variables in `src/app/globals.css` define all colors under `:root` (light) and `.dark` (dark). Tailwind is configured with `darkMode: "class"`. A blocking inline script in `layout.tsx` reads `localStorage.getItem('theme')` (or `prefers-color-scheme`) and toggles the `dark` class on `<html>` before React hydrates, preventing flash. `ThemeProvider` (`src/components/ThemeProvider.tsx`) then syncs React state to the DOM and exposes `useTheme()` / `ThemeToggle`.

### Styling conventions

All colors use CSS variables via Tailwind aliases (`bg-background`, `text-heading`, `text-muted`, `bg-card`, etc.) — never hardcode hex values. Fonts: `font-sans` (Inter), `font-mono` (JetBrains Mono), `font-display` (Syne).

### Environment variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY      # server-only, used by admin API routes
RESEND_API_KEY                 # contact form email sending
CONTACT_TO_EMAIL               # destination email for contact form
NEXT_PUBLIC_SITE_URL           # canonical URL for SEO metadata
ADMIN_PATH_SECRET              # optional HTTP Basic Auth for /admin
```

### Social links

Edit `src/lib/config.ts` to update GitHub and LinkedIn URLs used across the site.
