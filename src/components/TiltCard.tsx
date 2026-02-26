"use client";

import { forwardRef, useRef, useState, useCallback, type CSSProperties } from "react";

const MAX_TILT = 8;

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
  const [transform, setTransform] = useState("");

  const setRef = useCallback(
    (node: HTMLDivElement | HTMLAnchorElement | null) => {
      (innerRef as React.MutableRefObject<HTMLDivElement | HTMLAnchorElement | null>).current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | HTMLAnchorElement | null>).current = node;
    },
    [ref]
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement>) => {
      const el = innerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rotateY = x * MAX_TILT;
      const rotateX = -y * MAX_TILT;
      setTransform(
        `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
      );
    },
    []
  );

  const onMouseLeave = useCallback(() => {
    setTransform("perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)");
  }, []);

  return (
    <Component
      ref={setRef}
      className={`transition-transform duration-300 ease-out ${className}`}
      style={{ transform, ...(style ?? {}) }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      {...(rest as object)}
    >
      {children}
    </Component>
  );
});
