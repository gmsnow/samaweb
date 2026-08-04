"use client";

import { Html } from "@react-three/drei";
import { getVertebraInfo } from "./vertebrae";
import type * as THREE from "three";

interface LabelsProps {
  selected: string | null;
  selectedPosition: THREE.Vector3 | null;
  onClose: () => void;
}

export function Labels({ selected, selectedPosition, onClose }: LabelsProps) {
  if (!selected || !selectedPosition) return null;

  const info = getVertebraInfo(selected);
  if (!info) return null;

  return (
    <Html
      position={[
        selectedPosition.x + 0.35,
        selectedPosition.y + 0.12,
        selectedPosition.z + 0.35,
      ]}
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
            backgroundColor: info.regionColor,
            marginBottom: 6,
          }}
        >
          {info.region}
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
