# Supabase dans le projet — guide détaillé

Ce document explique **en détail** ce qu’est Supabase et comment l’utiliser, en partant des bases pour quelqu’un qui ne le connaît pas. **Chaque notion est accompagnée de la syntaxe en code** pour pouvoir l’intégrer dans un projet (dont ce portfolio). Supabase n’est pas encore installé dans le repo ; ce guide décrit comment le faire et quoi coder.

---

## 1. C’est quoi Supabase ?

**Supabase** est un **Backend-as-a-Service (BaaS)** : un service en ligne qui fournit, derrière une API, tout ce dont une app a besoin côté « serveur » sans que tu aies à héberger toi-même des machines ou à tout coder à la main.

En pratique, Supabase te donne notamment :

| Service | Rôle (en bref) |
|--------|------------------|
| **Base de données** | PostgreSQL (base relationnelle) hébergée, accessible via une API REST et un client JavaScript. |
| **Auth** | Inscription / connexion utilisateurs (email, magic link, OAuth Google/GitHub, etc.). |
| **Storage** | Stockage de fichiers (images, PDF, etc.) avec URLs publiques ou privées. |
| **Realtime** | Abonnements en temps réel sur les changements de la base (nouveaux messages, etc.). |

Tu te connectes à ton **projet Supabase** avec une **URL** et une **clé API** (anon key pour le front, service role pour le back). Le client JavaScript (`@supabase/supabase-js`) permet d’envoyer des requêtes (insérer, lire, modifier, supprimer) sans écrire toi-même les routes HTTP.

En résumé : **Supabase = backend hébergé (DB + Auth + Storage + Realtime)** que tu utilises depuis ton code avec des **clés et un client JS**.

---

## 2. Créer un projet et récupérer les clés

1. Va sur [supabase.com](https://supabase.com), crée un compte si besoin.
2. **New project** : choisis une organisation, un nom, un mot de passe pour la base (à garder en lieu sûr).
3. Une fois le projet créé, va dans **Settings → API** :
   - **Project URL** : `https://xxxxx.supabase.co`
   - **anon public** : clé utilisable côté navigateur (exposée au client).
   - **service_role** : clé secrète, **jamais** dans le front ; à utiliser uniquement côté serveur (ex. routes API Next.js).

**Dans le projet**, on ne met jamais la `service_role` dans le code du navigateur. On l’utilise seulement dans les **API Routes** Next.js (côté serveur).

---

## 3. Variables d’environnement

Les URL et clés ne doivent **pas** être en dur dans le code. On les met dans des **variables d’environnement**.

**Fichier** : `.env.local` (à la racine du projet, **ne pas commiter** ; il est souvent dans `.gitignore`).

**Syntaxe** :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

- **`NEXT_PUBLIC_`** : exposées au navigateur. On les utilise pour le client Supabase côté front (si tu appelles Supabase depuis React).
- **Sans préfixe** : côté serveur uniquement. **`SUPABASE_SERVICE_ROLE_KEY`** ne doit **jamais** être dans du code envoyé au client.

Pour lire ces variables en code :

```ts
// Côté serveur (API route, etc.)
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Côté client (React)
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
```

---

## 4. Installer le client et créer le client Supabase

**Installation** (à la racine du projet) :

```bash
npm install @supabase/supabase-js
```

**Créer un client** : on crée une instance du client Supabase une fois, puis on l’utilise partout (API routes ou composants).

**Exemple : client pour le serveur (API routes Next.js)** — à utiliser quand tu veux bypasser les Row Level Security (RLS) avec la clé `service_role` :

**Fichier** : `src/lib/supabase-server.ts` (à créer)

```ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});
```

**Exemple : client pour le navigateur (optionnel, si tu appelles Supabase depuis React)** :

**Fichier** : `src/lib/supabase-client.ts` (à créer)

```ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

- **`createClient(url, key)`** : renvoie un objet avec `.from()`, `.auth`, etc.
- Côté **serveur**, on utilise **supabaseAdmin** (service_role) pour insérer/lire les messages de contact sans être bloqué par les règles RLS.
- Côté **client**, on utilise **supabase** (anon) pour Auth ou pour des lectures soumises aux RLS.

---

## 5. La base de données : PostgreSQL et les tables

Supabase expose une **base PostgreSQL**. Tu peux créer des **tables** depuis l’interface (Table Editor) ou en SQL (SQL Editor).

**Concepts** :

- **Table** : comme un tableau (lignes = enregistrements, colonnes = champs).
- **Row Level Security (RLS)** : règles qui limitent qui peut lire/écrire quelles lignes (par exemple : « tout le monde peut insérer dans `contacts` », « seul le back office peut tout lire »).

**Exemple : table pour les messages du formulaire de contact**

Dans le **SQL Editor** Supabase, tu peux exécuter :

```sql
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);

-- Optionnel : activer RLS et autoriser l’insertion anonyme (pour le formulaire public)
alter table public.contacts enable row level security;

create policy "Allow anonymous insert"
  on public.contacts
  for insert
  to anon
  with check (true);
```

- **`uuid`** : identifiant unique.
- **`gen_random_uuid()`** : génère un UUID automatiquement.
- **`timestamptz`** : date/heure avec fuseau.
- **RLS** : ici on autorise uniquement l’**insert** pour le rôle `anon` (requêtes avec la clé anon). Les **select** peuvent être restreints ou désactivés pour `anon` si tu ne veux pas que le front lise les messages.

**Syntaxe pour créer une table depuis l’interface** : Table Editor → New table → ajouter les colonnes (name, type, nullable, default).

---

## 6. Insérer des données (insert)

Une fois la table créée, on **insère** des lignes depuis le code avec le client Supabase.

**Méthode** : `.from("nom_table").insert({ ... })`.

**Exemple : insérer un message de contact (côté serveur)** :

```ts
import { supabaseAdmin } from "@/lib/supabase-server";

const { data, error } = await supabaseAdmin
  .from("contacts")
  .insert({
    name: "Jean Dupont",
    email: "jean@exemple.com",
    message: "Bonjour, je souhaite vous contacter.",
  })
  .select("id, created_at")
  .single();

if (error) {
  console.error(error);
  throw new Error("Erreur lors de l’enregistrement");
}

// data contient { id: "...", created_at: "..." }
```

- **`.from("contacts")`** : cible la table `contacts`.
- **`.insert({ ... })`** : une ligne ; les clés sont les noms des colonnes.
- **`.select("id, created_at")`** : optionnel ; Supabase renvoie les colonnes demandées après l’insert.
- **`.single()`** : on s’attend à une seule ligne retournée (utile après un insert d’une ligne).

**Sans `.select()`** : l’insert réussit mais ne renvoie pas les valeurs par défaut (ex. `id`, `created_at`) sauf si tu les demandes avec `.select()`.

---

## 7. Lire des données (select)

**Méthode** : `.from("nom_table").select("...")` puis éventuellement `.eq()`, `.order()`, `.limit()`, etc.

**Exemple : récupérer tous les messages (côté serveur, avec la clé admin)** :

```ts
const { data, error } = await supabaseAdmin
  .from("contacts")
  .select("id, name, email, message, created_at")
  .order("created_at", { ascending: false })
  .limit(100);

if (error) throw new Error(error.message);
// data = tableau d’objets
```

**Exemple : récupérer un message par id** :

```ts
const { data, error } = await supabaseAdmin
  .from("contacts")
  .select("*")
  .eq("id", "uuid-du-message")
  .single();
```

- **`.select("col1, col2")`** ou **`"*"`** : colonnes à retourner.
- **`.eq("colonne", valeur)`** : filtre « colonne = valeur ».
- **`.order("colonne", { ascending: false })`** : tri (ici du plus récent au plus ancien).
- **`.limit(100)`** : nombre max de lignes.
- **`.single()`** : attend exactement une ligne (sinon erreur).

---

## 8. Mettre à jour et supprimer (update, delete)

**Update** :

```ts
const { data, error } = await supabaseAdmin
  .from("contacts")
  .update({ read: true })
  .eq("id", "uuid-du-message")
  .select()
  .single();
```

**Delete** :

```ts
const { error } = await supabaseAdmin
  .from("contacts")
  .delete()
  .eq("id", "uuid-du-message");
```

- **`.update({ ... })`** : champs à modifier.
- **`.delete()`** : supprime les lignes qui matchent les filtres (ici `.eq("id", ...)`).

---

## 9. Intégration dans l’API Contact du portfolio

Le formulaire de contact envoie une requête **POST** à `/api/contact`. La route actuelle ne fait qu’un `console.log`. Pour **enregistrer les messages dans Supabase**, on modifie cette route.

**Fichier** : `src/app/api/contact/route.ts`

**Étape 1** : créer le client serveur (voir §4) dans `src/lib/supabase-server.ts`.

**Étape 2** : dans la route, après validation du body, appeler Supabase :

```ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export type ContactBody = {
  name?: string;
  email?: string;
  message?: string;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body as ContactBody;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Nom, email et message sont requis." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("contacts")
      .insert({ name, email, message })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Erreur lors de l’enregistrement du message." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
```

- **Body** : on récupère `name`, `email`, `message` et on les passe tels quels à `.insert()` (les noms de colonnes doivent correspondre à la table).
- **Gestion d’erreur** : si Supabase renvoie une erreur (ex. RLS, colonne manquante), on renvoie 500 et un message générique pour ne pas exposer les détails au client.

Le front (formulaire dans `Contact.tsx`) n’a pas besoin de changer : il continue d’envoyer `POST /api/contact` avec `{ name, email, message }`.

---

## 10. Authentification (Auth) — aperçu et syntaxe

Supabase fournit **Auth** : inscription, connexion, session. On l’utilise surtout côté **client** avec la clé **anon**, ou depuis une API route pour vérifier un token.

**Côté client (navigateur)** — exemple : connexion par email + mot de passe :

```ts
import { supabase } from "@/lib/supabase-client";

// Inscription
const { data, error } = await supabase.auth.signUp({
  email: "user@exemple.com",
  password: "motdepasse-securise",
});

// Connexion
const { data, error } = await supabase.auth.signInWithPassword({
  email: "user@exemple.com",
  password: "motdepasse-securise",
});

// Déconnexion
await supabase.auth.signOut();

// Récupérer la session actuelle
const { data: { session } } = await supabase.auth.getSession();
```

**Magic link (connexion par lien envoyé par email)** :

```ts
const { error } = await supabase.auth.signInWithOtp({
  email: "user@exemple.com",
  options: { emailRedirectTo: "https://monsite.com/dashboard" },
});
```

Dans ce portfolio, Auth n’est pas obligatoire ; c’est utile si tu ajoutes plus tard un espace « admin » ou un tableau de bord pour lire les messages.

---

## 11. Storage — aperçu et syntaxe

**Storage** permet de stocker des fichiers (images, PDF, etc.) dans des **buckets**, avec des URLs publiques ou signées.

**Exemple : upload d’un fichier (côté client)** :

```ts
const file = event.target.files[0];
const { data, error } = await supabase.storage
  .from("avatars")
  .upload(`${userId}/${file.name}`, file, {
    cacheControl: "3600",
    upsert: true,
  });

if (data) {
  const { data: urlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(data.path);
  console.log("URL publique:", urlData.publicUrl);
}
```

- **`.from("avatars")`** : nom du bucket (à créer dans Supabase → Storage).
- **`.upload(path, file, options)`** : `path` = chemin dans le bucket, `file` = objet File du navigateur.

Pour ce portfolio (formulaire de contact sans upload), Storage n’est pas nécessaire ; c’est utile si tu ajoutes plus tard un upload de CV ou de pièce jointe.

---

## 12. Realtime — aperçu

**Realtime** permet de s’abonner aux changements d’une table (insert, update, delete) pour mettre à jour l’UI en direct.

**Exemple (côté client)** :

```ts
const channel = supabase
  .channel("contacts-changes")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "contacts" },
    (payload) => {
      console.log("Nouveau message:", payload.new);
    }
  )
  .subscribe();
```

Pour ce portfolio, Realtime n’est pas utilisé ; c’est utile pour un dashboard admin « live » des nouveaux messages.

---

## 13. Récapitulatif : étapes pour brancher Supabase sur le contact

1. **Créer un projet** sur supabase.com et noter l’URL + anon key + service_role key.
2. **Créer `.env.local`** avec `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
3. **Installer** : `npm install @supabase/supabase-js`.
4. **Créer** `src/lib/supabase-server.ts` avec `createClient(url, service_role_key)` → `supabaseAdmin`.
5. **Créer la table** `contacts` (SQL ou Table Editor) avec `id`, `name`, `email`, `message`, `created_at` ; activer RLS si besoin et une policy pour l’insert anon.
6. **Modifier** `src/app/api/contact/route.ts` : après validation du body, appeler `supabaseAdmin.from("contacts").insert({ name, email, message })` et gérer l’erreur.
7. **Tester** : envoyer un message depuis le formulaire, puis vérifier dans Supabase → Table Editor que la ligne est bien créée.

---

## 14. Où coder quoi (résumé)

| Objectif | Où | Quoi coder |
|----------|-----|-------------|
| Clés et URL | `.env.local` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. |
| Client serveur | `src/lib/supabase-server.ts` | `createClient(url, service_role_key)` → `supabaseAdmin`. |
| Client navigateur (optionnel) | `src/lib/supabase-client.ts` | `createClient(url, anon_key)` → `supabase`. |
| Table contacts | Supabase Dashboard (SQL ou Table Editor) | `contacts` avec colonnes id, name, email, message, created_at. |
| Enregistrer les messages | `src/app/api/contact/route.ts` | `supabaseAdmin.from("contacts").insert({ name, email, message })`. |
| Auth / Storage / Realtime | Selon besoin | Voir §10, §11, §12. |

Avec ces explications et la syntaxe en code, tu peux intégrer Supabase pas à pas (d’abord la DB et l’API contact, puis éventuellement Auth ou Storage).
