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

export function Nav() {
  const desktopRef = useRef<HTMLElement>(null);
  const mobileRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<string>("hero");

  useEffect(() => {
    gsap.fromTo(
      desktopRef.current?.querySelectorAll("a") ?? [],
      { x: -10, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.4, stagger: 0.06, delay: 0.6 }
    );
    gsap.fromTo(
      mobileRef.current?.querySelectorAll("a") ?? [],
      { y: -10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, delay: 0.4 }
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

  const linkBase =
    "text-sm font-medium transition-all duration-300 block";
  const linkActive = "text-heading";
  const linkInactive = "text-muted hover:text-heading";

  return (
    <>
      {/* Desktop: nav à gauche, liens en colonne, texte horizontal */}
      <nav
        ref={desktopRef}
        className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-12"
        aria-label="Navigation principale"
      >
        {sections.map(({ id, label }) => {
          const isActive = activeId === id;
          return (
            <a
              key={id}
              href={`#${id}`}
              className={`${linkBase} ${isActive ? linkActive : linkInactive}`}
              style={{ transform: isActive ? "translateX(8px)" : "translateX(0)" }}
            >
              {label}
            </a>
          );
        })}
      </nav>
      {/* Mobile: barre en haut horizontale */}
      <nav
        ref={mobileRef}
        className="fixed top-0 left-0 right-0 z-50 lg:hidden bg-background/80 backdrop-blur-md border-b border-border"
        aria-label="Navigation principale"
      >
        <div className="flex items-center justify-center gap-8 px-4 py-3 overflow-x-auto">
          {sections.map(({ id, label }) => {
            const isActive = activeId === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                className={`${linkBase} whitespace-nowrap ${isActive ? linkActive : linkInactive}`}
                style={{ transform: isActive ? "translateX(6px)" : "translateX(0)" }}
              >
                {label}
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
}
