"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useTranslations } from "next-intl";
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react";
import { StructureList, type StructureListItem } from "./StructureList";
import { InfoPanel, type StructureInfo } from "./InfoPanel";
import { ToolButton } from "./tool-button";
import {
  ANKLE_FOOT_STRUCTURES,
  ANKLE_FOOT_CATEGORY_COLORS,
  ANKLE_FOOT_CATEGORY_ORDER,
  getAnkleFootInfo,
} from "./ankle-foot-data";

const BIO_DIGITAL_WIDGET_URL =
  "https://human.biodigital.com/widget/?be=2bsT&background.colors=0.008,0.024,0.09,1,0.008,0.024,0.09,1&initial.hand-hint=false&ui-info=false&ui-search=false&ui-filter=false&ui-tools=false&ui-center=false&ui-dissect=false&ui-zoom=false&ui-fullscreen=false&ui-help=false";

export function AnkleFootModel() {
  const t = useTranslations("anatomy.ankleFoot");
  const containerRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [listHovered, setListHovered] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [panelOpen, setPanelOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const onFullscreenChange = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const handleSelect = useCallback((key: string | null) => {
    setSelected(key);
  }, []);

  const handleReload = useCallback(() => {
    setSelected(null);
    setQuery("");
    setReloadKey((k) => k + 1);
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
      ANKLE_FOOT_STRUCTURES.map((s) => ({
        key: s.id,
        label: s.label,
        fullName: s.fullName,
        category: s.category,
        color: ANKLE_FOOT_CATEGORY_COLORS[s.category],
      })),
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
      className="relative h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-950 [&:fullscreen]:h-screen [&:fullscreen]:w-screen [&:fullscreen]:rounded-none [&:fullscreen]:border-0 sm:h-[680px] lg:h-[800px]"
    >
      <iframe
        key={reloadKey}
        src={BIO_DIGITAL_WIDGET_URL}
        title="Nerves, Arteries, and Ligaments of the Ankle and Foot"
        loading="lazy"
        className="h-full w-full border-0"
      />

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
        <ToolButton title={t("reset")} onClick={handleReload}>
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
        <p className="text-center text-xs text-white/40">{t("hint")}</p>
      </div>
    </div>
  );
}
