"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    role: "Développeur Full-Stack",
    company: "Entreprise XYZ",
    period: "2023 – Présent",
    description:
      "Développement d'applications web avec React et Node.js, mise en place d'APIs REST.",
  },
  {
    role: "Développeur Frontend",
    company: "Startup ABC",
    period: "2021 – 2023",
    description:
      "Interfaces utilisateur avec React et TypeScript, intégration de designs.",
  },
];

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);

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
      itemsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { x: -50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
            delay: i * 0.1,
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="py-20 lg:py-28 px-6 bg-primary/5"
    >
      <div className="container mx-auto max-w-3xl">
        <h2
          ref={titleRef}
          className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-16"
        >
          Expérience
        </h2>

        <div className="relative pl-6 md:pl-8 border-l-2 border-primary/30">
          <ul className="space-y-12">
            {experiences.map((exp, i) => (
              <li
                key={`${exp.company}-${exp.period}`}
                ref={(el) => {
                  itemsRef.current[i] = el;
                }}
                className="relative"
              >
                <span className="absolute -left-[29px] md:-left-[33px] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-background" />
                <div className="p-6 rounded-2xl bg-background border border-border hover:border-primary/40 transition-colors">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {exp.role}
                    </h3>
                    <span className="text-sm text-muted">{exp.period}</span>
                  </div>
                  <p className="text-primary font-medium mt-1">{exp.company}</p>
                  <p className="text-muted mt-3">{exp.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
