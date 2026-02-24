"use client";

export function Footer() {
  return (
    <footer className="relative py-12 px-6 bg-dark-section bg-zellige-dark overflow-hidden">
      <div className="container mx-auto max-w-5xl relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-on-dark">
        <p className="text-sm text-on-dark/90">
          © {new Date().getFullYear()} — Tous droits réservés
        </p>
      </div>
    </footer>
  );
}
