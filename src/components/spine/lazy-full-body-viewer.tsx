"use client";

import dynamic from "next/dynamic";

export const LazyFullBodyViewer = dynamic(
  () =>
    import("@/components/spine/FullBodyViewer").then((m) => m.FullBodyViewer),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-[500px] place-items-center rounded-3xl border border-white/10 bg-slate-900/60 sm:h-[600px]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-sky-400" />
      </div>
    ),
  }
);
