"use client";

import { useState } from "react";
import type { ExperienceItem } from "@/app/admin/types";

type AdminExperienceFormProps = {
  token: string;
  items: ExperienceItem[];
  onRefresh: () => void;
};

export function AdminExperienceForm({ token, items, onRefresh }: AdminExperienceFormProps) {
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
                  className="text-xs text-red-600 dark:text-red-400 hover:underline disabled:opacity-50 inline-block active:scale-[0.94] transition-transform duration-press ease-out-strong shrink-0"
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
          className="px-4 py-2 rounded-xl bg-heading text-white font-medium hover:opacity-90 disabled:opacity-50 active:scale-[0.97] transition-transform duration-press ease-out-strong"
        >
          {status === "loading" ? "Ajout..." : "Ajouter l'expérience"}
        </button>
      </form>
      {status === "success" && <p className="mt-2 text-sm text-green-600 dark:text-green-400">Expérience ajoutée.</p>}
      {status === "error" && <p className="mt-2 text-sm text-red-600 dark:text-red-400">Erreur lors de l&apos;ajout.</p>}
    </section>
  );
}
