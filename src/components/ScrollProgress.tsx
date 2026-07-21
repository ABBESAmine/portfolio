"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 0,
        end: "max",
        // Écriture directe sur le nœud : un setState ici provoquerait un rendu
        // React à chaque frame de scroll, sur toute la hauteur de la page.
        onUpdate: (self) => {
          bar.style.transform = `scaleX(${self.progress})`;
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 right-0 z-[100] scroll-progress"
      style={{ transform: "scaleX(0)" }}
    />
  );
}
