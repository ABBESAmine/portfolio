# Portfolio Full-Stack

Portfolio avec **Next.js 14** (App Router), **TypeScript**, **Tailwind CSS**, **GSAP** et une API backend pour le formulaire de contact.

## Stack

- **Frontend** : Next.js 14, React, Tailwind CSS, GSAP (ScrollTrigger)
- **Backend** : Route Handlers Next.js (`/api/contact`)
- **Base de données** : optionnel (Supabase/Turso) — à brancher dans l’API contact

## Démarrage

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Structure

- `src/app/` — layout, page d’accueil, styles globaux
- `src/app/api/contact/` — API POST pour le formulaire de contact
- `src/components/` — Header, Hero, Skills, Experience, Projects, Contact (avec animations GSAP)

## Personnalisation

- Modifier les textes et liens dans les composants sous `src/components/`.
- Pour enregistrer les messages en base : connecter Supabase (ou autre) dans `src/app/api/contact/route.ts` et ajouter les variables d’environnement (ex. `.env.local`).

## Build

```bash
npm run build
npm start
```
