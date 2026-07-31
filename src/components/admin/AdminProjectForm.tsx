"use client";

import { useState } from "react";
import type { ProjectItem } from "@/app/admin/types";

type AdminProjectFormProps = {
  token: string;
  items: ProjectItem[];
  onRefresh: () => void;
};

export function AdminProjectForm({ token, items, onRefresh }: AdminProjectFormProps) {
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
                  className="text-xs text-red-600 dark:text-red-400 hover:underline disabled:opacity-50 inline-block active:scale-[0.94] transition-transform duration-press ease-out-strong shrink-0"
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
          className="px-4 py-2 rounded-xl bg-heading text-white font-medium hover:opacity-90 disabled:opacity-50 active:scale-[0.97] transition-transform duration-press ease-out-strong"
        >
          {status === "loading" ? "Ajout..." : "Ajouter le projet"}
        </button>
      </form>
      {status === "success" && <p className="mt-2 text-sm text-green-600 dark:text-green-400">Projet ajouté.</p>}
      {status === "error" && <p className="mt-2 text-sm text-red-600 dark:text-red-400">Erreur lors de l&apos;ajout.</p>}
    </section>
  );
}
