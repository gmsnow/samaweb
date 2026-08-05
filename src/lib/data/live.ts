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

export interface LivePackage {
  id: string;
  name: string;
  priceUsd: number;
  priceYer: number;
  features: string[];
  popular: boolean;
}

let packagesCache: { data: LivePackage[]; at: number } | null = null;

export async function fetchLivePackages(): Promise<LivePackage[]> {
  if (packagesCache && Date.now() - packagesCache.at < CACHE_TTL) return packagesCache.data;

  try {
    const { data, error } = await supabaseBrowser
      .from("packages")
      .select("id, name, price_usd, price_yer, features, popular")
      .is("deleted_at", null)
      .order("price_usd", { ascending: true });

    if (error) throw error;

    const list: LivePackage[] = (data ?? []).map((row) => ({
      id: String(row.id),
      name: String(row.name ?? ""),
      priceUsd: Number(row.price_usd ?? 0),
      priceYer: Number(row.price_yer ?? 0),
      features: Array.isArray(row.features) ? row.features.map((f) => String(f)) : [],
      popular: Boolean(row.popular),
    }));

    packagesCache = { data: list, at: Date.now() };
    return list;
  } catch (err) {
    logger.warn("data/live", "fetch packages failed", err);
    return [];
  }
}

export interface LiveTestimonial {
  id: string;
  patientName: string;
  rating: number;
  textEn: string;
  textAr: string | null;
  treatment: string | null;
  photoUrl: string | null;
}

let testimonialsCache: { data: LiveTestimonial[]; at: number } | null = null;

export async function fetchLiveTestimonials(): Promise<LiveTestimonial[]> {
  if (testimonialsCache && Date.now() - testimonialsCache.at < CACHE_TTL) return testimonialsCache.data;

  try {
    const { data, error } = await supabaseBrowser
      .from("testimonials")
      .select("id, patient_name, rating, text_en, text_ar, treatment, photo_url")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const list: LiveTestimonial[] = (data ?? []).map((row) => ({
      id: String(row.id),
      patientName: String(row.patient_name ?? ""),
      rating: Number(row.rating ?? 5),
      textEn: String(row.text_en ?? ""),
      textAr: row.text_ar ? String(row.text_ar) : null,
      treatment: row.treatment ? String(row.treatment) : null,
      photoUrl: row.photo_url ? String(row.photo_url) : null,
    }));

    testimonialsCache = { data: list, at: Date.now() };
    return list;
  } catch (err) {
    logger.warn("data/live", "fetch testimonials failed", err);
    return [];
  }
}

export function formatPrice(price: number, locale: string): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US", {
    maximumFractionDigits: 0,
  }).format(price);
}

export interface LiveDoctor {
  id: string;
  name: string;
  nameAr: string | null;
  specialty: string;
  specialtyAr: string | null;
  photoUrl: string | null;
  experienceYears: number;
  rating: number;
}

let doctorsCache: { data: LiveDoctor[]; at: number } | null = null;

export async function fetchLiveDoctors(): Promise<LiveDoctor[]> {
  if (doctorsCache && Date.now() - doctorsCache.at < CACHE_TTL) return doctorsCache.data;

  try {
    const { data, error } = await supabaseBrowser
      .from("doctors")
      .select("id, name, name_ar, specialty, specialty_ar, photo_url, experience_years, rating")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) throw error;

    const list: LiveDoctor[] = (data ?? []).map((row) => ({
      id: String(row.id),
      name: String(row.name ?? ""),
      nameAr: row.name_ar ? String(row.name_ar) : null,
      specialty: String(row.specialty ?? ""),
      specialtyAr: row.specialty_ar ? String(row.specialty_ar) : null,
      photoUrl: row.photo_url ? String(row.photo_url) : null,
      experienceYears: Number(row.experience_years ?? 0),
      rating: Number(row.rating ?? 0),
    }));

    doctorsCache = { data: list, at: Date.now() };
    return list;
  } catch (err) {
    logger.warn("data/live", "fetch doctors failed", err);
    return [];
  }
}
