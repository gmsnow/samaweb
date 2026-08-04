"use client";

import { useMemo } from "react";
import { Search, X } from "lucide-react";
import { VERTEBRAE, REGION_COLORS } from "./vertebrae";
import type { VertebraInfo } from "./vertebrae";

const REGION_ORDER: VertebraInfo["region"][] = [
  "Cervical",
  "Thoracic",
  "Lumbar",
  "Sacrum",
];

interface StructureListProps {
  query: string;
  onQueryChange: (q: string) => void;
  selected: string | null;
  hovered: string | null;
  onSelect: (key: string | null) => void;
  onHover: (key: string | null) => void;
  t: (key: string) => string;
}

export function StructureList({
  query,
  onQueryChange,
  selected,
  hovered,
  onSelect,
  onHover,
  t,
}: StructureListProps) {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return VERTEBRAE;
    return VERTEBRAE.filter(
      (v) =>
        v.label.toLowerCase().includes(q) ||
        v.fullName.toLowerCase().includes(q) ||
        v.region.toLowerCase().includes(q)
    );
  }, [query]);

  const groups = useMemo(
    () =>
      REGION_ORDER.map((region) => ({
        region,
        items: filtered.filter((v) => v.region === region),
      })).filter((g) => g.items.length > 0),
    [filtered]
  );

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/85 shadow-2xl backdrop-blur-xl">
      <div className="border-b border-white/5 p-3">
        <div className="relative">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2 ps-9 pe-8 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-primary/50 focus:bg-white/10"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              className="absolute end-2 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-white/40 transition-colors hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <p className="mt-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-white/35">
          {t("structures")} · {filtered.length}
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
        {groups.length === 0 && (
          <p className="px-1 py-6 text-center text-sm text-white/40">
            {t("noResults")}
          </p>
        )}
        {groups.map((g) => (
          <div key={g.region}>
            <div className="mb-1 flex items-center gap-1.5 px-1">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: REGION_COLORS[g.region] }}
              />
              <span className="text-xs font-semibold text-white/70">
                {t(`regions.${g.region.toLowerCase()}`)}
              </span>
            </div>
            <div className="space-y-0.5">
              {g.items.map((v) => {
                const active = selected === v.nodePrefix;
                const isHovered = hovered === v.nodePrefix;
                return (
                  <button
                    key={v.nodePrefix}
                    type="button"
                    onClick={() => onSelect(active ? null : v.nodePrefix)}
                    onMouseEnter={() => onHover(v.nodePrefix)}
                    onMouseLeave={() => onHover(null)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-start text-sm transition-colors ${
                      active
                        ? "bg-primary/20 text-white ring-1 ring-primary/50"
                        : isHovered
                          ? "bg-white/10 text-white"
                          : "text-white/60 hover:bg-white/5 hover:text-white/80"
                    }`}
                  >
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: v.regionColor }}
                    />
                    <span className="w-8 shrink-0 font-bold">{v.label}</span>
                    <span className="truncate text-xs text-white/45">
                      {v.fullName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
