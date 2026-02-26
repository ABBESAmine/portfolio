"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TiltCard } from "@/components/TiltCard";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "Navigation multi-bâtiments à l'ESPCI",
    stack: "HTML, CSS, JavaScript, SPIP",
    description:
      "Application web interactive de navigation multi-bâtiments. Interface dynamique avec gestion des plans, légendes et affectations. Partie back-end pour la gestion et la mise à jour des données. Outil de conversion LDAP vers base relationnelle. Amélioration de la gestion interne et autonomie accrue des équipes administratives.",
    link: "#",
    featured: true,
  },
  {
    title: "Gestion des demandes de logement étudiant",
    stack: "Web, formulaire, interface admin, e-mails automatisés",
    description:
      "Site de gestion des demandes de logement étudiant pour les élèves de l'ESPCI Paris. Formulaire en ligne et interface administrateur pour le suivi et la mise Ã  jour des candidatures (en attente, acceptée, refusée). Système d'e-mails automatisés déclenchés lors des changements de statut.",
    link: "#",
    featured: false,
  },
  {
    title: "Portfolio",
    stack: "Next.js, Tailwind, GSAP, Three.js",
    description: "Site vitrine avec animations 3D, thème clair/sombre, formulaire de contact et envoi d'e-mails.",
    link: "#",
    featured: false,
  }
];

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cellsRef = useRef<(HTMLAnchorElement | HTMLDivElement | null)[]>([]);

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
      className="relative py-20 lg:py-28 px-6 pattern-border-bottom"
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

        {/* Bento : vedette à gauche (2 rows), 2 autres à droite (1 row chacun) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TiltCard
            ref={(el) => {
              cellsRef.current[0] = el;
            }}
            href={featured.link}
            as="a"
            className="md:row-span-2 block p-8 rounded-3xl bg-card bg-gradient-to-br from-heading/15 via-accent/10 to-primary/10 border border-border hover:border-heading/50 hover:shadow-xl hover:shadow-heading/10 transition-[border-color,box-shadow] group min-h-[280px] md:min-h-0"
          >
            <h3 className="font-display text-2xl md:text-3xl font-bold gradient-text">
              {featured.title}
            </h3>
            <p className="text-sm text-muted mt-1">{featured.stack}</p>
            <p className="text-muted mt-4">{featured.description}</p>
          </TiltCard>
          {others.map((project, i) => (
            <TiltCard
              key={project.title}
              ref={(el) => {
                cellsRef.current[i + 1] = el;
              }}
              href={project.link}
              as="a"
              className="block p-6 md:p-7 rounded-2xl bg-card border border-border hover:border-heading/50 hover:shadow-xl hover:shadow-heading/10 transition-[border-color,box-shadow] group min-h-[200px]"
            >
              <h3 className="font-display text-xl font-bold gradient-text">
                {project.title}
              </h3>
              <p className="text-sm text-muted mt-1">{project.stack}</p>
              <p className="text-muted mt-4 text-sm leading-relaxed">
                {project.description}
              </p>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
