"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

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
        textRef.current,
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
          delay: 0.1,
        }
      );
      gsap.fromTo(
        statsRef.current?.querySelectorAll(".stat") ?? [],
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
          delay: 0.2,
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const stats = [
    { value: "3+", label: "Années d'expérience" },
    { value: "10+", label: "Projets réalisés" },
    { value: "100%", label: "Passion code" },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-20 lg:py-28 px-6 bg-section-alt pattern-border-bottom"
    >
      <div className="container mx-auto max-w-4xl relative z-10">
        <h2
          ref={titleRef}
          className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-12"
        >
          À propos
        </h2>
        <div ref={textRef} className="prose prose-invert max-w-none text-center">
          <p className="text-muted text-lg leading-relaxed">
            Développeur full-stack basé en France, je conçois et réalise des applications web
            performantes et agréables à utiliser. De l'idée au déploiement, j'aime
            travailler sur toute la chaîne : frontend (React, Next.js), backend (Node.js), bases
            de données et intégration continue.
          </p>
          <p className="text-muted mt-4 text-lg leading-relaxed">
            Curieux des nouvelles technologies, j'intègre volontiers du 3D (Three.js),
            des animations (GSAP) et des APIs modernes pour offrir des expériences utilisateur
            mémorables.
          </p>
        </div>
        <div
          ref={statsRef}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {stats.map(({ value, label }) => (
            <div
              key={label}
              className="stat text-center p-6 rounded-2xl bg-background border border-border hover:border-heading/40 transition-colors"
            >
              <span className="font-display text-3xl md:text-4xl font-bold gradient-text block">
                {value}
              </span>
              <span className="text-muted text-sm mt-1 block">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
