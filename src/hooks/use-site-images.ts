"use client";

import * as React from "react";

let cache: Record<string, string> = {};
let inflight: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

async function loadOverrides(): Promise<void> {
  try {
    const res = await fetch("/api/site-images", { cache: "no-store" });
    if (!res.ok) return;
    const data = (await res.json()) as { overrides?: Record<string, string> };
    cache = data.overrides ?? {};
    emit();
  } catch {
    cache = {};
    emit();
  }
}

export function useSiteImages(): Record<string, string> {
  const [, force] = React.useReducer((x: number) => x + 1, 0);

  React.useEffect(() => {
    listeners.add(force);
    return () => {
      listeners.delete(force);
    };
  }, []);

  React.useEffect(() => {
    if (!inflight) {
      inflight = loadOverrides();
    }
  }, []);

  return cache;
}

export function setSiteImage(slot: string, url: string) {
  cache = { ...cache, [slot]: url };
  emit();
}

export function clearSiteImage(slot: string) {
  const next = { ...cache };
  delete next[slot];
  cache = next;
  emit();
}
