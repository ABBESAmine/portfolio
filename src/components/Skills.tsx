"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [skills, setSkills] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/skills")
      .then((res) => res.ok ? res.json() : [])
      .then((data: { name: string }[]) => {
        setSkills(Array.isArray(data) ? data.map((s) => s.name) : []);
      })
      .catch(() => setSkills([]));
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
      gsap.fromTo(
        gridRef.current?.querySelectorAll(".skill-badge") ?? [],
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.04,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
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
              className="skill-badge shrink-0 px-4 py-3 rounded-xl bg-card border border-border text-foreground font-medium text-sm text-center hover:bg-card-hover hover:border-heading/40 hover:text-heading transition-all duration-300"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
