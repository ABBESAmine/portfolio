"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    role: "Développeur Full-Stack en alternance",
    company: "ESPCI Paris",
    period: "Octobre 2023 – Septembre 2026",
    description:
      "Application web interactive de navigation multi-bâtiments (HTML, CSS, JavaScript, SPIP). Site de gestion des demandes de logement étudiant avec formulaire, interface admin et e-mails automatisés. Back-end, conversion LDAP et bases de données relationnelles.",
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
      className="relative py-20 lg:py-28 px-6 bg-section-alt pattern-border-bottom"
    >
      <div className="container mx-auto max-w-3xl relative z-10">
        <h2
          ref={titleRef}
          className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-16"
        >
          Expérience
        </h2>

        <div className="relative pl-6 md:pl-8 border-l-2 border-heading/50">
          <ul className="space-y-12">
            {experiences.map((exp, i) => (
              <li
                key={`${exp.company}-${exp.period}`}
                ref={(el) => {
                  itemsRef.current[i] = el;
                }}
                className="relative"
              >
                {/* Pastille centrée sur la barre : bordure 2px + padding (24/32px) + moitié pastille (6px) - centre du trait = 31px / 39px */}
                <span className="absolute top-1 -left-[31px] md:-left-[39px] w-3 h-3 rounded-full bg-heading shrink-0" />
                <div className="p-6 rounded-2xl bg-card border border-border hover:border-heading/40 transition-colors">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {exp.role}
                    </h3>
                    <span className="text-sm text-muted">{exp.period}</span>
                  </div>
                  <p className="text-heading font-medium mt-1">{exp.company}</p>
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
