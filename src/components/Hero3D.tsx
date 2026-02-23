"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function Sphere() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.12;
  });
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={ref} position={[0, 0, -1]}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial
          color="#0B6E4F"
          wireframe
          transparent
          opacity={0.6}
          emissive="#0B6E4F"
          emissiveIntensity={0.15}
        />
      </mesh>
    </Float>
  );
}

function Dodecahedron() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.08;
      ref.current.rotation.y += delta * 0.12;
    }
  });
  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.4}>
      <mesh ref={ref} position={[1.8, 0.6, -2]}>
        <dodecahedronGeometry args={[0.35, 0]} />
        <meshBasicMaterial
          color="#C6A75E"
          wireframe
          transparent
          opacity={0.5}
        />
      </mesh>
    </Float>
  );
}

function Octahedron() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.1;
      ref.current.rotation.z += delta * 0.08;
    }
  });
  return (
    <Float speed={1.3} rotationIntensity={0.25} floatIntensity={0.35}>
      <mesh ref={ref} position={[-1.5, -0.4, -1.5]}>
        <octahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color="#C1272D"
          wireframe
          transparent
          opacity={0.55}
          emissive="#C1272D"
          emissiveIntensity={0.1}
        />
      </mesh>
    </Float>
  );
}

function Tetrahedron() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.18;
  });
  return (
    <Float speed={1.1} rotationIntensity={0.2} floatIntensity={0.45}>
      <mesh ref={ref} position={[-1.2, 0.8, -2]}>
        <tetrahedronGeometry args={[0.3, 0]} />
        <meshBasicMaterial color="#0B6E4F" transparent opacity={0.5} wireframe />
      </mesh>
    </Float>
  );
}

function Box() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.06;
      ref.current.rotation.y += delta * 0.1;
    }
  });
  return (
    <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.3}>
      <mesh ref={ref} position={[1.4, -0.5, -2.2]}>
        <boxGeometry args={[0.35, 0.35, 0.35]} />
        <meshStandardMaterial
          color="#C6A75E"
          wireframe
          transparent
          opacity={0.45}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-3, 2, 2]} intensity={0.6} color="#0B6E4F" />
      <pointLight position={[3, -1, 1]} intensity={0.4} color="#C1272D" />
      <Sphere />
      <Dodecahedron />
      <Octahedron />
      <Tetrahedron />
      <Box />
    </>
  );
}

function Hero3D() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        className="!w-full !h-full"
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
      >
        <Scene />
      </Canvas>
      <div className="absolute inset-0 bg-background/70 pointer-events-none" />
    </div>
  );
}

export default Hero3D;
export { Hero3D };
