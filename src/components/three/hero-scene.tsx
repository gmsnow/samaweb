"use client";

import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, useGLTF, Environment, Lightformer } from "@react-three/drei";
import type { GLTF } from "three-stdlib";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

/* ─── GLB Spine ─────────────────────────────────────────────────────── */

useGLTF.preload("/spine.glb");

function GlbSpine({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const group = React.useRef<THREE.Group>(null);
  const { scene } = useGLTF("/spine.glb") as GLTF;

  React.useEffect(() => {
    let i = 0;
    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const shade = 0.94 + ((i * 7) % 10) / 90;
      child.material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(shade, shade * 0.97, shade * 0.86),
        metalness: 0.02,
        roughness: 0.42,
        clearcoat: 0.15,
        clearcoatRoughness: 0.3,
        envMapIntensity: 1.1,
      });
      i++;
    });
  }, [scene]);

  useFrame((state) => {
    if (!group.current) return;
    const { x: mx, y: my } = mouse.current;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      mx * 0.35 + t * 0.08,
      0.04
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      my * 0.18 + Math.sin(t * 0.35) * 0.04,
      0.04
    );
  });

  return (
    <group ref={group} position={[0, -0.34, 0]} scale={5.5}>
      <primitive object={scene} />
    </group>
  );
}

/* ─── DNA Helix ─────────────────────────────────────────────────────── */

function DnaHelix() {
  const group = React.useRef<THREE.Group>(null);

  const { strand1Curve, strand2Curve, rungData } = React.useMemo(() => {
    const R = 0.55,
      H = 4.8,
      TURNS = 3.5,
      N = 100;
    const s1: THREE.Vector3[] = [];
    const s2: THREE.Vector3[] = [];
    const rungs: {
      mid: THREE.Vector3;
      dir: THREE.Vector3;
      len: number;
    }[] = [];

    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const a = t * Math.PI * 2 * TURNS;
      const y = -H / 2 + t * H;
      s1.push(
        new THREE.Vector3(Math.cos(a) * R, y, Math.sin(a) * R)
      );
      s2.push(
        new THREE.Vector3(
          Math.cos(a + Math.PI) * R,
          y,
          Math.sin(a + Math.PI) * R
        )
      );
    }

    for (let i = 0; i <= N; i += 8) {
      const p1 = s1[i];
      const p2 = s2[i];
      const mid = p1.clone().add(p2).multiplyScalar(0.5);
      const dir = p2.clone().sub(p1);
      const len = dir.length();
      dir.normalize();
      rungs.push({ mid, dir, len });
    }

    return {
      strand1Curve: new THREE.CatmullRomCurve3(s1),
      strand2Curve: new THREE.CatmullRomCurve3(s2),
      rungData: rungs,
    };
  }, []);

  const strand1Geom = React.useMemo(
    () => new THREE.TubeGeometry(strand1Curve, 100, 0.035, 8, false),
    [strand1Curve]
  );
  const strand2Geom = React.useMemo(
    () => new THREE.TubeGeometry(strand2Curve, 100, 0.035, 8, false),
    [strand2Curve]
  );

  const strandMat = React.useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#3b82f6",
        emissive: "#3b82f6",
        emissiveIntensity: 0.5,
        metalness: 0.2,
        roughness: 0.25,
        transparent: true,
        opacity: 0.92,
        clearcoat: 0.7,
      }),
    []
  );

  const baseMat = React.useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#06b6d4",
        emissive: "#06b6d4",
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.6,
        metalness: 0.1,
        roughness: 0.3,
      }),
    []
  );

  const rungGeom = React.useMemo(
    () => new THREE.CylinderGeometry(0.022, 0.022, 1, 8),
    []
  );

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.18;
    }
  });

  return (
    <group ref={group} position={[2.5, 0.2, -0.8]}>
      <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh geometry={strand1Geom} material={strandMat} />
        <mesh geometry={strand2Geom} material={strandMat} />
        {rungData.map((r, i) => {
          const q = new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            r.dir
          );
          return (
            <mesh
              key={i}
              position={r.mid.toArray()}
              quaternion={q}
              scale={[1, r.len, 1]}
              geometry={rungGeom}
              material={baseMat}
            />
          );
        })}
      </Float>
    </group>
  );
}

/* ─── Pulse Rings (heartbeat) ──────────────────────────────────────── */

function PulseRing({ delay }: { delay: number }) {
  const ref = React.useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    const period = 3.3;
    const t = ((state.clock.elapsedTime + delay) % period) / period;
    ref.current.scale.setScalar(0.2 + t * 3.5);
    mat.opacity = Math.max(0, 0.28 * (1 - t));
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <meshBasicMaterial
        color="#2563eb"
        transparent
        opacity={0}
        side={THREE.DoubleSide}
      />
      <ringGeometry args={[0.85, 0.9, 64]} />
    </mesh>
  );
}

function PulseRings() {
  return (
    <group position={[0, 0, -0.5]}>
      {[0, 1, 2].map((i) => (
        <PulseRing key={i} delay={i * 1.1} />
      ))}
    </group>
  );
}

/* ─── Floating Cells ──────────────────────────────────────────────── */

function FloatingCells() {
  const cells = React.useMemo(
    () =>
      [
        [-2.2, 1.8, -1.5],
        [2.8, -1.2, -2],
        [-1.5, -2, -1.8],
        [1.8, 2.2, -2.5],
        [-2.8, 0.3, -3],
        [2.5, 1.0, -1.2],
        [-0.8, 2.5, -2.8],
        [0.5, -2.2, -1.5],
      ].map((p, i) => ({
        position: p as [number, number, number],
        scale: 0.08 + (((i * 7 + 3) % 10) / 10) * 0.12,
        speed: 0.3 + (((i * 13 + 5) % 10) / 10) * 0.5,
      })),
    []
  );

  const cellGeom = React.useMemo(
    () => new THREE.IcosahedronGeometry(1, 3),
    []
  );

  return (
    <>
      {cells.map((c, i) => (
        <Float
          key={i}
          speed={c.speed}
          rotationIntensity={0.8}
          floatIntensity={1.2}
        >
          <mesh position={c.position} scale={c.scale} geometry={cellGeom}>
            <meshPhysicalMaterial
              color="#60a5fa"
              emissive="#3b82f6"
              emissiveIntensity={0.3}
              transparent
              opacity={0.35}
              roughness={0.15}
              metalness={0.1}
              clearcoat={0.8}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

/* ─── Glass Orbs (improved) ──────────────────────────────────────── */

function GlassOrb({
  position,
  color,
  scale = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
}) {
  const mat = React.useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color,
        metalness: 0.05,
        roughness: 0.05,
        transparent: true,
        opacity: 0.28,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        envMapIntensity: 2,
        ior: 1.5,
        thickness: 0.5,
        transmission: 0.4,
      }),
    [color]
  );
  return (
    <Float speed={1.8} rotationIntensity={0.5} floatIntensity={1}>
      <mesh position={position} scale={scale} material={mat}>
        <sphereGeometry args={[0.5, 48, 48]} />
      </mesh>
    </Float>
  );
}

/* ─── Parallax Layer ─────────────────────────────────────────────── */

function ParallaxLayer() {
  const group = React.useRef<THREE.Group>(null);
  const mouse = React.useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    if (!group.current) return;
    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x,
      mouse.current.x * 0.2,
      0.035
    );
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      -mouse.current.y * 0.2,
      0.035
    );
  });

  return (
    <group ref={group}>
      <GlbSpine mouse={mouse} />
      <DnaHelix />
      <PulseRings />
      <GlassOrb
        position={[-2.4, 1.2, -1.2]}
        color="#3b82f6"
        scale={0.85}
      />
      <GlassOrb
        position={[-1.6, -1.8, -2]}
        color="#06b6d4"
        scale={0.65}
      />
      <GlassOrb
        position={[1.8, 1.5, -2.4]}
        color="#818cf8"
        scale={1}
      />
      <FloatingCells />
      <Sparkles
        count={80}
        scale={[10, 7, 6]}
        size={2}
        speed={0.3}
        color="#60a5fa"
      />
      <Sparkles
        count={50}
        scale={[8, 5, 4]}
        size={1.2}
        speed={0.4}
        color="#22d3ee"
      />
      <Sparkles
        count={30}
        scale={[6, 4, 3]}
        size={1.8}
        speed={0.25}
        color="#a78bfa"
      />
    </group>
  );
}

/* ─── Pulsing Point Light ─────────────────────────────────────────── */

function PulsingPointLight() {
  const ref = React.useRef<THREE.PointLight>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.intensity =
      0.9 + Math.sin(state.clock.elapsedTime * 1.8) * 0.3;
  });
  return (
    <pointLight
      ref={ref}
      position={[0, 0, 3.5]}
      intensity={0.9}
      color="#60a5fa"
    />
  );
}

/* ─── Hero Scene (exported) ───────────────────────────────────────── */

export function HeroScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6.5], fov: 45 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      style={{ background: "transparent" }}
      aria-label="3D medical visualization of spine and DNA"
      role="img"
    >
      <hemisphereLight args={["#fff8ef", "#3a2c1a", 0.55]} />
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 7, 4]}
        intensity={1.6}
        color="#fff4e4"
      />
      <directionalLight
        position={[-4, -1, -2]}
        intensity={0.5}
        color="#bfd4ff"
      />
      <directionalLight
        position={[0, 2, -5]}
        intensity={0.4}
        color="#ffffff"
      />
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 0]}>
          <Lightformer
            form="circle"
            intensity={4}
            rotation-x={Math.PI / 2}
            position={[0, 5, -9]}
            scale={2}
          />
          <Lightformer
            form="circle"
            intensity={2}
            rotation-y={Math.PI / 2}
            position={[-5, 1, -1]}
            scale={2}
          />
          <Lightformer
            form="circle"
            intensity={2}
            rotation-y={Math.PI / 2}
            position={[5, 1, -1]}
            scale={2}
          />
          <Lightformer
            form="ring"
            intensity={2}
            rotation-y={Math.PI / 2}
            position={[-5, 1, 5]}
            scale={2}
          />
        </group>
      </Environment>
      <PulsingPointLight />
      <ParallaxLayer />
      <EffectComposer>
        <Bloom
          intensity={0.7}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.9}
          mipmapBlur
          radius={0.65}
        />
        <Vignette offset={0.35} darkness={0.45} />
      </EffectComposer>
    </Canvas>
  );
}
