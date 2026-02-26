"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";

const Hero3D = dynamic(() => import("./Hero3D").then((m) => m.Hero3D), {
  ssr: false,
  loading: () => <div className="absolute inset-0 z-0 bg-background/80" />,
});

/** Décalage max des blobs en px (souris au bord = ±PARALLAX_STRENGTH/2). Les blobs sont derrière le canvas 3D. */
const PARALLAX_STRENGTH = 8;

type BlobOffset = { x: number; y: number };

export function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const wordRefs = useRef<HTMLSpanElement[]>([]);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const [blobMove, setBlobMove] = useState<{ b1: BlobOffset; b2: BlobOffset; b3: BlobOffset }>({
    b1: { x: 0, y: 0 },
    b2: { x: 0, y: 0 },
    b3: { x: 0, y: 0 },
  });

  const words = ["Développeur", "Full-Stack"];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (!inside) {
        setBlobMove({ b1: { x: 0, y: 0 }, b2: { x: 0, y: 0 }, b3: { x: 0, y: 0 } });
        return;
      }
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const dx = x * PARALLAX_STRENGTH;
      const dy = y * PARALLAX_STRENGTH;
      setBlobMove({
        b1: { x: dx * 0.8, y: dy * 0.6 },
        b2: { x: -dx * 0.6, y: -dy * 0.5 },
        b3: { x: dx * 0.4, y: dy * 0.4 },
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

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
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-16 lg:pt-0 overflow-hidden pattern-border-bottom"
    >
      {/* Canvas en premier (z-0), comme sur amineabb.es */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="absolute inset-0 bg-background/80" />}>
          <Hero3D />
        </Suspense>
      </div>

      {/* Halos (blobs) — même structure que amineabb.es : pas de wrapper, position sur la div .blob */}
      <div
        ref={blob1Ref}
        className="blob w-[400px] h-[400px] bg-heading -top-40 -right-40 lg:top-1/4 lg:right-1/4 transition-transform duration-200 ease-out"
        style={{ transform: `translate(${blobMove.b1.x}px, ${blobMove.b1.y}px)` }}
      />
      <div
        ref={blob2Ref}
        className="blob w-[320px] h-[320px] bg-accent bottom-20 -left-32 lg:bottom-1/4 lg:left-1/4 transition-transform duration-200 ease-out"
        style={{ transform: `translate(${blobMove.b2.x}px, ${blobMove.b2.y}px)` }}
      />
      <div
        ref={blob3Ref}
        className="blob w-[280px] h-[280px] bg-primary top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ease-out"
        style={{ transform: `translate(calc(-50% + ${blobMove.b3.x}px), calc(-50% + ${blobMove.b3.y}px))` }}
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
            className="px-8 py-3.5 rounded-full bg-primary text-white font-medium hover:bg-primary-hover transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
          >
            Voir mes projets
          </a>
          <a
            href="#contact"
            className="px-8 py-3.5 rounded-full border-2 border-heading text-heading font-medium hover:bg-heading hover:text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
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
        <div className="w-px h-10 bg-gradient-to-b from-red to-transparent rounded-full" />
      </div>
    </section>
  );
}
