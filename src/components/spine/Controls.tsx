"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";

interface ControlsProps {
  selected: string | null;
  resetSignal: number;
}

const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);
const DEFAULT_CAMERA_POS = new THREE.Vector3(2.4, 0.1, 3.6);

export function Controls({ selected, resetSignal }: ControlsProps) {
  const ref = useRef<OrbitControlsImpl>(null);
  const { scene, camera } = useThree();
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

  useEffect(() => {
    if (resetSignal === 0) return;
    targetPos.current.copy(DEFAULT_TARGET);
    camera.position.copy(DEFAULT_CAMERA_POS);
    ref.current?.update();
  }, [resetSignal, camera]);

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
