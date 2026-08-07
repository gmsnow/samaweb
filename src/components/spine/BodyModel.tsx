"use client";

import { useRef, useState, useEffect, useLayoutEffect, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Html } from "@react-three/drei";
import type { GLTF } from "three-stdlib";
import * as THREE from "three";
import {
  BODY_CATEGORY_COLORS,
  categoryForType,
  regionForStructure,
  type BodyCategory,
  type BodyRegion,
} from "./body-regions";

useGLTF.preload("/body.glb", "/draco/");

export interface BodyStructure {
  id: string;
  name: string;
  description: string;
  wikiLink?: string;
  category: BodyCategory;
  region: BodyRegion | "other";
}

export interface BodyModelApi {
  getWorldPosition: (key: string) => THREE.Vector3 | null;
}

interface BodyModelProps {
  selected: string | null;
  listHovered: string | null;
  onSelect: (key: string | null, worldPos?: THREE.Vector3) => void;
  onStructures: (structures: BodyStructure[]) => void;
  visibleCategories: Set<BodyCategory>;
  activeRegion: BodyRegion | null;
  apiRef?: React.MutableRefObject<BodyModelApi | null>;
}

const TARGET_HEIGHT = 3;

interface MeshState {
  key: string;
  mesh: THREE.Mesh;
  category: BodyCategory;
  region: BodyRegion | "other";
  originalEmissive: THREE.Color;
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

export function BodyModel({
  selected,
  listHovered,
  onSelect,
  onStructures,
  visibleCategories,
  activeRegion,
  apiRef,
}: BodyModelProps) {
  const { scene } = useGLTF("/body.glb", "/draco/") as GLTF;
  const groupRef = useRef<THREE.Group>(null);
  const transformRef = useRef<THREE.Group>(null);
  const selectables = useRef<Map<string, MeshState[]>>(new Map());
  const meshToKey = useRef<Map<THREE.Mesh, string>>(new Map());
  const [hovered, setHovered] = useState<string | null>(null);
  const [hoveredPos, setHoveredPos] = useState<THREE.Vector3 | null>(null);
  const [selectedPos, setSelectedPos] = useState<THREE.Vector3 | null>(null);

  useLayoutEffect(() => {
    if (!scene) return;
    selectables.current.clear();
    meshToKey.current.clear();

    const structureInfo = new Map<
      string,
      {
        name: string;
        description: string;
        wikiLink?: string;
        category: BodyCategory;
        region: BodyRegion | "other";
      }
    >();

    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const mesh = child as THREE.Mesh;
      if (Array.isArray(mesh.material)) return;

      const ud = (mesh.userData ?? {}) as {
        type?: string;
        name?: string;
        description?: string;
        wikiLink?: string;
      };

      const name = (ud.name || mesh.name).trim() || mesh.name;
      const category = categoryForType(ud.type);
      const region = regionForStructure(name);

      mesh.visible = true;

      const mat = mesh.material as THREE.MeshStandardMaterial;
      const cloned = mat.clone();
      cloned.color.set(BODY_CATEGORY_COLORS[category]);
      mesh.material = cloned;

      meshToKey.current.set(mesh, name);
      const list = selectables.current.get(name) ?? [];
      list.push({
        key: name,
        mesh,
        category,
        region,
        originalEmissive: cloned.emissive.clone(),
      });
      selectables.current.set(name, list);

      if (!structureInfo.has(name)) {
        structureInfo.set(name, {
          name,
          description: ud.description ?? "",
          wikiLink: ud.wikiLink,
          category,
          region,
        });
      }
    });

    const structures: BodyStructure[] = Array.from(structureInfo.entries())
      .map(([id, v]) => ({ id, ...v }))
      .sort((a, b) => a.name.localeCompare(b.name));
    onStructures(structures);

    const transform = transformRef.current;
    if (transform) {
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const scale = TARGET_HEIGHT / maxDim;
      transform.position.set(
        -center.x * scale,
        -center.y * scale,
        -center.z * scale
      );
      transform.scale.setScalar(scale);
    }

    if (apiRef) {
      apiRef.current = {
        getWorldPosition: (key: string) => {
          const meshes = selectables.current.get(key);
          if (!meshes || meshes.length === 0) return null;
          return averageWorldPosition(meshes.map((s) => s.mesh));
        },
      };
    }
    return () => {
      if (apiRef) apiRef.current = null;
    };
  }, [scene, apiRef, onStructures]);

  useEffect(() => {
    selectables.current.forEach((meshes) => {
      const st = meshes[0];
      const included =
        visibleCategories.has(st.category) &&
        (activeRegion === null || st.region === activeRegion);
      for (const m of meshes) m.mesh.visible = included;
    });
  }, [visibleCategories, activeRegion]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const highlight = hovered ?? listHovered;

    selectables.current.forEach((meshes, key) => {
      const st0 = meshes[0];
      const color = BODY_CATEGORY_COLORS[st0.category];
      for (const st of meshes) {
        if (!st.mesh.visible) continue;
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
    const meshes = selectables.current.get(selected);
    if (meshes && meshes.length) {
      setSelectedPos(averageWorldPosition(meshes.map((s) => s.mesh)));
    }
  }, [selected]);

  const isVisibleKey = useCallback((key: string) => {
    const meshes = selectables.current.get(key);
    return !!meshes && meshes.some((s) => s.mesh.visible);
  }, []);

  const findKeyFromEvent = useCallback(
    (e: {
      object: THREE.Object3D;
      intersections?: Array<{ object: THREE.Object3D }>;
    }) => {
      const hits =
        e.intersections && e.intersections.length > 0
          ? e.intersections
          : [{ object: e.object }];
      for (const hit of hits) {
        if (!(hit.object instanceof THREE.Mesh)) continue;
        const key = meshToKey.current.get(hit.object as THREE.Mesh);
        if (key && isVisibleKey(key)) return key;
      }
      return null;
    },
    [isVisibleKey]
  );

  const handlePointerOver = useCallback(
    (e: React.PointerEvent<THREE.Group>) => {
      const key = findKeyFromEvent(e as unknown as { object: THREE.Object3D });
      if (key) {
        setHovered(key);
        const meshes = selectables.current.get(key);
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
        const meshes = selectables.current.get(newKey);
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
      <group ref={transformRef}>
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
          maxWidth: 280,
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {nodeKey}
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
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(15,23,42,0.92)",
          backdropFilter: "blur(12px)",
          padding: "10px 14px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          position: "relative",
          minWidth: 180,
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
        <p
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#fff",
            margin: 0,
            lineHeight: 1.3,
            paddingInlineEnd: 20,
          }}
        >
          {nodeKey}
        </p>
      </div>
    </Html>
  );
}
