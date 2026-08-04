"use client";

import { X } from "lucide-react";

export interface StructureInfo {
  category: string;
  categoryColor: string;
  fullName: string;
  description: string;
}

interface InfoPanelProps {
  info: StructureInfo | null;
  onClose: () => void;
}

export function InfoPanel({ info, onClose }: InfoPanelProps) {
  if (!info) return null;

  return (
    <div className="pointer-events-auto w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-xl">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span
            className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
            style={{ backgroundColor: info.categoryColor }}
          >
            {info.category}
          </span>
          <h3 className="mt-1.5 text-base font-bold text-white">
            {info.fullName}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-white/60">
        {info.description}
      </p>
    </div>
  );
}
