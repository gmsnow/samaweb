import { supabaseBrowser } from "@/lib/supabase/client";
import { logger } from "@/lib/logger";

export interface LiveService {
  id: string;
  name: string;
  price: number;
}

const CACHE_TTL = 5 * 60 * 1000;
let cache: { data: LiveService[]; at: number } | null = null;

export function getExperienceYears(foundedYear = 2024): number {
  return new Date().getFullYear() - foundedYear + 1;
}

export interface LiveStats {
  patients: number;
  sessions: number;
  specialists: number;
  successRate: number;
}

let statsCache: { data: LiveStats; at: number } | null = null;

export async function fetchLiveStats(): Promise<LiveStats | null> {
  if (statsCache && Date.now() - statsCache.at < CACHE_TTL) return statsCache.data;

  try {
    const { count: patients, error: err1 } = await supabaseBrowser
      .from("patients")
      .select("id", { count: "exact", head: true })
      .is("deleted_at", null);
    if (err1) throw err1;

    const { count: sessions, error: err2 } = await supabaseBrowser
      .from("sessions")
      .select("id", { count: "exact", head: true })
      .is("deleted_at", null);
    if (err2) throw err2;

    const { count: completed, error: err4 } = await supabaseBrowser
      .from("sessions")
      .select("id", { count: "exact", head: true })
      .is("deleted_at", null)
      .eq("status", "complete");
    if (err4) throw err4;

    const { count: specialists, error: err3 } = await supabaseBrowser
      .from("employees")
      .select("id", { count: "exact", head: true })
      .is("deleted_at", null)
      .eq("department", "علاج طبيعي");
    if (err3) throw err3;

    const data: LiveStats = {
      patients: patients ?? 0,
      sessions: sessions ?? 0,
      specialists: specialists ?? 0,
      successRate: sessions ? Math.round(((completed ?? 0) / sessions) * 100) : 0,
    };
    statsCache = { data, at: Date.now() };
    return data;
  } catch (err) {
    logger.warn("data/live", "fetch stats failed", err);
    return null;
  }
}

export async function fetchLiveServices(): Promise<LiveService[]> {
  if (cache && Date.now() - cache.at < CACHE_TTL) return cache.data;

  try {
    const { data, error } = await supabaseBrowser
      .from("services")
      .select("id, name, price")
      .eq("isActive", true)
      .is("deleted_at", null)
      .order("price", { ascending: true });

    if (error) throw error;

    const list: LiveService[] = (data ?? []).map((row) => ({
      id: String(row.id),
      name: String(row.name ?? ""),
      price: Number(row.price ?? 0),
    }));

    cache = { data: list, at: Date.now() };
    return list;
  } catch (err) {
    logger.warn("data/live", "fetch services failed", err);
    return [];
  }
}

export function formatPrice(price: number, locale: string): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US", {
    maximumFractionDigits: 0,
  }).format(price);
}
