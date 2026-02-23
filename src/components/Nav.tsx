"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  return (
    <span className="relative flex h-5 w-6 flex-col justify-between" aria-hidden>
      <span
        className={`block h-0.5 w-full rounded-full bg-current transition-all duration-300 ${
          open ? "translate-y-2 rotate-45" : ""
        }`}
      />
      <span
        className={`block h-0.5 w-full rounded-full bg-current transition-all duration-300 ${
          open ? "opacity-0 scale-x-0" : ""
        }`}
      />
      <span
        className={`block h-0.5 w-full rounded-full bg-current transition-all duration-300 ${
          open ? "-translate-y-2 -rotate-45" : ""
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
    gsap.fromTo(
      desktopRef.current?.querySelectorAll("a") ?? [],
      { x: -10, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.4, stagger: 0.06, delay: 0.6 }
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

  const linkBase = "text-sm font-medium transition-all duration-300 block";
  const linkActive = "text-heading";
  const linkInactive = "text-muted hover:text-heading";

  const navLinks = sections.map(({ id, label }) => {
    const isActive = activeId === id;
    return (
      <a
        key={id}
        href={`#${id}`}
        onClick={closeMobile}
        className={`${linkBase} ${isActive ? linkActive : linkInactive} py-2`}
        style={isActive ? { transform: "translateX(8px)" } : undefined}
      >
        {label}
      </a>
    );
  });

  return (
    <>
      {/* Desktop: nav à gauche, liens en colonne */}
      <nav
        ref={desktopRef}
        className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-12"
        aria-label="Navigation principale"
      >
        {navLinks}
      </nav>

      {/* Mobile: barre + bouton burger */}
      <header className="fixed top-0 left-0 right-0 z-50 lg:hidden">
        <div className="flex items-center justify-between bg-background/90 backdrop-blur-md border-b border-border px-4 py-3">
          <a href="#hero" className="text-sm font-semibold text-heading" onClick={closeMobile}>
            Portfolio
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground hover:bg-card focus:outline-none focus:ring-2 focus:ring-heading/30"
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileOpen}
          >
            <BurgerIcon open={mobileOpen} />
          </button>
        </div>

        {/* Panneau menu mobile */}
        <div
          ref={mobileMenuRef}
          className={`absolute left-0 right-0 top-[49px] border-b border-border bg-background/98 backdrop-blur-md shadow-lg transition-all duration-300 ease-out lg:hidden ${
            mobileOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
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

        {/* Overlay pour fermer au clic extérieur (optionnel, sur grand écran tactile) */}
        {mobileOpen && (
          <button
            type="button"
            className="fixed inset-0 top-[49px] z-[-1] bg-black/20 lg:hidden"
            onClick={closeMobile}
            aria-label="Fermer le menu"
          />
        )}
      </header>
    </>
  );
}
