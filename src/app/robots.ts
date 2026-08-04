import type { MetadataRoute } from "next";

const baseUrl = process.env.SITE_URL ?? "https://samacenter.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/portal", "/admin", "/login", "/register", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
