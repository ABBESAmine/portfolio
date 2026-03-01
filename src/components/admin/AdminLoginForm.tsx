"use client";

import Link from "next/link";

type AdminLoginFormProps = {
  email: string;
  password: string;
  authError: string;
  authLoading: boolean;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
};

export function AdminLoginForm({
  email,
  password,
  authError,
  authLoading,
  setEmail,
  setPassword,
  onSubmit,
}: AdminLoginFormProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl font-bold text-foreground mb-6 text-center">
          Connexion admin
        </h1>
        <form onSubmit={onSubmit} className="space-y-4">
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
