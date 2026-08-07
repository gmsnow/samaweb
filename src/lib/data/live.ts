import { supabaseBrowser } from "@/lib/supabase/client";
import { logger } from "@/lib/logger";

export interface LiveService {
  id: string;
  name: string;
  price: number;
  iconUrl: string | null;
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
      .select("id, name, price, icon_url")
      .eq("isActive", true)
      .is("deleted_at", null)
      .order("price", { ascending: true });

    if (error) throw error;

    const list: LiveService[] = (data ?? []).map((row) => ({
      id: String(row.id),
      name: String(row.name ?? ""),
      price: Number(row.price ?? 0),
      iconUrl: row.icon_url ? String(row.icon_url) : null,
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

export interface LiveBlogPost {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string | null;
  excerptEn: string | null;
  excerptAr: string | null;
  contentEn: string | null;
  contentAr: string | null;
  coverUrl: string | null;
  category: string | null;
  publishedAt: string | null;
}

let blogCache: { data: LiveBlogPost[]; at: number } | null = null;

export async function fetchLiveBlogPosts(): Promise<LiveBlogPost[]> {
  if (blogCache && Date.now() - blogCache.at < CACHE_TTL) return blogCache.data;

  try {
    const { data, error } = await supabaseBrowser
      .from("blog_posts")
      .select("id, slug, title_en, title_ar, excerpt_en, excerpt_ar, content_en, content_ar, cover_url, category, published_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) throw error;

    const list: LiveBlogPost[] = (data ?? []).map((row) => ({
      id: String(row.id),
      slug: String(row.slug ?? ""),
      titleEn: String(row.title_en ?? ""),
      titleAr: row.title_ar ? String(row.title_ar) : null,
      excerptEn: row.excerpt_en ? String(row.excerpt_en) : null,
      excerptAr: row.excerpt_ar ? String(row.excerpt_ar) : null,
      contentEn: row.content_en ? String(row.content_en) : null,
      contentAr: row.content_ar ? String(row.content_ar) : null,
      coverUrl: row.cover_url ? String(row.cover_url) : null,
      category: row.category ? String(row.category) : null,
      publishedAt: row.published_at ? String(row.published_at) : null,
    }));

    blogCache = { data: list, at: Date.now() };
    return list;
  } catch (err) {
    logger.warn("data/live", "fetch blog posts failed", err);
    return [];
  }
}

export function formatPrice(price: number, locale: string): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US", {
    maximumFractionDigits: 0,
  }).format(price);
}

export interface LiveInsuranceCompany {
  id: string;
  name: string;
  logoUrl: string | null;
}let insuranceCache: { data: LiveInsuranceCompany[]; at: number } | null = null;

export async function fetchLiveInsuranceCompanies(): Promise<LiveInsuranceCompany[]> {
  if (insuranceCache && Date.now() - insuranceCache.at < CACHE_TTL) return insuranceCache.data;

  try {
    const { data, error } = await supabaseBrowser
      .from("insurance_companies")
      .select("id, name, logo_url")
      .eq("active", true)
      .is("deleted_at", null)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) throw error;

    const list: LiveInsuranceCompany[] = (data ?? []).map((row) => ({
      id: String(row.id),
      name: String(row.name ?? ""),
      logoUrl: row.logo_url ? String(row.logo_url) : null,
    }));

    insuranceCache = { data: list, at: Date.now() };
    return list;
  } catch (err) {
    logger.warn("data/live", "fetch insurance companies failed", err);
    return [];
  }
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

export interface LiveEmployee {
  id: string;
  name: string;
  department: string | null;
}

let employeesCache: { data: LiveEmployee[]; at: number } | null = null;

export async function fetchLiveEmployees(): Promise<LiveEmployee[]> {
  if (employeesCache && Date.now() - employeesCache.at < CACHE_TTL) return employeesCache.data;

  try {
    const { data, error } = await supabaseBrowser
      .from("employees")
      .select("id, name, department")
      .eq("department", "علاج طبيعي")
      .eq("is_active", true)
      .is("deleted_at", null)
      .order("name", { ascending: true });

    if (error) throw error;

    const list: LiveEmployee[] = (data ?? []).map((row) => ({
      id: String(row.id),
      name: String(row.name ?? ""),
      department: row.department ? String(row.department) : null,
    }));

    employeesCache = { data: list, at: Date.now() };
    return list;
  } catch (err) {
    logger.warn("data/live", "fetch employees failed", err);
    return [];
  }
}

export interface LiveRating {
  average: number;
  count: number;
}

let ratingCache: { data: LiveRating; at: number } | null = null;

export async function fetchLiveRating(): Promise<LiveRating | null> {
  if (ratingCache && Date.now() - ratingCache.at < CACHE_TTL) return ratingCache.data;

  try {
    const { data, error } = await supabaseBrowser
      .from("site_reviews")
      .select("rating");

    if (error) throw error;

    const rows = (data ?? []) as { rating: unknown }[];
    if (rows.length === 0) return { average: 0, count: 0 };

    const sum = rows.reduce((acc, row) => acc + Number(row.rating ?? 0), 0);
    const rating: LiveRating = {
      average: sum / rows.length,
      count: rows.length,
    };

    ratingCache = { data: rating, at: Date.now() };
    return rating;
  } catch (err) {
    logger.warn("data/live", "fetch rating failed", err);
    return null;
  }
}
