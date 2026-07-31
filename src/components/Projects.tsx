"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TiltCard } from "@/components/TiltCard";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import { duration, gsapEase, revealFrom, sec, stagger } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

type ProjectItem = {
  title: string;
  stack: string;
  description: string;
  link: string;
  featured: boolean;
};

export function Projects({ initialData = [] }: { initialData?: ProjectItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cellsRef = useRef<(HTMLAnchorElement | HTMLDivElement | null)[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>(initialData);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.ok ? res.json() : null)
      .then((data: ProjectItem[] | null) => {
        if (Array.isArray(data)) setProjects(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const cells = cellsRef.current.filter(Boolean) as HTMLElement[];

    // GSAP et TiltCard écrivent tous deux sur `transform`. Le marqueur dit au
    // tilt de ne pas y toucher tant que l'apparition n'est pas terminée :
    // survoler une carte en cours de reveal la faisait sauter à sa position
    // finale.
    cells.forEach((el) => {
      el.dataset.revealing = "";
    });

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
      // Un seul tween sur l'ensemble : le `stagger` n'a aucun effet sur un
      // élément isolé, le décalage venait en réalité du `delay` dupliqué.
      gsap.fromTo(
        cells,
        revealFrom({ y: 24 }, reduced),
        {
          y: 0,
          opacity: 1,
          duration: sec(duration.reveal),
          ease: gsapEase.out,
          stagger: stagger.tight,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          },
          onComplete: () => {
            // GSAP laisse un `transform: translate(0px, 0px)` inline : on le
            // nettoie avant de rendre la main au tilt.
            gsap.set(cells, { clearProps: "transform" });
            cells.forEach((el) => {
              delete el.dataset.revealing;
            });
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [projects]);

  const featured = projects.find((p) => p.featured) ?? projects[0];
  const others = featured ? projects.filter((p) => p !== featured) : projects;

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

        {projects.length === 0 ? (
          <p className="text-center text-muted">Aucun projet pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TiltCard
              ref={(el) => {
                cellsRef.current[0] = el;
              }}
              href={featured!.link}
              as="a"
              className="hover-glow hover-glow-heading md:row-span-2 block p-8 rounded-3xl bg-card bg-gradient-to-br from-heading/15 via-accent/10 to-primary/10 border border-border hover:border-heading/50 transition-[border-color] duration-fast ease-out-strong group min-h-[280px] md:min-h-0"
            >
              <h3 className="font-display text-2xl md:text-3xl font-bold gradient-text">
                {featured!.title}
              </h3>
              <p className="text-sm text-muted mt-1">{featured!.stack}</p>
              <p className="text-muted mt-4">{featured!.description}</p>
            </TiltCard>
            {others.map((project, i) => (
              <TiltCard
                key={project.title}
                ref={(el) => {
                  cellsRef.current[i + 1] = el;
                }}
                href={project.link}
                as="a"
                className="hover-glow hover-glow-heading block p-6 md:p-7 rounded-2xl bg-card border border-border hover:border-heading/50 transition-[border-color] duration-fast ease-out-strong group min-h-[200px]"
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
        )}
      </div>
    </section>
  );
}
