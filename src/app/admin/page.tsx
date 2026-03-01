"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase-client";
import type { Session } from "@supabase/supabase-js";

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [skillsList, setSkillsList] = useState<{ id: string; name: string }[]>([]);
  const [experiencesList, setExperiencesList] = useState<
    { id: string; role: string; company: string; period: string; description: string }[]
  >([]);
  const [projectsList, setProjectsList] = useState<
    { id: string; title: string; stack: string; description: string; link: string; featured: boolean }[]
  >([]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  async function fetchAdminData() {
    try {
      const [s, e, p] = await Promise.all([
        fetch("/api/skills").then((r) => r.json()),
        fetch("/api/experiences").then((r) => r.json()),
        fetch("/api/projects").then((r) => r.json()),
      ]);
      setSkillsList(Array.isArray(s) ? s : []);
      setExperiencesList(Array.isArray(e) ? e : []);
      setProjectsList(Array.isArray(p) ? p : []);
    } catch {
      setSkillsList([]);
      setExperiencesList([]);
      setProjectsList([]);
    }
  }

  useEffect(() => {
    if (session?.access_token) fetchAdminData();
  }, [session?.access_token]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    if (!supabase) {
      setAuthError("Supabase non configuré.");
      setAuthLoading(false);
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setAuthLoading(false);
    if (error) {
      setAuthError(error.message);
      return;
    }
  }

  async function handleLogout() {
    await supabase?.auth.signOut();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted">Chargement...</p>
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="text-center max-w-md">
          <h1 className="font-display text-xl font-bold text-foreground mb-2">Admin</h1>
          <p className="text-muted text-sm">
            Configure <code className="bg-card px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> et{" "}
            <code className="bg-card px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> dans{" "}
            <code className="bg-card px-1 rounded">.env.local</code> pour activer la connexion.
          </p>
          <Link href="/" className="inline-block mt-4 text-heading hover:underline">
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-2xl font-bold text-foreground mb-6 text-center">
            Connexion admin
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-foreground mb-1">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground"
                placeholder="vous@exemple.com"
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-foreground mb-1">
                Mot de passe
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground"
              />
            </div>
            {authError && (
              <p className="text-sm text-red-600 dark:text-red-400">{authError}</p>
            )}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full px-4 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-hover disabled:opacity-50"
            >
              {authLoading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
          <Link href="/" className="block mt-6 text-center text-muted hover:text-foreground text-sm">
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 sticky top-0 z-10">
        <div className="container mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
          <h1 className="font-display text-xl font-bold text-foreground">Admin</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted">{session.user.email}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-muted hover:text-foreground"
            >
              Déconnexion
            </button>
            <Link href="/" className="text-sm text-heading hover:underline">
              Voir le site
            </Link>
          </div>
        </div>
      </header>
      <main className="container mx-auto max-w-4xl px-6 py-10">
        <p className="text-muted mb-10">
          Consulte, ajoute ou supprime des compétences, expériences et projets. Ils s&apos;affichent sur la page d&apos;accueil.
        </p>
        <div className="space-y-14">
          <AdminSkillForm
            token={session.access_token}
            items={skillsList}
            onRefresh={fetchAdminData}
          />
          <AdminExperienceForm
            token={session.access_token}
            items={experiencesList}
            onRefresh={fetchAdminData}
          />
          <AdminProjectForm
            token={session.access_token}
            items={projectsList}
            onRefresh={fetchAdminData}
          />
        </div>
      </main>
    </div>
  );
}

function AdminSkillForm({
  token,
  items,
  onRefresh,
}: {
  token: string;
  items: { id: string; name: string }[];
  onRefresh: () => void;
}) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as { error?: string }).error ?? "Erreur");
      setStatus("success");
      setName("");
      onRefresh();
    } catch (e) {
      setStatus("error");
      setErrorMessage(e instanceof Error ? e.message : "Erreur lors de l'ajout.");
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/skills/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      onRefresh();
    } catch {
      setErrorMessage("Erreur lors de la suppression.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section>
      <h2 className="font-display text-lg font-bold text-foreground mb-4">Compétences</h2>
      {items.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-muted mb-2">Liste actuelle ({items.length})</p>
          <ul className="flex flex-wrap gap-2">
            {items.map((skill) => (
              <li
                key={skill.id}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-border"
              >
                <span className="text-foreground">{skill.name}</span>
                <button
                  type="button"
                  onClick={() => handleDelete(skill.id)}
                  disabled={deletingId === skill.id}
                  className="text-xs text-red-600 dark:text-red-400 hover:underline disabled:opacity-50"
                  aria-label={`Supprimer ${skill.name}`}
                >
                  {deletingId === skill.id ? "…" : "Supprimer"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <h3 className="font-display font-semibold text-foreground mb-3">Ajouter une compétence</h3>
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="skill-name" className="block text-sm text-muted mb-1">
            Nom
          </label>
          <input
            id="skill-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-xl border border-border bg-card text-foreground"
            placeholder="ex. React"
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-4 py-2 rounded-xl bg-heading text-white font-medium hover:opacity-90 disabled:opacity-50"
        >
          {status === "loading" ? "Ajout..." : "Ajouter"}
        </button>
      </form>
      {status === "success" && <p className="mt-2 text-sm text-green-600 dark:text-green-400">Compétence ajoutée.</p>}
      {status === "error" && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errorMessage || "Erreur lors de l'ajout."}</p>
      )}
    </section>
  );
}

type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
};

function AdminExperienceForm({
  token,
  items,
  onRefresh,
}: {
  token: string;
  items: ExperienceItem[];
  onRefresh: () => void;
}) {
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [period, setPeriod] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/experiences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: role.trim(),
          company: company.trim(),
          period: period.trim(),
          description: description.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as { error?: string }).error ?? "Erreur");
      setStatus("success");
      setRole("");
      setCompany("");
      setPeriod("");
      setDescription("");
      onRefresh();
    } catch {
      setStatus("error");
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/experiences/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      onRefresh();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section>
      <h2 className="font-display text-lg font-bold text-foreground mb-4">Expériences</h2>
      {items.length > 0 && (
        <div className="mb-6 space-y-3">
          <p className="text-sm text-muted">Liste actuelle ({items.length})</p>
          <ul className="space-y-2">
            {items.map((exp) => (
              <li
                key={exp.id}
                className="flex flex-wrap items-start justify-between gap-2 p-4 rounded-xl bg-card border border-border"
              >
                <div>
                  <p className="font-medium text-foreground">{exp.role}</p>
                  <p className="text-sm text-heading">{exp.company}</p>
                  <p className="text-sm text-muted">{exp.period}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(exp.id)}
                  disabled={deletingId === exp.id}
                  className="text-xs text-red-600 dark:text-red-400 hover:underline disabled:opacity-50 shrink-0"
                  aria-label={`Supprimer ${exp.role}`}
                >
                  {deletingId === exp.id ? "…" : "Supprimer"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <h3 className="font-display font-semibold text-foreground mb-3">Ajouter une expérience</h3>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div>
          <label htmlFor="exp-role" className="block text-sm text-muted mb-1">Intitulé du poste</label>
          <input
            id="exp-role"
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-xl border border-border bg-card text-foreground"
            placeholder="ex. Développeur Full-Stack en alternance"
          />
        </div>
        <div>
          <label htmlFor="exp-company" className="block text-sm text-muted mb-1">Entreprise</label>
          <input
            id="exp-company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-xl border border-border bg-card text-foreground"
            placeholder="ex. ESPCI Paris"
          />
        </div>
        <div>
          <label htmlFor="exp-period" className="block text-sm text-muted mb-1">Période</label>
          <input
            id="exp-period"
            type="text"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-xl border border-border bg-card text-foreground"
            placeholder="ex. Octobre 2023 – Septembre 2026"
          />
        </div>
        <div>
          <label htmlFor="exp-desc" className="block text-sm text-muted mb-1">Description</label>
          <textarea
            id="exp-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-2 rounded-xl border border-border bg-card text-foreground resize-none"
            placeholder="Décrivez les missions et technologies..."
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-4 py-2 rounded-xl bg-heading text-white font-medium hover:opacity-90 disabled:opacity-50"
        >
          {status === "loading" ? "Ajout..." : "Ajouter l'expérience"}
        </button>
      </form>
      {status === "success" && <p className="mt-2 text-sm text-green-600 dark:text-green-400">Expérience ajoutée.</p>}
      {status === "error" && <p className="mt-2 text-sm text-red-600 dark:text-red-400">Erreur lors de l&apos;ajout.</p>}
    </section>
  );
}

type ProjectItem = {
  id: string;
  title: string;
  stack: string;
  description: string;
  link: string;
  featured: boolean;
};

function AdminProjectForm({
  token,
  items,
  onRefresh,
}: {
  token: string;
  items: ProjectItem[];
  onRefresh: () => void;
}) {
  const [title, setTitle] = useState("");
  const [stack, setStack] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          stack: stack.trim(),
          description: description.trim(),
          link: link.trim() || "#",
          featured,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as { error?: string }).error ?? "Erreur");
      setStatus("success");
      setTitle("");
      setStack("");
      setDescription("");
      setLink("");
      setFeatured(false);
      onRefresh();
    } catch {
      setStatus("error");
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      onRefresh();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section>
      <h2 className="font-display text-lg font-bold text-foreground mb-4">Projets</h2>
      {items.length > 0 && (
        <div className="mb-6 space-y-3">
          <p className="text-sm text-muted">Liste actuelle ({items.length})</p>
          <ul className="space-y-2">
            {items.map((proj) => (
              <li
                key={proj.id}
                className="flex flex-wrap items-start justify-between gap-2 p-4 rounded-xl bg-card border border-border"
              >
                <div>
                  <p className="font-medium text-foreground">{proj.title}</p>
                  <p className="text-sm text-muted">{proj.stack}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(proj.id)}
                  disabled={deletingId === proj.id}
                  className="text-xs text-red-600 dark:text-red-400 hover:underline disabled:opacity-50 shrink-0"
                  aria-label={`Supprimer ${proj.title}`}
                >
                  {deletingId === proj.id ? "…" : "Supprimer"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <h3 className="font-display font-semibold text-foreground mb-3">Ajouter un projet</h3>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div>
          <label htmlFor="proj-title" className="block text-sm text-muted mb-1">Titre</label>
          <input
            id="proj-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-xl border border-border bg-card text-foreground"
            placeholder="ex. Navigation multi-bâtiments"
          />
        </div>
        <div>
          <label htmlFor="proj-stack" className="block text-sm text-muted mb-1">Stack / technologies</label>
          <input
            id="proj-stack"
            type="text"
            value={stack}
            onChange={(e) => setStack(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-border bg-card text-foreground"
            placeholder="ex. HTML, CSS, JavaScript, SPIP"
          />
        </div>
        <div>
          <label htmlFor="proj-desc" className="block text-sm text-muted mb-1">Description</label>
          <textarea
            id="proj-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-2 rounded-xl border border-border bg-card text-foreground resize-none"
            placeholder="Résumé du projet..."
          />
        </div>
        <div>
          <label htmlFor="proj-link" className="block text-sm text-muted mb-1">Lien (URL, optionnel)</label>
          <input
            id="proj-link"
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-border bg-card text-foreground"
            placeholder="https://... (laisser vide si pas de lien)"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="proj-featured"
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="rounded border-border"
          />
          <label htmlFor="proj-featured" className="text-sm text-muted">
            Mettre en vedette (grande carte à gauche)
          </label>
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-4 py-2 rounded-xl bg-heading text-white font-medium hover:opacity-90 disabled:opacity-50"
        >
          {status === "loading" ? "Ajout..." : "Ajouter le projet"}
        </button>
      </form>
      {status === "success" && <p className="mt-2 text-sm text-green-600 dark:text-green-400">Projet ajouté.</p>}
      {status === "error" && <p className="mt-2 text-sm text-red-600 dark:text-red-400">Erreur lors de l&apos;ajout.</p>}
    </section>
  );
}
