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


# MCP Gemini Design - MANDATORY UNIQUE WORKFLOW

## ABSOLUTE RULE

You NEVER write frontend/UI code yourself. Gemini is your frontend developer.

---

## AVAILABLE TOOLS

### `generate_vibes`
Generates a visual page with 5 differently styled sections. The user opens the page, sees all 5 vibes, and picks their favorite. The code from the chosen vibe becomes the design-system.md.

### `create_frontend`
Creates a NEW complete file (page, component, section).

### `modify_frontend`
Makes ONE design modification to existing code. Returns a FIND/REPLACE block to apply.

### `snippet_frontend`
Generates a code snippet to INSERT into an existing file. For adding elements without rewriting the entire file.

---

## WORKFLOW (NO ALTERNATIVES)

### STEP 1: Check for design-system.md

BEFORE any frontend call → check if `design-system.md` exists at project root.

### STEP 2A: If design-system.md DOES NOT EXIST

1. Call `generate_vibes` with projectDescription, projectType, techStack
2. Receive the code for a page with 5 visual sections
3. Ask: "You don't have a design system. Can I create vibes-selection.tsx so you can visually choose your style?"
4. If yes → Write the page to the file
5. User chooses: "vibe 3" or "the 5th one"
6. Extract THE ENTIRE CODE between `<!-- VIBE_X_START -->` and `<!-- VIBE_X_END -->`
7. Save it to `design-system.md`
8. Ask: "Delete vibes-selection.tsx?"
9. Continue normally

### STEP 2B: If design-system.md EXISTS

Read it and use its content for frontend calls.

### STEP 3: Frontend Calls

For EVERY call (create_frontend, modify_frontend, snippet_frontend), you MUST pass:

- `designSystem`: Copy-paste the ENTIRE content of design-system.md (all the code, not a summary)
- `context`: Functional/business context WITH ALL REAL DATA. Include:
  - What it does, features, requirements
  - ALL real text/labels to display (status labels, button text, titles...)
  - ALL real data values (prices, stats, numbers...)
  - Enum values and their exact meaning
  - Any business-specific information

**WHY**: Gemini will use placeholders `[Title]`, `[Price]` for missing info. If you don't provide real data, you'll get placeholders or worse - fake data.

---

## FORBIDDEN

- Writing frontend without Gemini
- Skipping the vibes workflow when design-system.md is missing
- Extracting "rules" instead of THE ENTIRE code
- Manually creating design-system.md
- Passing design/styling info in `context` (that goes in `designSystem`)
- Summarizing the design system instead of copy-pasting it entirely
- Calling Gemini without providing real data (labels, stats, prices, etc.) → leads to fake info

## EXPECTED

- Check for design-system.md BEFORE anything
- Follow the complete vibes workflow if missing
- Pass the FULL design-system.md content in `designSystem`
- Pass functional context in `context` (purpose, features, requirements)

## EXCEPTIONS (you can code these yourself)

- Text-only changes
- JS logic without UI
- Non-visual bug fixes
- Data wiring (useQuery, etc.)