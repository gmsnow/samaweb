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
  BodyModel,
  type BodyStructure,
  type BodyModelApi,
} from "./BodyModel";
import { BodyControls } from "./BodyControls";
import { StructureList, type StructureListItem } from "./StructureList";
import { InfoPanel, type StructureInfo } from "./InfoPanel";
import { ToolButton } from "./tool-button";
import {
  BODY_CATEGORY_COLORS,
  BODY_CATEGORY_ORDER,
  BODY_REGION_KEYS,
  type BodyCategory,
  type BodyRegion,
} from "./body-regions";

const BODY_SHADOW_Y = -1.5;

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

function initials(name: string): string {
  const clean = name.replace(/,.*$/, "").trim();
  return clean
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase())
    .slice(0, 3)
    .join("");
}

export function FullBodyViewer() {
  const t = useTranslations("anatomy.fullBody");
  const containerRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [focusPos, setFocusPos] = useState<THREE.Vector3 | null>(null);
  const [listHovered, setListHovered] = useState<string | null>(null);
  const [structures, setStructures] = useState<BodyStructure[]>([]);
  const [visibleCategories, setVisibleCategories] = useState<Set<BodyCategory>>(
    () => new Set(BODY_CATEGORY_ORDER)
  );
  const [activeRegion, setActiveRegion] = useState<BodyRegion | null>(null);
  const [query, setQuery] = useState("");
  const [panelOpen, setPanelOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const sceneApi = useRef<BodyModelApi | null>(null);

  useEffect(() => {
    const onFullscreenChange = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const handleStructures = useCallback((list: BodyStructure[]) => {
    setStructures(list);
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

  const deselectIfHidden = useCallback(
    (cats: Set<BodyCategory>, region: BodyRegion | null) => {
      if (!selected) return;
      const s = structures.find((st) => st.id === selected);
      if (!s) return;
      if (!cats.has(s.category) || (region !== null && s.region !== region)) {
        setSelected(null);
        setFocusPos(null);
      }
    },
    [selected, structures]
  );

  const toggleCategory = useCallback(
    (category: BodyCategory) => {
      const next = new Set(visibleCategories);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      setVisibleCategories(next);
      deselectIfHidden(next, activeRegion);
    },
    [visibleCategories, activeRegion, deselectIfHidden]
  );

  const showAllCategories = useCallback(() => {
    const next = new Set(BODY_CATEGORY_ORDER);
    setVisibleCategories(next);
    deselectIfHidden(next, activeRegion);
  }, [activeRegion, deselectIfHidden]);

  const selectRegion = useCallback(
    (region: BodyRegion | null) => {
      const next = activeRegion === region ? null : region;
      setActiveRegion(next);
      deselectIfHidden(visibleCategories, next);
    },
    [activeRegion, visibleCategories, deselectIfHidden]
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

  const filteredStructures = useMemo(
    () =>
      structures.filter(
        (s) =>
          visibleCategories.has(s.category) &&
          (activeRegion === null || s.region === activeRegion)
      ),
    [structures, visibleCategories, activeRegion]
  );

  const items = useMemo<StructureListItem[]>(
    () =>
      filteredStructures.map((s) => ({
        key: s.id,
        label: initials(s.name),
        fullName: s.name,
        category: s.category,
        color: BODY_CATEGORY_COLORS[s.category],
      })),
    [filteredStructures]
  );

  const categories = useMemo(
    () =>
      BODY_CATEGORY_ORDER.filter((c) => visibleCategories.has(c)).map((c) => ({
        key: c,
        label: t(`categories.${c}`),
      })),
    [visibleCategories, t]
  );

  const info = useMemo<StructureInfo | null>(() => {
    if (!selected) return null;
    const s = filteredStructures.find((st) => st.id === selected);
    if (!s) return null;
    return {
      category: t(`categories.${s.category}`),
      categoryColor: BODY_CATEGORY_COLORS[s.category],
      fullName: s.name,
      description: s.description || t("noDescription"),
    };
  }, [selected, filteredStructures, t]);

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
          <BodyModel
            selected={selected}
            listHovered={listHovered}
            onSelect={handleSelect}
            onStructures={handleStructures}
            visibleCategories={visibleCategories}
            activeRegion={activeRegion}
            apiRef={sceneApi}
          />
          <BodyControls focusPos={focusPos} resetSignal={resetSignal} />
          <ContactShadows
            position={[0, BODY_SHADOW_Y, 0]}
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

      <div className="pointer-events-none absolute inset-x-0 top-3 z-10 flex flex-col items-center gap-1.5 px-16 sm:top-4">
        <div className="pointer-events-auto flex max-w-full flex-wrap justify-center gap-1.5">
          <FilterChip
            active={visibleCategories.size === BODY_CATEGORY_ORDER.length}
            onClick={showAllCategories}
          >
            {t("allCategories")}
          </FilterChip>
          {BODY_CATEGORY_ORDER.map((c) => {
            const active = visibleCategories.has(c);
            return (
              <FilterChip key={c} active={active} onClick={() => toggleCategory(c)}>
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: BODY_CATEGORY_COLORS[c],
                    opacity: active ? 1 : 0.4,
                  }}
                />
                {t(`categories.${c}`)}
              </FilterChip>
            );
          })}
        </div>
        <div className="pointer-events-auto flex max-w-full flex-wrap justify-center gap-1.5">
          <FilterChip active={activeRegion === null} onClick={() => selectRegion(null)}>
            {t("regions.all")}
          </FilterChip>
          {BODY_REGION_KEYS.map((r) => (
            <FilterChip
              key={r}
              active={activeRegion === r}
              onClick={() => selectRegion(r)}
            >
              {t(`regions.${r}`)}
            </FilterChip>
          ))}
        </div>
      </div>

      {panelOpen && (
        <div className="absolute inset-y-16 start-3 z-10 flex w-60 sm:start-4 sm:w-72">
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

      <div className="absolute end-3 top-16 z-10 flex flex-col gap-2 sm:end-4 sm:top-[4.5rem]">
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
        <p className="text-center text-xs text-white/60">{t("hint")}</p>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-lg backdrop-blur-xl transition-colors ${
        active
          ? "border-primary/50 bg-primary/20 text-white"
          : "border-white/10 bg-slate-900/80 text-white/55 hover:bg-white/10 hover:text-white/90"
      }`}
    >
      {children}
    </button>
  );
}
