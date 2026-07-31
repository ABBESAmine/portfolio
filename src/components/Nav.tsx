"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ThemeToggle } from "@/components/ThemeProvider";
import { GITHUB_URL, LINKEDIN_URL } from "@/lib/config";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import { duration, gsapEase, revealFrom, sec, stagger } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const sections = [
  { id: "hero", label: "Accueil" },
  { id: "about", label: "À propos" },
  { id: "skills", label: "Compétences" },
  { id: "experience", label: "Expérience" },
  { id: "projects", label: "Projets" },
  { id: "contact", label: "Contact" },
];

function BurgerIcon({ open }: { open: boolean }) {
  // Les trois barres sont centrées en absolu sur le même axe et écartées par
  // translate. À l'ouverture elles reviennent toutes à 0 : les deux diagonales
  // se croisent donc exactement au centre, quelle que soit la taille de l'icône.
  const bar =
    "absolute left-0 h-0.5 w-full rounded-full bg-current top-[calc(50%-1px)]";
  return (
    <span className="relative block h-5 w-6" aria-hidden>
      <span
        className={`${bar} transition-transform duration-base ease-out-strong ${
          open ? "rotate-45" : "-translate-y-[6px]"
        }`}
      />
      {/* scale-x-50 et non scale-x-0 : rien ne disparaît en devenant de
          largeur nulle. */}
      <span
        className={`${bar} transition-[transform,opacity] duration-base ease-out-strong ${
          open ? "opacity-0 scale-x-50" : ""
        }`}
      />
      <span
        className={`${bar} transition-transform duration-base ease-out-strong ${
          open ? "-rotate-45" : "translate-y-[6px]"
        }`}
      />
    </span>
  );
}

export function Nav() {
  const desktopRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string>("hero");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // delay 0.15 et non 0.6 : la navigation principale restait invisible près
    // d'une seconde après le chargement, pour une raison purement décorative.
    gsap.fromTo(
      desktopRef.current?.querySelectorAll("a") ?? [],
      revealFrom({ x: -10 }, prefersReducedMotion()),
      {
        x: 0,
        opacity: 1,
        duration: sec(duration.reveal),
        ease: gsapEase.out,
        stagger: stagger.loose,
        delay: 0.15,
      }
    );
  }, []);

  useEffect(() => {
    const triggers = sections.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: "top 40%",
        end: "bottom 40%",
        onEnter: () => setActiveId(id),
        onEnterBack: () => setActiveId(id),
      });
    });
    return () => triggers.forEach((t) => t?.kill());
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  const linkBase =
    "text-sm font-medium block transition-[color,transform] duration-fast ease-out-strong active:scale-[0.97]";
  const linkActive = "text-heading";
  const linkInactive = "text-muted hover:text-heading";

  // Le lien actif décalait de 8px en translateX. Piloté par ScrollTrigger, ce
  // décalage rejouait à chaque changement de section : du mouvement en vision
  // périphérique, des dizaines de fois par visite, pour une information que le
  // passage en text-heading porte déjà. Seule la couleur change désormais.
  const navLinks = sections.map(({ id, label }) => {
    const isActive = activeId === id;
    return (
      <a
        key={id}
        href={`#${id}`}
        onClick={closeMobile}
        className={`${linkBase} ${isActive ? linkActive : linkInactive} py-2`}
        aria-current={isActive ? "true" : undefined}
      >
        {label}
      </a>
    );
  });

  return (
    <>
      {/* Desktop: nav à gauche, liens en colonne + toggle thème */}
      <nav
        ref={desktopRef}
        className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-12 items-start"
        aria-label="Navigation principale"
      >
        {navLinks}
        <div className="mt-4">
          <ThemeToggle />
        </div>
        {(GITHUB_URL || LINKEDIN_URL) && (
          <div className="flex flex-col gap-3 mt-2">
            {GITHUB_URL && (
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-heading transition-colors"
                aria-label="GitHub"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            )}
            {LINKEDIN_URL && (
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-heading transition-colors"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            )}
          </div>
        )}
      </nav>

      {/* Mobile: barre + bouton burger */}
      <header className="fixed top-0 left-0 right-0 z-50 lg:hidden">
        <div className="flex items-center justify-between bg-background/90 backdrop-blur-md border-b border-border px-4 py-3">
          <a href="#hero" className="text-sm font-semibold text-heading" onClick={closeMobile}>
            Portfolio
          </a>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground hover:bg-card focus:outline-none focus:ring-2 focus:ring-heading/30 active:scale-[0.94] transition-[transform,background-color] duration-press ease-out-strong"
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileOpen}
            >
              <BurgerIcon open={mobileOpen} />
            </button>
          </div>
        </div>

        {/* Panneau menu mobile */}
        <div
          ref={mobileMenuRef}
          className={`absolute left-0 right-0 top-full origin-top border-b border-border bg-background/98 backdrop-blur-md shadow-lg transition-[opacity,transform] ease-out-strong lg:hidden ${
            mobileOpen
              ? "opacity-100 translate-y-0 scale-100 duration-base"
              : "opacity-0 -translate-y-2 scale-[0.98] pointer-events-none duration-fast"
          }`}
          aria-hidden={!mobileOpen}
        >
          <nav
            className="flex flex-col gap-1 px-6 py-4"
            aria-label="Navigation mobile"
          >
            {navLinks}
          </nav>
        </div>

        {/* Overlay pour fermer au clic extérieur.
            Monté en permanence : conditionner son rendu à `mobileOpen` le
            faisait apparaître et disparaître d'un coup pendant que le panneau,
            lui, glissait. La sortie était le plus visible — le voile sautait
            avant que le panneau ait fini son mouvement. */}
        <button
          type="button"
          className={`fixed inset-0 z-[-1] bg-black/20 transition-opacity ease-out-strong lg:hidden ${
            mobileOpen
              ? "opacity-100 duration-base"
              : "opacity-0 pointer-events-none duration-fast"
          }`}
          onClick={closeMobile}
          aria-label="Fermer le menu"
          aria-hidden={!mobileOpen}
          tabIndex={mobileOpen ? 0 : -1}
        />
      </header>
    </>
  );
}
