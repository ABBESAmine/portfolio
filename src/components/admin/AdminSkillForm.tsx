"use client";

import { useState } from "react";
import type { SkillItem } from "@/app/admin/types";

type AdminSkillFormProps = {
  token: string;
  items: SkillItem[];
  onRefresh: () => void;
};

export function AdminSkillForm({ token, items, onRefresh }: AdminSkillFormProps) {
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
                  className="text-xs text-red-600 dark:text-red-400 hover:underline disabled:opacity-50 inline-block active:scale-[0.94] transition-transform duration-press ease-out-strong"
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
          className="px-4 py-2 rounded-xl bg-heading text-white font-medium hover:opacity-90 disabled:opacity-50 active:scale-[0.97] transition-transform duration-press ease-out-strong"
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
