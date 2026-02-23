"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => setProgress(self.progress),
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] scroll-progress"
      style={{ transform: `scaleX(${progress})` }}
    />
  );
}
