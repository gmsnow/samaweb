"use client";

import {
  useState,
  useRef,
  useEffect,
  Suspense,
  useCallback,
  useMemo,
} from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useTranslations } from "next-intl";
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react";
import * as THREE from "three";
import { Lights } from "./Lights";
import {
  AnkleFootScene,
  ANKLE_SHADOW_Y,
  type AnkleFootSceneApi,
} from "./AnkleFootScene";
import { AnkleFootControls } from "./AnkleFootControls";
import { StructureList, type StructureListItem } from "./StructureList";
import { InfoPanel, type StructureInfo } from "./InfoPanel";
import { ToolButton } from "./tool-button";
import {
  ANKLE_FOOT_STRUCTURES,
  ANKLE_FOOT_BONES,
  ANKLE_FOOT_CATEGORY_COLORS,
  ANKLE_FOOT_CATEGORY_ORDER,
  getAnkleFootInfo,
} from "./ankle-foot-data";

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

export function AnkleFootModel() {
  const t = useTranslations("anatomy.ankleFoot");
  const containerRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [focusPos, setFocusPos] = useState<THREE.Vector3 | null>(null);
  const [listHovered, setListHovered] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [panelOpen, setPanelOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const sceneApi = useRef<AnkleFootSceneApi | null>(null);

  useEffect(() => {
    const onFullscreenChange = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const handleSelect = useCallback(
    (key: string | null, worldPos?: THREE.Vector3) => {
      setSelected(key);
      if (!key) {
        setFocusPos(null);
        return;
      }
      if (worldPos) {
        setFocusPos(worldPos.clone());
        return;
      }
      const pos = sceneApi.current?.getWorldPosition(key);
      setFocusPos(pos ? pos.clone() : null);
    },
    []
  );

  const handleReset = useCallback(() => {
    setSelected(null);
    setFocusPos(null);
    setResetSignal((n) => n + 1);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current?.requestFullscreen();
    }
  }, []);

  const items = useMemo<StructureListItem[]>(
    () =>
      [...ANKLE_FOOT_BONES, ...ANKLE_FOOT_STRUCTURES].map((s) => {
        const label =
          "label" in s
            ? s.label
            : s.fullName
                .replace(/,.*$/, "")
                .split(/\s+/)
                .map((w) => w.charAt(0).toUpperCase())
                .join("");
        return {
          key: s.id,
          label,
          fullName: s.fullName,
          category: s.category,
          color: ANKLE_FOOT_CATEGORY_COLORS[s.category],
        };
      }),
    []
  );

  const categories = useMemo(
    () =>
      ANKLE_FOOT_CATEGORY_ORDER.map((c) => ({
        key: c,
        label: t(`categories.${c}`),
      })),
    [t]
  );

  const info = useMemo<StructureInfo | null>(() => {
    if (!selected) return null;
    const s = getAnkleFootInfo(selected);
    if (!s) return null;
    return {
      category: t(`categories.${s.category}`),
      categoryColor: ANKLE_FOOT_CATEGORY_COLORS[s.category],
      fullName: s.fullName,
      description: s.description,
    };
  }, [selected, t]);

  return (
    <div
      ref={containerRef}
      className="relative h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/90 backdrop-blur-sm [&:fullscreen]:h-screen [&:fullscreen]:w-screen [&:fullscreen]:rounded-none [&:fullscreen]:border-0 sm:h-[680px] lg:h-[800px]"
    >
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
          <AnkleFootScene
            selected={selected}
            listHovered={listHovered}
            onSelect={handleSelect}
            apiRef={sceneApi}
          />
          <AnkleFootControls focusPos={focusPos} resetSignal={resetSignal} />
          <ContactShadows
            position={[0, ANKLE_SHADOW_Y, 0]}
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

      {panelOpen && (
        <div className="absolute inset-y-3 start-3 z-10 flex w-60 sm:start-4 sm:w-72">
          <StructureList
            items={items}
            categories={categories}
            query={query}
            onQueryChange={setQuery}
            selected={selected}
            hovered={listHovered}
            onSelect={handleSelect}
            onHover={setListHovered}
            searchPlaceholder={t("searchPlaceholder")}
            structuresLabel={t("structures")}
            noResultsLabel={t("noResults")}
          />
        </div>
      )}

      <div className="absolute bottom-4 end-3 z-10 sm:end-4">
        <InfoPanel info={info} onClose={() => handleSelect(null)} />
      </div>

      <div className="absolute end-3 top-3 z-10 flex flex-col gap-2 sm:end-4 sm:top-4">
        <ToolButton
          title={t("togglePanel")}
          onClick={() => setPanelOpen((o) => !o)}
        >
          {panelOpen ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
        </ToolButton>
        <ToolButton title={t("reset")} onClick={handleReset}>
          <RotateCcw className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          title={isFullscreen ? t("exitFullscreen") : t("fullscreen")}
          onClick={toggleFullscreen}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </ToolButton>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-4 pt-16">
        <p className="text-center text-xs text-white/40">{t("attribution")}</p>
        <p className="mt-1 text-center text-xs text-white/60">{t("hint")}</p>
      </div>
    </div>
  );
}
