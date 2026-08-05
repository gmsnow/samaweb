import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";

const baseUrl = process.env.SITE_URL ?? "https://samacenter.vercel.app";

const STATIC_ROUTES = [
  "",
  "/about",
  "/services",
  "/doctors",
  "/treatments",
  "/anatomy",
  "/gallery",
  "/pricing",
  "/blog",
  "/contact",
  "/appointment",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  let posts: { slug: string; published_at: string | null }[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("slug, published_at")
      .eq("is_published", true);
    posts = (data ?? []) as { slug: string; published_at: string | null }[];
  } catch {
    posts = [];
  }

  for (const locale of routing.locales) {
    for (const route of STATIC_ROUTES) {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: route === "" ? 1 : 0.8,
      });
    }
    for (const post of posts) {
      entries.push({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: post.published_at ? new Date(post.published_at) : new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
