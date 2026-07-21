"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

const Hero3D = dynamic(() => import("./Hero3D").then((m) => m.Hero3D), {
  ssr: false,
  loading: () => <div className="absolute inset-0 z-0 bg-background/80" />,
});

/** Décalage max des blobs en px (souris au bord = ±PARALLAX_STRENGTH/2). Les blobs sont derrière le canvas 3D. */
const PARALLAX_STRENGTH = 8;
/** Rayon du halo qui révèle le titre en dégradé. */
const GLOW_RADIUS = 110;
/** Facteur de lissage du suivi souris (0 = figé, 1 = collé au curseur). */
const LERP = 0.12;

const BLOB_COEFFS = [
  { x: 0.8, y: 0.6 },
  { x: -0.6, y: -0.5 },
  { x: 0.4, y: 0.4 },
] as const;

export function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const wordRefs = useRef<HTMLSpanElement[]>([]);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const titleHoverRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const glowInnerRef = useRef<HTMLDivElement>(null);

  // Cibles et valeurs courantes vivent dans des refs : un setState par frame
  // re-rendrait tout le sous-arbre du Hero, canvas 3D compris.
  const blobTarget = useRef({ x: 0, y: 0 });
  const blobCurrent = useRef({ x: 0, y: 0 });
  const glowTarget = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);

  // `active` change rarement (entrée/sortie du titre) : React est légitime ici.
  const [glowActive, setGlowActive] = useState(false);
  const [glowSize, setGlowSize] = useState({ width: 0, height: 0 });

  const words = ["Développeur", "Full-Stack"];

  /** Boucle unique : lisse les cibles et écrit les transforms. Composite pur. */
  const tick = useCallback(() => {
    const cur = blobCurrent.current;
    const tgt = blobTarget.current;
    cur.x += (tgt.x - cur.x) * LERP;
    cur.y += (tgt.y - cur.y) * LERP;

    BLOB_COEFFS.forEach((coeff, i) => {
      const el = blobRefs.current[i];
      if (!el) return;
      const x = cur.x * coeff.x;
      const y = cur.y * coeff.y;
      // Le 3e blob est centré via translate(-50%, -50%) : on le compose ici
      // plutôt que de laisser Tailwind poser un transform concurrent.
      el.style.transform =
        i === 2
          ? `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0)`
          : `translate3d(${x}px, ${y}px, 0)`;
    });

    // Le halo : le cercle masqué se déplace, le texte en dégradé qu'il contient
    // se déplace à l'inverse pour rester aligné sur le titre. Deux transforms,
    // aucun repaint — contrairement à un mask-image recalculé à chaque frame.
    const glow = glowRef.current;
    const inner = glowInnerRef.current;
    if (glow && inner) {
      const { x, y } = glowTarget.current;
      glow.style.transform = `translate3d(${x - GLOW_RADIUS}px, ${y - GLOW_RADIUS}px, 0)`;
      inner.style.transform = `translate3d(${GLOW_RADIUS - x}px, ${GLOW_RADIUS - y}px, 0)`;
    }

    const settled =
      Math.abs(tgt.x - cur.x) < 0.05 && Math.abs(tgt.y - cur.y) < 0.05;
    frameRef.current = settled ? null : requestAnimationFrame(tick);
  }, []);

  const schedule = useCallback(() => {
    if (frameRef.current === null) {
      frameRef.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (!inside) {
        blobTarget.current = { x: 0, y: 0 };
      } else {
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        blobTarget.current = {
          x: x * PARALLAX_STRENGTH,
          y: y * PARALLAX_STRENGTH,
        };
      }
      schedule();
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [schedule]);

  // Le calque du halo doit avoir exactement les dimensions du titre pour que le
  // texte en dégradé se superpose au pixel près.
  useEffect(() => {
    const el = titleHoverRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setGlowSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleTitleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion()) return;
    const rect = e.currentTarget.getBoundingClientRect();
    glowTarget.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    if (!glowActive) setGlowActive(true);
    schedule();
  };

  const handleTitleLeave = () => setGlowActive(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      // Opacité uniquement : le `transform` des blobs appartient à la boucle
      // rAF de la parallaxe, GSAP ne doit pas y toucher.
      blobRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0 },
          { opacity: 0.35, duration: 0.6, ease: "expo.out", delay: i * 0.05 }
        );
      });
      wordRefs.current.forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: "expo.out",
            delay: 0.05 + i * 0.06,
          }
        );
      });
      gsap.fromTo(
        subtitleRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, ease: "expo.out", delay: 0.25 }
      );
      gsap.fromTo(
        ctaRef.current,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: "expo.out", delay: 0.35 }
      );
      gsap.fromTo(
        scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, delay: 0.5 }
      );
    });
    return () => ctx.revert();
  }, []);

  const glowTextClass =
    "font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight";

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-16 lg:pt-0 overflow-hidden pattern-border-bottom"
    >
      {/* Ornement coin haut droite (PC) — z-0 pour rester derrière les blobs */}
      <div
        className="absolute top-8 right-8 z-0 hidden lg:block w-16 h-16 text-heading/40 opacity-70"
        aria-hidden
      >
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.8">
          <path d="M32 8 L56 32 L32 56 L8 32 Z" />
          <path d="M32 16 L48 32 L32 48 L16 32 Z" />
          <path d="M32 24 L40 32 L32 40 L24 32 Z" />
        </svg>
      </div>
      {/* Canvas en premier (z-0), comme sur amineabb.es */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="absolute inset-0 bg-background/80" />}>
          <Hero3D />
        </Suspense>
      </div>

      {/* Halos (blobs) — déplacés par la boucle rAF, jamais par React */}
      <div
        ref={(el) => {
          blobRefs.current[0] = el;
        }}
        className="blob w-[400px] h-[400px] bg-heading -top-40 -right-40 lg:top-1/4 lg:right-1/4"
      />
      <div
        ref={(el) => {
          blobRefs.current[1] = el;
        }}
        className="blob w-[320px] h-[320px] bg-accent bottom-20 -left-32 lg:bottom-1/4 lg:left-1/4"
      />
      <div
        ref={(el) => {
          blobRefs.current[2] = el;
        }}
        className="blob w-[280px] h-[280px] bg-primary top-1/2 left-1/2"
        style={{ transform: "translate3d(-50%, -50%, 0)" }}
      />

      <div className="relative z-10 text-center max-w-4xl">
        <div
          ref={titleHoverRef}
          className="relative inline-block cursor-default select-none"
          onMouseMove={handleTitleMove}
          onMouseEnter={handleTitleMove}
          onMouseLeave={handleTitleLeave}
        >
          <h1
            ref={titleRef}
            className={`${glowTextClass} text-foreground`}
          >
            {words.map((word, i) => (
              <span
                key={word}
                ref={(el) => {
                  if (el) wordRefs.current[i] = el;
                }}
                className={i === 0 ? "block" : "block gradient-text"}
              >
                {word}{i < words.length - 1 ? " " : ""}
              </span>
            ))}
          </h1>

          {/* Fenêtre circulaire masquée : le masque est statique (calculé une
              fois), seul le transform bouge. */}
          <div
            aria-hidden
            className={`pointer-events-none absolute left-0 top-0 overflow-hidden transition-opacity duration-150 ease-out-strong ${
              glowActive ? "opacity-100" : "opacity-0"
            }`}
            ref={glowRef}
            style={{
              width: GLOW_RADIUS * 2,
              height: GLOW_RADIUS * 2,
              willChange: "transform",
              WebkitMaskImage:
                "radial-gradient(closest-side, #000 0%, #000 55%, transparent 100%)",
              maskImage:
                "radial-gradient(closest-side, #000 0%, #000 55%, transparent 100%)",
            }}
          >
            <div
              ref={glowInnerRef}
              className={`${glowTextClass} absolute left-0 top-0 text-center`}
              style={{
                width: glowSize.width || undefined,
                height: glowSize.height || undefined,
                willChange: "transform",
                color: "transparent",
                WebkitTextFillColor: "transparent",
                backgroundImage:
                  "linear-gradient(135deg, var(--heading) 0%, var(--red) 50%, var(--accent) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
            >
              {words.map((word) => (
                <span key={`glow-${word}`} className="block">
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>
        <p
          ref={subtitleRef}
          className="mt-6 text-lg md:text-xl text-muted max-w-xl mx-auto"
        >
          Applications web modernes — React, Next.js, Node.js
        </p>
        <div ref={ctaRef} className="mt-10 flex flex-wrap gap-4 justify-center">
          <a
            href="#projects"
            className="px-8 py-3.5 rounded-full bg-primary text-white font-medium hover:bg-primary-hover hover:scale-105 active:scale-[0.97] hover:shadow-lg hover:shadow-primary/30 transition-[transform,background-color] duration-150 ease-out-strong"
          >
            Voir mes projets
          </a>
          <a
            href="#contact"
            className="px-8 py-3.5 rounded-full border-2 border-heading text-heading font-medium hover:bg-heading hover:text-white hover:scale-[1.02] active:scale-[0.97] hover:shadow-md transition-[transform,background-color,color] duration-150 ease-out-strong"
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
