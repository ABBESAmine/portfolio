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

---

# MCP Gemini Design — OBLIGATOIRE POUR LE FRONTEND

## RÈGLE ABSOLUE — NE JAMAIS IGNORER

**Tu ne dois JAMAIS écrire de code frontend/UI toi-même.**

Gemini est ton développeur frontend. Tu n'es PAS autorisé à créer des composants visuels, des pages ou des interfaces sans passer par Gemini. C'est NON NÉGOCIABLE.

## Quand utiliser Gemini ? TOUJOURS pour :

- Créer une page (accueil, admin dashboard, settings, etc.)
- Créer un composant visuel (card, modal, sidebar, formulaire, bouton, section, etc.)
- Modifier le design d'un élément existant (marges, couleurs, layout, responsive)
- Tout ce qui touche au styling ou au layout

## Exceptions (tu peux faire toi-même) :

- Modifier du texte/contenu statique
- Ajouter de la logique JS/TS sans changer l'UI (hooks, fetchers, handlers)
- Corriger des bugs non visuels
- Câbler les données (useQuery, useMutation, fetch Supabase, etc.)
- Logique Three.js / GSAP / Framer Motion (animations programmatiques)
- Configuration Supabase, routes API, middleware

## Workflow obligatoire

1. **Nouveau projet / première page** : appeler `create_frontend` avec `generateDesignSystem: true`
2. **Sauvegarder le design system** : stocker le `designSystem` retourné dans `design-system.md` à la racine du projet
3. **Pages suivantes** : toujours passer `projectRoot` pour que Gemini charge automatiquement le design system et garde la cohérence
4. **Projet existant avec styles** : passer les fichiers CSS/Tailwind config dans `context`

## Contexte design pour Gemini

Quand tu appelles Gemini, inclus toujours ce contexte :

- **Palette** : vert `#0B6E4F` (principal), rouge `#C1272D` (accent), or `#C6A75E` (highlights), fond crème `#FDF8F0`
- **Style** : premium, épuré, moderne, dark sections possibles avec fond sombre
- **Framework** : React 18 + TypeScript + Tailwind CSS
- **Responsive** : mobile-first obligatoire
- **Animations** : prévoir les classes/structure pour intégrer GSAP et Framer Motion après génération

## Checklist avant de coder du frontend

- [ ] Est-ce que je crée ou modifie quelque chose de visuel ? → **OUI** → Utiliser Gemini
- [ ] Est-ce de la pure logique sans impact UI ? → **OUI** → Tu peux continuer seul

## CE QUI EST INTERDIT

- Écrire un composant React avec du styling sans passer par Gemini
- Créer une page ou une section visuelle sans Gemini
- Utiliser « je réutilise les styles existants » comme excuse pour ne pas appeler Gemini
- Faire du frontend « vite fait » toi-même

## CE QUI EST ATTENDU

- Appeler Gemini AVANT d'écrire la moindre ligne de frontend
- Utiliser `generateDesignSystem: true` pour la PREMIÈRE page, sauvegarder `design-system.md`
- Passer `projectRoot` pour tous les appels suivants
- Laisser Gemini designer, toi tu implémentes la logique et le câblage données