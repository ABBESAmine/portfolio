"use client";

import Link from "next/link";

type AdminHeaderProps = {
  email: string | undefined;
  onLogout: () => Promise<void>;
};

export function AdminHeader({ email, onLogout }: AdminHeaderProps) {
  return (
    <header className="border-b border-border bg-card/50 sticky top-0 z-10">
      <div className="container mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-foreground">Admin</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted">{email}</span>
          <button
            type="button"
            onClick={onLogout}
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
  );
}
