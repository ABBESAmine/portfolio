"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const skills = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Node.js",
  "PostgreSQL",
  "Supabase",
  "GSAP",
  "API REST",
  "Figma",
];

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

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
        marqueeRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-20 lg:py-28 px-6 overflow-hidden"
    >
      <div className="container mx-auto max-w-6xl">
        <h2
          ref={titleRef}
          className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-14"
        >
          Compétences
        </h2>
        <div ref={marqueeRef} className="relative">
          <div className="flex animate-marquee gap-4 w-max">
            {[...skills, ...skills].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="shrink-0 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-foreground font-medium text-sm md:text-base hover:bg-primary/20 hover:border-primary/40 transition-colors"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
        <p className="text-center text-muted text-sm mt-8 max-w-md mx-auto">
          Frontend, backend, bases de données et outils d’animation — stack moderne et maintenable.
        </p>
      </div>
    </section>
  );
}
