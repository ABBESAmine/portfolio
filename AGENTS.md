# AGENTS.md — Portfolio Dev Full-Stack

## Projet

Portfolio développeur full-stack, site vitrine one-page avec back-office admin.

## Stack technique

- **Framework** : Next.js 14 (App Router), React 18, TypeScript
- **Styling** : Tailwind CSS
- **Animations** : GSAP (ScrollTrigger), Framer Motion, Three.js (React Three Fiber + Drei)
- **Backend** : Route Handlers Next.js (`/api/*`), Supabase (Auth + Postgres + RLS), Resend (emails)
- **Déploiement** : Vercel ou Netlify

## Architecture

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx              # Page d'accueil SSR (fetch Supabase)
│   ├── admin/                # Back-office (login Supabase Auth, CRUD)
│   └── api/
│       ├── contact/route.ts  # POST email via Resend + rate limit
│       ├── skills/           # GET public (anon), POST/DELETE (RLS admin)
│       ├── experiences/      # GET public (anon), POST/DELETE (RLS admin)
│       └── projects/         # GET public (anon), POST/DELETE (RLS admin)
├── components/
│   ├── Hero.tsx / Hero3D.tsx  # Bannière 3D (R3F + Drei) + halos
│   ├── About.tsx
│   ├── Skills.tsx
│   ├── Experience.tsx
│   ├── Projects.tsx
│   ├── Contact.tsx
│   └── Footer.tsx
├── lib/
│   ├── supabase/             # Clients server (public/admin), auth
│   └── config.ts
└── docs/
    └── ADMIN.md              # Configuration admin et Supabase
```

## Charte graphique

| Rôle       | Couleur   | Hex       |
|------------|-----------|-----------|
| Principal  | Vert      | `#0B6E4F` |
| Accent     | Rouge     | `#C1272D` |
| Or         | Or        | `#C6A75E` |
| Fond       | Crème     | `#FDF8F0` |

Typographie : moderne, lisible, sans-serif. Ton visuel premium et épuré.

## Fonctionnalités clés

- **Page d'accueil** : Hero 3D immersif, sections Skills / Experiences / Projects alimentées par Supabase (lecture publique via RLS)
- **Contact** : formulaire POST `/api/contact`, validation, rate limiting, envoi email Resend
- **Admin** : login email/mot de passe Supabase Auth, CRUD compétences / expériences / projets (RLS via `admin_users` + `is_admin()`)
- **Données** : 100% dynamiques depuis Supabase, pas de fallback statique
- **SEO** : métadonnées, JSON-LD
