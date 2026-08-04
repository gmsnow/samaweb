"use client";

import { useMemo } from "react";
import { Search, X } from "lucide-react";

export interface StructureListItem {
  key: string;
  label: string;
  fullName: string;
  category: string;
  color: string;
}

interface StructureListProps {
  items: StructureListItem[];
  categories: { key: string; label: string }[];
  query: string;
  onQueryChange: (q: string) => void;
  selected: string | null;
  hovered: string | null;
  onSelect: (key: string | null) => void;
  onHover: (key: string | null) => void;
  searchPlaceholder: string;
  structuresLabel: string;
  noResultsLabel: string;
}

export function StructureList({
  items,
  categories,
  query,
  onQueryChange,
  selected,
  hovered,
  onSelect,
  onHover,
  searchPlaceholder,
  structuresLabel,
  noResultsLabel,
}: StructureListProps) {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (it) =>
        it.label.toLowerCase().includes(q) ||
        it.fullName.toLowerCase().includes(q) ||
        it.category.toLowerCase().includes(q)
    );
  }, [query, items]);

  const categoryLabel = useMemo(
    () => new Map(categories.map((c) => [c.key, c.label])),
    [categories]
  );

  const groups = useMemo(
    () =>
      categories
        .map((c) => ({
          category: c,
          items: filtered.filter((it) => it.category === c.key),
        }))
        .filter((g) => g.items.length > 0),
    [categories, filtered]
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
            placeholder={searchPlaceholder}
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
          {structuresLabel} · {filtered.length}
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
        {groups.length === 0 && (
          <p className="px-1 py-6 text-center text-sm text-white/40">
            {noResultsLabel}
          </p>
        )}
        {groups.map((g) => (
          <div key={g.category.key}>
            <div className="mb-1 flex items-center gap-1.5 px-1">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: g.items[0].color }}
              />
              <span className="text-xs font-semibold text-white/70">
                {categoryLabel.get(g.category.key) ?? g.category.key}
              </span>
            </div>
            <div className="space-y-0.5">
              {g.items.map((v) => {
                const active = selected === v.key;
                const isHovered = hovered === v.key;
                return (
                  <button
                    key={v.key}
                    type="button"
                    onClick={() => onSelect(active ? null : v.key)}
                    onMouseEnter={() => onHover(v.key)}
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
                      style={{ backgroundColor: v.color }}
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
