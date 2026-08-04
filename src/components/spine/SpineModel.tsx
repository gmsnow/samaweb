"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Html } from "@react-three/drei";
import type { GLTF } from "three-stdlib";
import * as THREE from "three";
import { getVertebraInfo } from "./vertebrae";
import { Labels } from "./Labels";

useGLTF.preload("/spine.glb");

const SUFFIX_RE = /_beige_0$/i;

function isVertebraName(name: string): boolean {
  return SUFFIX_RE.test(name);
}

function nodeToKey(name: string): string {
  return name.replace(SUFFIX_RE, "").toLowerCase();
}

interface SpineModelProps {
  selected: string | null;
  onSelect: (key: string | null, worldPos?: THREE.Vector3) => void;
}

interface VertebraState {
  key: string;
  mesh: THREE.Mesh;
  originalEmissive: THREE.Color;
}

export function SpineModel({ selected, onSelect }: SpineModelProps) {
  const { scene } = useGLTF("/spine.glb") as GLTF;
  const groupRef = useRef<THREE.Group>(null);
  const vertebrae = useRef<Map<string, VertebraState>>(new Map());
  const [hovered, setHovered] = useState<string | null>(null);
  const [hoveredPos, setHoveredPos] = useState<THREE.Vector3 | null>(null);
  const [selectedPos, setSelectedPos] = useState<THREE.Vector3 | null>(null);

  useEffect(() => {
    if (!groupRef.current) return;
    vertebrae.current.clear();

    groupRef.current.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      if (!isVertebraName(child.name)) return;

      const mesh = child as THREE.Mesh;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      const cloned = mat.clone();
      mesh.material = cloned;

      vertebrae.current.set(nodeToKey(mesh.name), {
        key: nodeToKey(mesh.name),
        mesh,
        originalEmissive: cloned.emissive.clone(),
      });
    });
  }, [scene]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    vertebrae.current.forEach((vr) => {
      const mat = vr.mesh.material as THREE.MeshStandardMaterial;

      if (vr.key === selected) {
        const info = getVertebraInfo(vr.key);
        const pulse = 0.35 + Math.sin(t * 3) * 0.18;
        mat.emissive.set(info?.regionColor ?? "#60a5fa");
        mat.emissiveIntensity = pulse;
      } else if (vr.key === hovered) {
        mat.emissive.set("#60a5fa");
        mat.emissiveIntensity = 0.28;
      } else {
        mat.emissive.copy(vr.originalEmissive);
        mat.emissiveIntensity = 0;
      }
    });
  });

  useEffect(() => {
    if (!selected) return;
    const vr = vertebrae.current.get(selected);
    if (vr) {
      const pos = new THREE.Vector3();
      vr.mesh.getWorldPosition(pos);
      setSelectedPos(pos);
    }
  }, [selected]);

  const findVertebra = useCallback(
    (e: { object: THREE.Object3D }): VertebraState | undefined => {
      const obj = e.object;
      if (!(obj instanceof THREE.Mesh) || !isVertebraName(obj.name))
        return undefined;
      return vertebrae.current.get(nodeToKey(obj.name));
    },
    []
  );

  const handlePointerOver = useCallback(
    (e: React.PointerEvent<THREE.Group>) => {
      const vr = findVertebra(
        e as unknown as { object: THREE.Object3D }
      );
      if (vr) {
        setHovered(vr.key);
        const pos = new THREE.Vector3();
        vr.mesh.getWorldPosition(pos);
        setHoveredPos(pos);
        document.body.style.cursor = "pointer";
      }
    },
    [findVertebra]
  );

  const handlePointerOut = useCallback(() => {
    setHovered(null);
    setHoveredPos(null);
    document.body.style.cursor = "";
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<THREE.Group>) => {
      const vr = findVertebra(
        e as unknown as { object: THREE.Object3D }
      );
      if (!vr) return;
      const newKey = selected === vr.key ? null : vr.key;
      if (newKey) {
        const worldPos = new THREE.Vector3();
        vr.mesh.getWorldPosition(worldPos);
        onSelect(newKey, worldPos);
      } else {
        setSelectedPos(null);
        onSelect(null);
      }
    },
    [selected, onSelect, findVertebra]
  );

  return (
    <group
      ref={groupRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <primitive object={scene} />

      {hovered && hovered !== selected && hoveredPos && (
        <HoverLabel position={hoveredPos} nodeKey={hovered} />
      )}

      <Labels
        selected={selected}
        selectedPosition={selectedPos}
        onClose={() => onSelect(null)}
      />
    </group>
  );
}

function HoverLabel({
  position,
  nodeKey,
}: {
  position: THREE.Vector3;
  nodeKey: string;
}) {
  const info = getVertebraInfo(nodeKey);
  const text = info?.label ?? nodeKey;

  return (
    <Html
      position={[position.x, position.y + 0.15, position.z + 0.2]}
      center
      distanceFactor={6}
      style={{ pointerEvents: "none" }}
    >
      <div
        style={{
          background: "rgba(15,23,42,0.88)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 8,
          padding: "3px 10px",
          fontSize: 12,
          fontWeight: 600,
          color: "#fff",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </Html>
  );
}
