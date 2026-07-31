"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import { duration, gsapEase, revealFrom, sec, stagger } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

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
        textRef.current,
        revealFrom({ x: -30 }, reduced),
        {
          x: 0,
          opacity: 1,
          duration: sec(duration.reveal),
          ease: gsapEase.out,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            once: true,
          },
          delay: 0.1,
        }
      );
      gsap.fromTo(
        statsRef.current?.querySelectorAll(".stat") ?? [],
        revealFrom({ y: 25 }, reduced),
        {
          y: 0,
          opacity: 1,
          duration: sec(duration.reveal),
          ease: gsapEase.out,
          stagger: stagger.loose,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
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
            Développeur full-stack basé à Paris, j&apos;effectue mon alternance à l&apos;ESPCI Paris
            où je conçois et réalise des applications web performantes et agréables à utiliser.
            De l&apos;idée au déploiement, j&apos;interviens sur toute la chaîne : interfaces
            React et Next.js côté frontend, APIs Node.js côté backend, bases de données et
            pipelines de déploiement continu.
          </p>
          <p className="text-muted mt-4 text-lg leading-relaxed">
            Avec plus de 3 ans d&apos;expérience et 10 projets livrés, j&apos;attache une attention
            particulière à la qualité du code, à l&apos;accessibilité et aux performances.
            Ma stack principale s&apos;articule autour de React, Next.js, Node.js et TypeScript,
            complétée par Supabase pour la gestion des données.
          </p>
          <p className="text-muted mt-4 text-lg leading-relaxed">
            Curieux des nouvelles technologies, j&apos;intègre volontiers du 3D avec Three.js
            et des animations avec GSAP pour créer des interfaces mémorables et distinctives.
            Disponible pour des collaborations freelance ou des opportunités post-alternance.
          </p>
        </div>
        <div
          ref={statsRef}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {stats.map(({ value, label }) => (
            <div
              key={label}
              className="stat text-center p-6 rounded-2xl bg-background border border-border hover:border-heading/40 transition-colors duration-fast ease-out-strong"
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
