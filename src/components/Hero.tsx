"use client";

import { Suspense, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";

const Hero3D = dynamic(() => import("./Hero3D").then((m) => m.Hero3D), {
  ssr: false,
  loading: () => <div className="absolute inset-0 z-0 bg-background/80" />,
});

export function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const wordRefs = useRef<HTMLSpanElement[]>([]);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);

  const words = ["Développeur", "Full-Stack"];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        blob1Ref.current,
        { scale: 0.8, x: -50, opacity: 0 },
        { scale: 1, x: 0, opacity: 0.4, duration: 1.2, ease: "power2.out", delay: 0.2 }
      );
      gsap.fromTo(
        blob2Ref.current,
        { scale: 0.8, x: 50, opacity: 0 },
        { scale: 1, x: 0, opacity: 0.35, duration: 1.2, ease: "power2.out", delay: 0.4 }
      );
      gsap.fromTo(
        blob3Ref.current,
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 0.3, duration: 1, ease: "power2.out", delay: 0.6 }
      );
      wordRefs.current.forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.3 + i * 0.15 }
        );
      });
      gsap.fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power2.out", delay: 0.8 }
      );
      gsap.fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, delay: 1 }
      );
      gsap.fromTo(
        scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, delay: 1.4 }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-16 lg:pt-0 overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="absolute inset-0 bg-background/80" />}>
          <Hero3D />
        </Suspense>
      </div>
      {/* Background blobs */}
      <div
        ref={blob1Ref}
        className="blob w-[400px] h-[400px] bg-heading -top-40 -right-40 lg:top-1/4 lg:right-1/4"
      />
      <div
        ref={blob2Ref}
        className="blob w-[320px] h-[320px] bg-accent bottom-20 -left-32 lg:bottom-1/4 lg:left-1/4"
      />
      <div
        ref={blob3Ref}
        className="blob w-[280px] h-[280px] bg-primary top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />

      <div className="relative z-10 text-center max-w-4xl">
        <h1
          ref={titleRef}
          className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground"
        >
          {words.map((word, i) => (
            <span
              key={word}
              ref={(el) => {
                if (el) wordRefs.current[i] = el;
              }}
              className={i === 0 ? "block" : "block gradient-text"}
            >
              {word}
            </span>
          ))}
        </h1>
        <p
          ref={subtitleRef}
          className="mt-6 text-lg md:text-xl text-muted max-w-xl mx-auto"
        >
          Applications web modernes — React, Next.js, Node.js
        </p>
        <div ref={ctaRef} className="mt-10 flex flex-wrap gap-4 justify-center">
          <a
            href="#projects"
            className="px-8 py-3.5 rounded-full bg-primary text-white font-medium hover:bg-primary-hover transition-all hover:scale-105"
          >
            Voir mes projets
          </a>
          <a
            href="#contact"
            className="px-8 py-3.5 rounded-full border-2 border-heading text-heading font-medium hover:bg-heading hover:text-white transition-all"
          >
            Me contacter
          </a>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-heading to-transparent rounded-full" />
      </div>
    </section>
  );
}
