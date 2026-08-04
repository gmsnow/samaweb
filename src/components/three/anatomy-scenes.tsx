"use client";

import * as React from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function useMaterial(color: string, opts: Partial<THREE.MeshPhysicalMaterialParameters> = {}) {
  return React.useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color,
        metalness: 0.15,
        roughness: 0.25,
        transparent: true,
        opacity: 0.95,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
        ...opts,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
}

function useAutoRotate(speed = 0.25) {
  const ref = React.useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * speed;
  });
  return ref;
}

export function SpineScene() {
  const bone = useMaterial("#2563eb");
  const disc = useMaterial("#06b6d4", { opacity: 0.55 });
  const ref = useAutoRotate(0.2);
  const vertebrae = React.useMemo(() => {
    const items: { position: [number, number, number]; scale: number }[] = [];
    for (let i = 0; i < 20; i++) {
      const t = i / 19;
      const y = -2.6 + t * 5.2;
      const x = Math.sin(t * Math.PI * 1.8) * 0.4;
      const z = Math.cos(t * Math.PI) * 0.14;
      items.push({ position: [x, y, z], scale: 0.5 - Math.abs(t - 0.5) * 0.3 });
    }
    return items;
  }, []);

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
      <group ref={ref}>
        {vertebrae.map((v, i) => (
          <mesh key={i} position={v.position} material={bone}>
            <icosahedronGeometry args={[v.scale, 1]} />
          </mesh>
        ))}
        {vertebrae.slice(0, -1).map((v, i) => {
          const next = vertebrae[i + 1];
          return (
            <mesh
              key={`d${i}`}
              material={disc}
              position={[
                (v.position[0] + next.position[0]) / 2,
                (v.position[1] + next.position[1]) / 2,
                (v.position[2] + next.position[2]) / 2,
              ]}
            >
              <cylinderGeometry args={[0.18, 0.18, 0.1, 24]} />
            </mesh>
          );
        })}
      </group>
    </Float>
  );
}

export function KneeScene() {
  const bone = useMaterial("#6366f1");
  const boneEnd = useMaterial("#818cf8");
  const cartilage = useMaterial("#f472b6", { opacity: 0.6 });
  const ref = useAutoRotate(0.35);

  return (
    <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={ref}>
        <group rotation={[0, 0, -0.35]} position={[0, 1.3, 0]}>
          <mesh material={bone} position={[0, 1.1, 0]}>
            <capsuleGeometry args={[0.38, 1.9, 8, 24]} />
          </mesh>
          <mesh material={boneEnd} position={[0, -0.05, 0]} rotation={[0.2, 0, 0]}>
            <sphereGeometry args={[0.52, 32, 32]} />
          </mesh>
        </group>
        <mesh material={cartilage} position={[0, -0.12, 0.28]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.46, 0.09, 16, 40]} />
        </mesh>
        <mesh material={cartilage} position={[0, -0.12, -0.28]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.46, 0.09, 16, 40]} />
        </mesh>
        <mesh material={bone} position={[0, -1.35, 0]} rotation={[0, 0, 0.12]}>
          <capsuleGeometry args={[0.32, 2, 8, 24]} />
        </mesh>
        <Float speed={2} rotationIntensity={0} floatIntensity={0.5}>
          <mesh material={boneEnd} position={[0.05, 0.05, 0.55]} rotation={[0.4, 0, 0.1]}>
            <sphereGeometry args={[0.34, 32, 32]} />
          </mesh>
        </Float>
      </group>
    </Float>
  );
}

export function ShoulderScene() {
  const bone = useMaterial("#0ea5e9");
  const joint = useMaterial("#38bdf8");
  const muscle = useMaterial("#fb7185", { opacity: 0.5 });
  const ref = useAutoRotate(0.3);

  return (
    <Float speed={1.3} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={ref}>
        <mesh material={muscle} position={[-0.6, 0.2, 0]} rotation={[0, 0, 0.3]}>
          <sphereGeometry args={[0.95, 32, 32]} />
        </mesh>
        <mesh material={joint} position={[0, 0, 0]}>
          <sphereGeometry args={[0.55, 48, 48]} />
        </mesh>
        <mesh material={bone} position={[-1.1, -0.6, 0]} rotation={[0.4, 0.2, 0.3]}>
          <capsuleGeometry args={[0.26, 1.5, 8, 24]} />
        </mesh>
        <mesh material={bone} position={[0.4, -1.3, 0.2]} rotation={[0.2, 0, 0.05]}>
          <capsuleGeometry args={[0.3, 2, 8, 24]} />
        </mesh>
        <mesh material={bone} position={[0.7, -0.4, -0.7]} rotation={[0.3, 0.5, 0.3]}>
          <capsuleGeometry args={[0.22, 1.2, 8, 24]} />
        </mesh>
      </group>
    </Float>
  );
}

function BrainHemisphere({ position, seed }: { position: [number, number, number]; seed: number }) {
  const material = useMaterial("#f472b6", { roughness: 0.4 });
  const geometry = React.useMemo(() => {
    const geo = new THREE.SphereGeometry(0.95, 64, 64);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const rand = (i: number) => {
      const n = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
      return n - Math.floor(n);
    };
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const bump = 0.04 + rand(i * 1.31) * 0.08;
      pos.setXYZ(i, x * (1 + bump), y * (1 + bump), z * (1 + bump));
    }
    geo.computeVertexNormals();
    return geo;
  }, [seed]);
  return (
    <mesh position={position} material={material} geometry={geometry} scale={[1, 0.92, 0.9]} />
  );
}

export function BrainScene() {
  const stem = useMaterial("#fb923c");
  const ref = useAutoRotate(0.18);

  return (
    <Float speed={1.1} rotationIntensity={0.2} floatIntensity={0.4}>
      <group ref={ref}>
        <BrainHemisphere position={[-0.52, 0.1, 0]} seed={1} />
        <BrainHemisphere position={[0.52, 0.1, 0]} seed={2} />
        <mesh material={stem} position={[0, -0.95, 0]} rotation={[0, 0, 0.15]}>
          <capsuleGeometry args={[0.22, 1.4, 8, 24]} />
        </mesh>
      </group>
    </Float>
  );
}

export function MuscleScene() {
  const fiberA = useMaterial("#ef4444");
  const fiberB = useMaterial("#f87171", { opacity: 0.85 });
  const ref = useAutoRotate(0.3);

  const fibers = React.useMemo(() => {
    const list: { pos: [number, number, number]; rot: [number, number, number]; scale: number }[] = [];
    for (let i = 0; i < 9; i++) {
      const angle = (i / 9) * Math.PI * 2;
      const r = 0.34 + (i % 3) * 0.14;
      list.push({
        pos: [Math.cos(angle) * r, 0, Math.sin(angle) * r],
        rot: [0.12, angle * 2, 0.08],
        scale: 1 - (i % 3) * 0.12,
      });
    }
    return list;
  }, []);

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.5}>
      <group ref={ref}>
        {fibers.map((f, i) => (
          <mesh
            key={i}
            position={f.pos}
            rotation={f.rot}
            scale={f.scale}
            material={i % 2 ? fiberB : fiberA}
          >
            <capsuleGeometry args={[0.2, 2.6, 8, 20]} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}
