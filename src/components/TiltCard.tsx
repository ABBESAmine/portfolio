"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
} from "react";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

const MAX_TILT = 8;
const REST_TRANSFORM = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";

type TiltCardProps = {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "a";
  href?: string;
  [key: string]: unknown;
};

export const TiltCard = forwardRef<HTMLDivElement | HTMLAnchorElement, TiltCardProps>(
  function TiltCard(
    { children, className = "", style = {}, as = "a", ...rest },
    ref
  ) {
  const Component = as as React.ElementType;
  const innerRef = useRef<HTMLDivElement | HTMLAnchorElement>(null);
  const frameRef = useRef<number | null>(null);
  const targetRef = useRef({ rotateX: 0, rotateY: 0 });
  const enabledRef = useRef(false);

  // Le tilt ne doit exister que sur un vrai pointeur : sur tactile, le tap
  // déclenche mousemove sans jamais déclencher mouseleave, et la carte reste
  // figée inclinée.
  useEffect(() => {
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => {
      enabledRef.current = mql.matches && !prefersReducedMotion();
      if (!enabledRef.current && innerRef.current) {
        innerRef.current.style.transform = "";
      }
    };
    sync();
    mql.addEventListener("change", sync);
    return () => {
      mql.removeEventListener("change", sync);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const setRef = useCallback(
    (node: HTMLDivElement | HTMLAnchorElement | null) => {
      (innerRef as React.MutableRefObject<HTMLDivElement | HTMLAnchorElement | null>).current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | HTMLAnchorElement | null>).current = node;
    },
    [ref]
  );

  const flush = useCallback(() => {
    frameRef.current = null;
    const el = innerRef.current;
    if (!el) return;
    const { rotateX, rotateY } = targetRef.current;
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement>) => {
      const el = innerRef.current;
      if (!el || !enabledRef.current) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRef.current = { rotateY: x * MAX_TILT, rotateX: -y * MAX_TILT };

      // Pas de transition pendant le suivi : une transition ici ferait traîner
      // la carte derrière le curseur en permanence.
      el.style.transitionDuration = "0ms";
      if (frameRef.current === null) {
        frameRef.current = requestAnimationFrame(flush);
      }
    },
    [flush]
  );

  const onMouseLeave = useCallback(() => {
    const el = innerRef.current;
    if (!el || !enabledRef.current) return;
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    // Le retour au repos, lui, s'anime.
    el.style.transitionDuration = "400ms";
    el.style.transform = REST_TRANSFORM;
  }, []);

  return (
    <Component
      ref={setRef}
      className={`transition-transform ease-out-strong ${className}`}
      style={style}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      {...(rest as object)}
    >
      {children}
    </Component>
  );
});
