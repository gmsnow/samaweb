"use client";

import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

function Spine({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const group = React.useRef<THREE.Group>(null);
  const vertebrae = React.useMemo(() => {
    const items: { position: [number, number, number]; scale: number }[] = [];
    for (let i = 0; i < 16; i++) {
      const t = i / 15;
      const y = -2.4 + t * 4.8;
      const x = Math.sin(t * Math.PI * 1.6) * 0.35;
      const z = Math.cos(t * Math.PI) * 0.12;
      const scale = 0.42 - Math.abs(t - 0.5) * 0.28;
      items.push({ position: [x, y, z], scale });
    }
    return items;
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    const target = mouse.current;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      target.x * 0.5 + state.clock.elapsedTime * 0.18,
      0.05
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      target.y * 0.3 + Math.sin(state.clock.elapsedTime * 0.4) * 0.08,
      0.05
    );
  });

  const material = React.useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#2563eb",
        metalness: 0.2,
        roughness: 0.25,
        transparent: true,
        opacity: 0.92,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
      }),
    []
  );

  const discMaterial = React.useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#06b6d4",
        metalness: 0.4,
        roughness: 0.2,
        transparent: true,
        opacity: 0.7,
      }),
    []
  );

  return (
    <group ref={group}>
      {vertebrae.map((v, i) => (
        <mesh key={i} position={v.position}>
          <icosahedronGeometry args={[v.scale, 1]} />
          <primitive object={material} attach="material" />
        </mesh>
      ))}
      {vertebrae.slice(0, -1).map((v, i) => {
        const next = vertebrae[i + 1];
        const mid: [number, number, number] = [
          (v.position[0] + next.position[0]) / 2,
          (v.position[1] + next.position[1]) / 2,
          (v.position[2] + next.position[2]) / 2,
        ];
        return (
          <mesh key={`disc-${i}`} position={mid} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.16, 0.16, 0.12, 24]} />
            <primitive object={discMaterial} attach="material" />
          </mesh>
        );
      })}
    </group>
  );
}

function DnaHelix() {
  const group = React.useRef<THREE.Group>(null);
  const sphereMaterial = React.useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#06b6d4",
        emissive: "#06b6d4",
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.1,
        transparent: true,
        opacity: 0.95,
      }),
    []
  );
  const rungMaterial = React.useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#3b82f6",
        transparent: true,
        opacity: 0.4,
      }),
    []
  );

  const helix = React.useMemo(() => {
    const points: [number, number, number][] = [];
    for (let i = 0; i < 44; i++) {
      const t = (i / 44) * Math.PI * 6;
      const y = -2.1 + (i / 44) * 4.2;
      points.push([Math.cos(t) * 0.75, y, Math.sin(t) * 0.75]);
    }
    return points;
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.22;
  });

  return (
    <group ref={group} position={[2.6, 0, -1]}>
      <Float speed={1.6} rotationIntensity={0.4} floatIntensity={0.6}>
        {helix.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.045, 16, 16]} />
            <primitive object={sphereMaterial} attach="material" />
          </mesh>
        ))}
        {helix.slice(0, -1).map((p, i) => {
          const next = helix[i + 1];
          return (
            <mesh
              key={`rung-${i}`}
              position={[
                (p[0] + next[0]) / 2,
                (p[1] + next[1]) / 2,
                (p[2] + next[2]) / 2,
              ]}
            >
              <sphereGeometry args={[0.03, 12, 12]} />
              <primitive object={rungMaterial} attach="material" />
            </mesh>
          );
        })}
      </Float>
    </group>
  );
}

function GlassOrb({
  position,
  color,
  scale = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
}) {
  const material = React.useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color,
        metalness: 0.1,
        roughness: 0.08,
        transparent: true,
        opacity: 0.35,
        clearcoat: 1,
        envMapIntensity: 1.4,
      }),
    [color]
  );
  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={1.4}>
      <mesh position={position} scale={scale} material={material}>
        <sphereGeometry args={[0.55, 48, 48]} />
      </mesh>
    </Float>
  );
}

function ParallaxLayer() {
  const group = React.useRef<THREE.Group>(null);
  const mouse = React.useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    if (!group.current) return;
    const cx = mouse.current.x;
    const cy = mouse.current.y;
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, cx * 0.25, 0.04);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, -cy * 0.25, 0.04);
  });

  return (
    <group ref={group}>
      <Spine mouse={mouse} />
      <DnaHelix />
      <GlassOrb position={[-2.6, 1.3, -1.4]} color="#3b82f6" scale={0.9} />
      <GlassOrb position={[-1.9, -1.5, -2]} color="#06b6d4" scale={0.7} />
      <GlassOrb position={[1.7, 1.6, -2.2]} color="#818cf8" scale={1.05} />
      <Sparkles count={110} scale={[9, 6, 5]} size={2.2} speed={0.35} color="#60a5fa" />
      <Sparkles count={60} scale={[7, 5, 4]} size={1.4} speed={0.5} color="#22d3ee" />
    </group>
  );
}

export function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 6.4], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
      aria-label="3D visualization of the human spine and DNA"
      role="img"
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 4]} intensity={1.1} color="#ffffff" />
      <directionalLight position={[-4, -2, -3]} intensity={0.5} color="#06b6d4" />
      <pointLight position={[0, 0, 3]} intensity={1.2} color="#60a5fa" />
      <ParallaxLayer />
      <EffectComposer>
        <Bloom
          intensity={0.85}
          luminanceThreshold={0.18}
          luminanceSmoothing={0.9}
          mipmapBlur
          radius={0.7}
        />
      </EffectComposer>
    </Canvas>
  );
}
