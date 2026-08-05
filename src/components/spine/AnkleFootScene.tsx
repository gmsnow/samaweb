"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Html } from "@react-three/drei";
import type { GLTF } from "three-stdlib";
import * as THREE from "three";
import {
  getAnkleFootInfo,
  ANKLE_FOOT_CATEGORY_COLORS,
  ANKLE_FOOT_STRUCTURES,
} from "./ankle-foot-data";

useGLTF.preload("/ankle-foot.glb");

const ANKLE_MODEL_SCALE = 18;
const ANKLE_CENTER = new THREE.Vector3(-0.0965, 0.0707, 0.0214);
const ANKLE_MODEL_POSITION: [number, number, number] = [
  -ANKLE_CENTER.x * ANKLE_MODEL_SCALE,
  -ANKLE_CENTER.y * ANKLE_MODEL_SCALE,
  -ANKLE_CENTER.z * ANKLE_MODEL_SCALE,
];
export const ANKLE_SHADOW_Y = -1.3;

const TOP_LEVEL_GROUPS = new Set([
  "Bones",
  "Cartilages",
  "Ligaments",
  "Muscles",
  "Fascia",
  "Veins - Superficial",
  "Veins - Deep",
  "Arteries",
  "Nerves",
  "Bursae",
  "Overlays",
]);

const VISIBLE_GROUPS = new Set([
  "Bones",
  "Cartilages",
  "Ligaments",
  "Arteries",
  "Nerves",
]);

const SPINE_BONE_COLOR = "#FFEDB1";

const CATEGORY_LABEL: Record<string, string> = {
  nerves: "Nerves",
  arteries: "Arteries",
  ligaments: "Ligaments",
};

const STRUCTURE_NODE_KEYS: Map<string, string> = new Map();
for (const s of ANKLE_FOOT_STRUCTURES) {
  for (const node of s.nodes) {
    STRUCTURE_NODE_KEYS.set(node, s.id);
  }
}

function findTopLevelGroup(object: THREE.Object3D): string | null {
  let current = object.parent;
  while (current) {
    if (current.name && TOP_LEVEL_GROUPS.has(current.name)) return current.name;
    current = current.parent;
  }
  return null;
}

function averageWorldPosition(meshes: THREE.Mesh[]): THREE.Vector3 {
  const pos = new THREE.Vector3();
  const v = new THREE.Vector3();
  for (const mesh of meshes) {
    mesh.getWorldPosition(v);
    pos.add(v);
  }
  pos.divideScalar(meshes.length);
  return pos;
}

interface MeshState {
  key: string;
  mesh: THREE.Mesh;
  originalEmissive: THREE.Color;
}

interface AnkleFootSceneProps {
  selected: string | null;
  listHovered: string | null;
  onSelect: (key: string | null, worldPos?: THREE.Vector3) => void;
}

export function AnkleFootScene({
  selected,
  listHovered,
  onSelect,
}: AnkleFootSceneProps) {
  const { scene } = useGLTF("/ankle-foot.glb") as GLTF;
  const groupRef = useRef<THREE.Group>(null);
  const structures = useRef<Map<string, MeshState[]>>(new Map());
  const meshToKey = useRef<Map<THREE.Mesh, string>>(new Map());
  const [hovered, setHovered] = useState<string | null>(null);
  const [hoveredPos, setHoveredPos] = useState<THREE.Vector3 | null>(null);
  const [selectedPos, setSelectedPos] = useState<THREE.Vector3 | null>(null);

  useEffect(() => {
    if (!groupRef.current) return;
    structures.current.clear();
    meshToKey.current.clear();

    groupRef.current.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const mesh = child as THREE.Mesh;
      if (Array.isArray(mesh.material)) return;

      const key = STRUCTURE_NODE_KEYS.get(mesh.name);
      if (key) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        const cloned = mat.clone();
        mesh.material = cloned;
        mesh.visible = true;
        meshToKey.current.set(mesh, key);
        const list = structures.current.get(key) ?? [];
        list.push({ key, mesh, originalEmissive: cloned.emissive.clone() });
        structures.current.set(key, list);
        return;
      }

      const group = findTopLevelGroup(mesh);
      if (group && VISIBLE_GROUPS.has(group)) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        const cloned = mat.clone();
        if (group === "Bones") cloned.color.set(SPINE_BONE_COLOR);
        mesh.material = cloned;
        mesh.visible = true;
      } else {
        mesh.visible = false;
      }
    });
  }, [scene]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const highlight = hovered ?? listHovered;

    structures.current.forEach((meshes, key) => {
      const info = getAnkleFootInfo(key);
      const color = info
        ? ANKLE_FOOT_CATEGORY_COLORS[info.category]
        : "#60a5fa";

      for (const st of meshes) {
        const mat = st.mesh.material as THREE.MeshStandardMaterial;
        if (key === selected) {
          const pulse = 0.35 + Math.sin(t * 3) * 0.18;
          mat.emissive.set(color);
          mat.emissiveIntensity = pulse;
        } else if (key === highlight) {
          mat.emissive.set(color);
          mat.emissiveIntensity = 0.28;
        } else {
          mat.emissive.copy(st.originalEmissive);
          mat.emissiveIntensity = 0;
        }
      }
    });
  });

  useEffect(() => {
    if (!selected) return;
    const meshes = structures.current.get(selected);
    if (meshes && meshes.length) {
      setSelectedPos(averageWorldPosition(meshes.map((s) => s.mesh)));
    }
  }, [selected]);

  const findKeyFromEvent = useCallback((e: { object: THREE.Object3D }) => {
    const obj = e.object;
    if (!(obj instanceof THREE.Mesh)) return null;
    return meshToKey.current.get(obj) ?? null;
  }, []);

  const handlePointerOver = useCallback(
    (e: React.PointerEvent<THREE.Group>) => {
      const key = findKeyFromEvent(e as unknown as { object: THREE.Object3D });
      if (key) {
        setHovered(key);
        const meshes = structures.current.get(key);
        if (meshes?.length) {
          setHoveredPos(averageWorldPosition(meshes.map((s) => s.mesh)));
        }
        document.body.style.cursor = "pointer";
      }
    },
    [findKeyFromEvent]
  );

  const handlePointerOut = useCallback(() => {
    setHovered(null);
    setHoveredPos(null);
    document.body.style.cursor = "";
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<THREE.Group>) => {
      const key = findKeyFromEvent(e as unknown as { object: THREE.Object3D });
      if (!key) return;
      const newKey = selected === key ? null : key;
      if (newKey) {
        const meshes = structures.current.get(newKey);
        if (meshes?.length) {
          onSelect(newKey, averageWorldPosition(meshes.map((s) => s.mesh)));
        } else {
          onSelect(newKey);
        }
      } else {
        setSelectedPos(null);
        onSelect(null);
      }
    },
    [selected, onSelect, findKeyFromEvent]
  );

  return (
    <group
      ref={groupRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <group position={ANKLE_MODEL_POSITION} scale={ANKLE_MODEL_SCALE}>
        <primitive object={scene} />
      </group>

      {hovered && hovered !== selected && hoveredPos && (
        <HoverLabel position={hoveredPos} nodeKey={hovered} />
      )}

      {selected && selectedPos && (
        <SelectedLabel
          position={selectedPos}
          nodeKey={selected}
          onClose={() => onSelect(null)}
        />
      )}
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
  const info = getAnkleFootInfo(nodeKey);
  const text = info?.fullName ?? nodeKey;

  return (
    <Html
      position={[position.x, position.y + 0.3, position.z + 0.3]}
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

function SelectedLabel({
  position,
  nodeKey,
  onClose,
}: {
  position: THREE.Vector3;
  nodeKey: string;
  onClose: () => void;
}) {
  const info = getAnkleFootInfo(nodeKey);
  if (!info) return null;

  const category = CATEGORY_LABEL[info.category] ?? info.category;
  const color = ANKLE_FOOT_CATEGORY_COLORS[info.category];

  return (
    <Html
      position={[position.x + 0.35, position.y + 0.12, position.z + 0.35]}
      center
      distanceFactor={6}
      style={{ pointerEvents: "auto" }}
      zIndexRange={[100, 0]}
    >
      <div
        style={{
          minWidth: 200,
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(15,23,42,0.92)",
          backdropFilter: "blur(12px)",
          padding: "12px 14px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          position: "relative",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.45)",
            cursor: "pointer",
            padding: 2,
            lineHeight: 0,
          }}
        >
          ✕
        </button>

        <div
          style={{
            display: "inline-block",
            borderRadius: 999,
            padding: "2px 8px",
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#fff",
            backgroundColor: color,
            marginBottom: 6,
          }}
        >
          {category}
        </div>

        <p
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#fff",
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          {info.fullName}
        </p>
        <p
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.6)",
            margin: "4px 0 0",
            lineHeight: 1.45,
          }}
        >
          {info.description}
        </p>
      </div>
    </Html>
  );
}
