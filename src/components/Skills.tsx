"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import { duration, gsapEase, revealFrom, sec, stagger } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export function Skills({ initialData = [] }: { initialData?: { name: string }[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [skills, setSkills] = useState<string[]>(initialData.map((s) => s.name));

  useEffect(() => {
    fetch("/api/skills")
      .then((res) => res.ok ? res.json() : null)
      .then((data: { name: string }[] | null) => {
        if (Array.isArray(data)) setSkills(data.map((s) => s.name));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        revealFrom({ y: 40 }, reduced),
        {
          y: 0,
          opacity: 1,
          duration: sec(duration.reveal),
          ease: gsapEase.out,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
      gsap.fromTo(
        gridRef.current?.querySelectorAll(".skill-badge") ?? [],
        revealFrom({ y: 20 }, reduced),
        {
          opacity: 1,
          y: 0,
          duration: sec(duration.reveal),
          ease: gsapEase.out,
          stagger: stagger.tight,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [skills]);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-20 lg:py-28 px-6 pattern-border-bottom"
    >
      <div className="container mx-auto max-w-5xl">
        <h2
          ref={titleRef}
          className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-4"
        >
          Compétences
        </h2>
        <p className="text-center text-muted text-sm md:text-base max-w-xl mx-auto mb-12">
          Frontend, backend, bases de données et outils — stack moderne et maintenable.
        </p>
        <div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4"
        >
          {skills.map((name) => (
            <span
              key={name}
              className="skill-badge shrink-0 px-4 py-3 rounded-xl bg-card border border-border text-foreground font-medium text-sm text-center hover:bg-card-hover hover:border-heading/40 hover:text-heading transition-[background-color,border-color,color] duration-fast ease-out-strong"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
