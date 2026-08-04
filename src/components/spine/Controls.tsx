"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";

interface ControlsProps {
  selected: string | null;
}

const DEFAULT_TARGET = new THREE.Vector3(0, 0.3, 0);

export function Controls({ selected }: ControlsProps) {
  const ref = useRef<OrbitControlsImpl>(null);
  const { scene } = useThree();
  const targetPos = useRef(DEFAULT_TARGET.clone());

  useEffect(() => {
    if (selected) {
      const mesh = scene.getObjectByName(`${selected}_beige_0`) as
        | THREE.Mesh
        | undefined;
      if (mesh) {
        const wp = new THREE.Vector3();
        mesh.getWorldPosition(wp);
        targetPos.current.copy(wp);
      }
    } else {
      targetPos.current.copy(DEFAULT_TARGET);
    }
  }, [selected, scene]);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.target.lerp(targetPos.current, 0.045);
    ref.current.update();
  });

  return (
    <OrbitControls
      ref={ref}
      enablePan={false}
      enableDamping
      dampingFactor={0.06}
      minDistance={2}
      maxDistance={8}
      minPolarAngle={Math.PI * 0.15}
      maxPolarAngle={Math.PI * 0.85}
      autoRotate={!selected}
      autoRotateSpeed={0.4}
    />
  );
}
