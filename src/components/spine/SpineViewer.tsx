"use client";

import { useState, Suspense, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { SpineModel } from "./SpineModel";
import { Lights } from "./Lights";
import { Controls } from "./Controls";
import { VERTEBRAE, REGION_COLORS } from "./vertebrae";

function LoadingFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-sky-400" />
        <p className="text-sm text-white/50">Loading 3D model…</p>
      </div>
    </div>
  );
}

interface RegionLegendProps {
  selected: string | null;
  onSelect: (key: string | null) => void;
}

function RegionLegend({ selected, onSelect }: RegionLegendProps) {
  const regions = [
    { name: "Cervical", range: "C1–C7", color: REGION_COLORS.Cervical },
    { name: "Thoracic", range: "T1–T12", color: REGION_COLORS.Thoracic },
    { name: "Lumbar", range: "L1–L5", color: REGION_COLORS.Lumbar },
    { name: "Sacrum", range: "S", color: REGION_COLORS.Sacrum },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {regions.map((r) => {
        const isActive =
          selected != null &&
          VERTEBRAE.find((v) => v.nodePrefix === selected)?.region === r.name;
        return (
          <button
            key={r.name}
            type="button"
            onClick={() => {
              if (isActive) {
                onSelect(null);
              } else {
                const vertebra = VERTEBRAE.find((v) => v.region === r.name);
                if (vertebra) onSelect(vertebra.nodePrefix);
              }
            }}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
              isActive
                ? "bg-white/15 text-white shadow-lg"
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80"
            }`}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: r.color }}
            />
            {r.name}
            <span className="text-white/40">{r.range}</span>
          </button>
        );
      })}
    </div>
  );
}

export function SpineViewer() {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = useCallback(
    (key: string | null) => {
      setSelected(key);
    },
    []
  );

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/90 backdrop-blur-sm">
      <div className="relative h-[520px] w-full sm:h-[680px] lg:h-[800px]">
        <Suspense fallback={<LoadingFallback />}>
          <Canvas
            dpr={[1, 2]}
            camera={{ position: [2.4, 0.1, 3.6], fov: 45 }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.15,
            }}
            style={{ background: "transparent" }}
          >
            <Lights />
            <SpineModel selected={selected} onSelect={handleSelect} />
            <Controls selected={selected} />
            <ContactShadows
              position={[0, -1.55, 0]}
              opacity={0.35}
              scale={10}
              blur={2.5}
              far={4}
              color="#0f172a"
            />
            <EffectComposer>
              <Bloom
                intensity={0.5}
                luminanceThreshold={0.2}
                luminanceSmoothing={0.9}
                mipmapBlur
                radius={0.6}
              />
              <Vignette offset={0.3} darkness={0.4} />
            </EffectComposer>
          </Canvas>
        </Suspense>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-5 pt-20">
          <p className="text-xs text-white/40">
            Click a vertebra to focus · Scroll to zoom · Drag to rotate
          </p>
        </div>
      </div>

      <div className="border-t border-white/5 px-5 py-3">
        <RegionLegend selected={selected} onSelect={setSelected} />
      </div>
    </div>
  );
}
