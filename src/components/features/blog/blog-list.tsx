"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Clock, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/shared/section-heading";
import { blogPosts } from "@/data/content";
import { BlogImage } from "./blog-image";

const CATEGORIES = ["all", "Ergonomics", "Sports", "Therapy", "Pediatrics", "Pain", "Wellness"];

export function BlogList() {
  const t = useTranslations("blog");
  const locale = useLocale();
  const [cat, setCat] = React.useState("all");
  const posts = cat === "all" ? blogPosts : blogPosts.filter((p) => p.category.en === cat);

  return (
    <>
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        highlight={t("highlight")}
        description={t("description")}
      />

      <div className="mt-8 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => {
          const label = c === "all" ? t("allCategories") : (locale === "ar" ? blogPosts.find((p) => p.category.en === c)?.category.ar : c);
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                cat === c
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
          >
            <Link href={`/blog/${post.slug}`}>
              <Card className="group h-full overflow-hidden hover:-translate-y-1.5 hover:shadow-lift">
                <div className="relative overflow-hidden">
                  <BlogImage
                    slot={`blog-${post.slug}`}
                    defaultSrc={post.image}
                    alt={locale === "ar" ? post.title.ar : post.title.en}
                    width={800}
                    height={500}
                    className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <Badge variant="glass" className="absolute start-4 top-4">
                    {locale === "ar" ? post.category.ar : post.category.en}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{post.author}</span>
                    <span>·</span>
                    <span>{new Date(post.date).toLocaleDateString(locale)}</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime} min
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold leading-snug transition-colors group-hover:text-primary">
                    {locale === "ar" ? post.title.ar : post.title.en}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {locale === "ar" ? post.excerpt.ar : post.excerpt.en}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    {t("readMore")}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </>
  );
}
