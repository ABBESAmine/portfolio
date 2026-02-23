"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "Application E-commerce",
    stack: "Next.js, Stripe, Supabase",
    description:
      "Boutique en ligne avec panier, paiement sécurisé et tableau de bord admin. Gestion des stocks et des commandes.",
    link: "#",
    featured: true,
  },
  {
    title: "Dashboard Analytics",
    stack: "React, Node.js, PostgreSQL",
    description: "Visualisation de données en temps réel avec graphiques interactifs et export PDF.",
    link: "#",
    featured: false,
  },
  {
    title: "Portfolio",
    stack: "Next.js, Tailwind, GSAP, Three.js",
    description: "Site vitrine avec animations 3D, sections garnies et formulaire de contact.",
    link: "#",
    featured: false,
  },
  {
    title: "API de réservation",
    stack: "Node.js, PostgreSQL, JWT",
    description: "Backend REST pour réservations avec authentification et envoi d’emails.",
    link: "#",
    featured: false,
  },
];

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cellsRef = useRef<(HTMLAnchorElement | null)[]>([]);

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
      cellsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
            delay: i * 0.08,
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const featured = projects.find((p) => p.featured)!;
  const others = projects.filter((p) => !p.featured);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-20 lg:py-28 px-6"
    >
      <div className="container mx-auto max-w-5xl">
        <h2
          ref={titleRef}
          className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-6"
        >
          Projets
        </h2>
        <p className="text-center text-muted text-sm md:text-base max-w-xl mx-auto mb-14">
          Applications web, APIs et interfaces — du prototype au déploiement.
        </p>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <a
            ref={(el) => {
              cellsRef.current[0] = el;
            }}
            href={featured.link}
            className="md:col-span-4 md:row-span-2 block p-8 rounded-3xl bg-card bg-gradient-to-br from-heading/15 via-accent/10 to-primary/10 border border-border hover:border-heading/50 transition-all group"
          >
            <span className="text-xs font-medium text-heading uppercase tracking-wider">
              Projet vedette
            </span>
            <h3 className="font-display text-2xl md:text-3xl font-bold gradient-text mt-2">
              {featured.title}
            </h3>
            <p className="text-sm text-muted mt-1">{featured.stack}</p>
            <p className="text-muted mt-4">{featured.description}</p>
          </a>
          {others.map((project, i) => (
            <a
              key={project.title}
              ref={(el) => {
                cellsRef.current[i + 1] = el;
              }}
              href={project.link}
              className="md:col-span-2 block p-6 rounded-2xl bg-card border border-border hover:border-secondary/50 hover:shadow-lg transition-all group"
            >
              <h3 className="font-semibold text-foreground group-hover:text-heading transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-muted mt-1">{project.stack}</p>
              <p className="text-muted text-sm mt-3 line-clamp-2">
                {project.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
