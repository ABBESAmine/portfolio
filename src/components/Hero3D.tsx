"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

function Scene({ mouseTarget }: { mouseTarget: MutableRefObject<THREE.Vector2> }) {
  // Uniquement le suivi souris : le groupe s'incline dans les limites du lerp
  // et revient au repos. Pas de rotation continue — les <Float> suffisent à
  // garder la scène vivante.
  const mouseRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!mouseRef.current) return;
    mouseRef.current.rotation.x = THREE.MathUtils.lerp(
      mouseRef.current.rotation.x,
      mouseTarget.current.y * 0.08,
      0.05
    );
    mouseRef.current.rotation.y = THREE.MathUtils.lerp(
      mouseRef.current.rotation.y,
      mouseTarget.current.x * 0.12,
      0.05
    );
  });

  return (
    <group ref={mouseRef}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-3, 2, 2]} intensity={0.8} color="#0B6E4F" />
      <pointLight position={[3, -1, 1]} intensity={0.7} color="#C1272D" />

      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.55}>
        <mesh position={[0, 0, -1]}>
          <icosahedronGeometry args={[0.62, 1]} />
          <meshStandardMaterial
            color="#0B6E4F"
            wireframe
            transparent
            opacity={0.85}
            emissive="#0B6E4F"
            emissiveIntensity={0.2}
            roughness={0.35}
            metalness={0.15}
          />
        </mesh>
      </Float>

      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.4}>
        <mesh position={[1.9, 0.7, -2]}>
          <dodecahedronGeometry args={[0.42, 0]} />
          <meshStandardMaterial
            color="#C6A75E"
            wireframe
            transparent
            opacity={0.75}
          />
        </mesh>
      </Float>

      <Float speed={1.3} rotationIntensity={0.25} floatIntensity={0.35}>
        <mesh position={[-1.6, -0.4, -1.5]}>
          <octahedronGeometry args={[0.48, 0]} />
          <meshStandardMaterial
            color="#C1272D"
            wireframe
            transparent
            opacity={0.8}
            emissive="#C1272D"
            emissiveIntensity={0.12}
          />
        </mesh>
      </Float>

      <Float speed={1.1} rotationIntensity={0.2} floatIntensity={0.45}>
        <mesh position={[-1.2, 0.85, -2]}>
          <tetrahedronGeometry args={[0.35, 0]} />
          <meshStandardMaterial
            color="#0B6E4F"
            wireframe
            transparent
            opacity={0.7}
          />
        </mesh>
      </Float>

      <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.3}>
        <mesh position={[1.4, -0.55, -2.2]}>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial
            color="#C6A75E"
            wireframe
            transparent
            opacity={0.78}
            roughness={0.45}
            metalness={0.12}
          />
        </mesh>
      </Float>
    </group>
  );
}

function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseTarget = useRef(new THREE.Vector2(0, 0));
  const [visible, setVisible] = useState(true);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    setAnimate(!prefersReducedMotion());
  }, []);

  // Sans ça, la scène continue de rendre à 60 fps quand le Hero est à plusieurs
  // écrans de distance : GPU et batterie brûlés sur ~90 % de la visite.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "100px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !animate) return;
    const onMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      if (x < 0 || x > 1 || y < 0 || y > 1) {
        mouseTarget.current.set(0, 0);
        return;
      }

      mouseTarget.current.set(x * 2 - 1, -(y * 2 - 1));
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [visible, animate]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full">
      <Canvas
        className="!w-full !h-full"
        camera={{ position: [0, 0, 3.7], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        frameloop={visible && animate ? "always" : "demand"}
      >
        <Scene mouseTarget={mouseTarget} />
      </Canvas>
      <div className="absolute inset-0 bg-background/35 pointer-events-none" />
    </div>
  );
}

export default Hero3D;
export { Hero3D };
