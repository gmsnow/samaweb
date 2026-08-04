"use client";

import * as React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { RotateCcw, ZoomIn } from "lucide-react";
import {
  SpineScene,
  KneeScene,
  ShoulderScene,
  BrainScene,
  MuscleScene,
} from "./anatomy-scenes";

const PARTS = ["spine", "knee", "shoulder", "brain", "muscle"] as const;
type Part = (typeof PARTS)[number];

function PartIcon({ part }: { part: Part }) {
  const cls = "h-5 w-5";
  switch (part) {
    case "spine":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={cls}>
          <path d="M12 2v20M12 5c-2 0-2 2 0 2s2-2 0-2M12 10c-2 0-2 2 0 2s2-2 0-2M12 15c-2 0-2 2 0 2s2-2 0-2M12 20c-2 0-2 2 0 2s2-2 0-2" />
        </svg>
      );
    case "knee":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={cls}>
          <path d="M12 2v6c0 2-3 2-3 5s3 3 3 5v4M12 8c2.5 0 4 2 4 4M12 18v4" />
        </svg>
      );
    case "shoulder":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={cls}>
          <circle cx="12" cy="9" r="4" />
          <path d="M12 13v8M6 10l-4 3M18 10l4 3M8 12l-2 7M16 12l2 7" />
        </svg>
      );
    case "brain":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={cls}>
          <path d="M9.5 4a2.5 2.5 0 0 0-5 0v10a7.5 7.5 0 0 0 15 0V4a2.5 2.5 0 0 0-5 0M9.5 4v12M14.5 4v12" />
        </svg>
      );
    case "muscle":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={cls}>
          <path d="M6 20c-1-5 1-9 4-12M6 20c4 1 7 0 9-2M10 8l4-3 4 1-2 5-4 3M10 8l-2 6M18 6l-2 5" />
        </svg>
      );
  }
}

function SceneSwitch({ part }: { part: Part }) {
  switch (part) {
    case "spine":
      return <SpineScene />;
    case "knee":
      return <KneeScene />;
    case "shoulder":
      return <ShoulderScene />;
    case "brain":
      return <BrainScene />;
    case "muscle":
      return <MuscleScene />;
  }
}

function ViewerCanvas({ part, resetKey }: { part: Part; resetKey: number }) {
  return (
    <Canvas
      key={resetKey}
      dpr={[1, 1.8]}
      camera={{ position: [0, 0.4, 6.6], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 4]} intensity={1.1} color="#ffffff" />
      <directionalLight position={[-4, -2, -3]} intensity={0.5} color="#06b6d4" />
      <pointLight position={[0, 0, 3]} intensity={1.1} color="#60a5fa" />
      <group key={part}>
        <SceneSwitch part={part} />
      </group>
      <OrbitControls
        enablePan={false}
        minDistance={4}
        maxDistance={9}
        enableDamping
        dampingFactor={0.08}
      />
    </Canvas>
  );
}

export function AnatomyViewer() {
  const t = useTranslations("anatomy");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [part, setPart] = React.useState<Part>("spine");
  const [resetKey, setResetKey] = React.useState(0);

  const description = t(`parts.${part}.description`);

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <div className="glass-strong flex flex-col gap-2 rounded-3xl p-3">
        {PARTS.map((p) => {
          const active = p === part;
          return (
            <button
              key={p}
              type="button"
              onClick={() => setPart(p)}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-start transition-all duration-200 ${
                active
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "text-foreground/70 hover:bg-foreground/5"
              }`}
            >
              <PartIcon part={p} />
              <div className="flex-1">
                <p className="text-sm font-semibold">{t(`parts.${p}.name`)}</p>
                <p
                  className={`text-xs ${active ? "text-white/75" : "text-foreground/50"}`}
                >
                  {t(`parts.${p}.tagline`)}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="glass relative overflow-hidden rounded-3xl">
        <div className="relative h-[420px] w-full sm:h-[520px]">
          <ViewerCanvas part={part} resetKey={resetKey} />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-5 pt-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={part}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
              >
                <h3 className="text-xl font-bold text-white">
                  {t(`parts.${part}.name`)}
                </h3>
                <p className="mt-1 max-w-xl text-sm text-white/70">{description}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div
            className={`absolute top-4 flex gap-2 ${isRtl ? "left-4" : "right-4"}`}
          >
            <button
              type="button"
              aria-label={t("controls.reset")}
              onClick={() => setResetKey((k) => k + 1)}
              className="glass-strong grid h-10 w-10 place-items-center rounded-xl text-white transition-transform hover:scale-105"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          <div className="pointer-events-none absolute bottom-4 end-4 hidden text-xs text-white/50 sm:block">
            <span className="flex items-center gap-1.5">
              <ZoomIn className="h-3.5 w-3.5" />
              {t("controls.drag")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
