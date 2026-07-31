"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
} from "react";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import { duration } from "@/lib/motion";

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
  // Horodatage de fin de la transition d'entrée. Tant qu'on est dedans, on
  // laisse la transition courir ; après, la carte se colle au curseur.
  const settleUntilRef = useRef(0);

  // Le tilt ne doit exister que sur un vrai pointeur : sur tactile, le tap
  // déclenche mousemove sans jamais déclencher mouseleave, et la carte reste
  // figée inclinée. Les deux préférences sont écoutées — relire le motion
  // réduit uniquement quand le type de pointeur change laissait le tilt actif
  // si l'utilisateur basculait la préférence en cours de session.
  useEffect(() => {
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      enabledRef.current = pointer.matches && !motion.matches;
      if (!enabledRef.current && innerRef.current) {
        innerRef.current.style.transform = "";
      }
    };
    sync();
    pointer.addEventListener("change", sync);
    motion.addEventListener("change", sync);
    return () => {
      pointer.removeEventListener("change", sync);
      motion.removeEventListener("change", sync);
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

  const onMouseEnter = useCallback(() => {
    if (!enabledRef.current) return;
    settleUntilRef.current = performance.now() + duration.base;
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement>) => {
      const el = innerRef.current;
      if (!el || !enabledRef.current) return;
      // Pendant son apparition au scroll, la carte est pilotée par GSAP, qui
      // écrit sur le même `transform`. Y toucher ici ferait sauter la carte à
      // sa position finale sous le curseur.
      if (el.dataset.revealing !== undefined) return;

      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRef.current = { rotateY: x * MAX_TILT, rotateX: -y * MAX_TILT };

      // Les premières millisecondes après l'entrée du curseur gardent une
      // transition : sans elle la carte sautait d'un coup en scale(1.02) et
      // pleine inclinaison. La transition se retarge à chaque frame, donc la
      // carte rejoint le curseur en accélérant au lieu d'apparaître inclinée.
      // Passé ce délai, plus aucune transition : elle traînerait derrière le
      // curseur en permanence.
      el.style.transitionDuration =
        performance.now() < settleUntilRef.current ? `${duration.base}ms` : "0ms";

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
    settleUntilRef.current = 0;
    // Le retour au repos est une réponse du système, pas un geste : il claque.
    el.style.transitionDuration = `${duration.slow}ms`;
    el.style.transform = REST_TRANSFORM;
  }, []);

  return (
    <Component
      ref={setRef}
      className={`transition-transform ease-out-strong ${className}`}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      {...(rest as object)}
    >
      {children}
    </Component>
  );
});
