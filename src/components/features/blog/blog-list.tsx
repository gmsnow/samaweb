"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Clock, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/shared/section-heading";
import { fetchLiveBlogPosts, type LiveBlogPost } from "@/lib/data/live";

export function BlogList() {
  const t = useTranslations("blog");
  const locale = useLocale();
  const [posts, setPosts] = React.useState<LiveBlogPost[]>([]);
  const [cat, setCat] = React.useState("all");

  React.useEffect(() => {
    let active = true;
    fetchLiveBlogPosts().then((list) => {
      if (active) setPosts(list);
    });
    return () => {
      active = false;
    };
  }, []);

  const categories = React.useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.category && set.add(p.category));
    return ["all", ...Array.from(set)];
  }, [posts]);

  const visible = cat === "all" ? posts : posts.filter((p) => p.category === cat);

  return (
    <>
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        highlight={t("highlight")}
        description={t("description")}
      />

      {categories.length > 1 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((c) => (
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
              {c === "all" ? t("allCategories") : c}
            </button>
          ))}
        </div>
      )}

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((post, i) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
          >
            <Link href={`/blog/${post.slug}`}>
              <Card className="group h-full overflow-hidden hover:-translate-y-1.5 hover:shadow-lift">
                <div className="relative overflow-hidden">
                  {post.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.coverUrl}
                      alt={locale === "ar" ? post.titleAr ?? post.titleEn : post.titleEn}
                      className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="aspect-[16/9] w-full bg-gradient-to-br from-brand/20 via-accent/10 to-transparent" />
                  )}
                  {post.category && (
                    <Badge variant="glass" className="absolute start-4 top-4">
                      {post.category}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {post.publishedAt && (
                      <>
                        <span>{new Date(post.publishedAt).toLocaleDateString(locale)}</span>
                        <span>·</span>
                      </>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {t("readTime")}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold leading-snug transition-colors group-hover:text-primary">
                    {locale === "ar" ? post.titleAr ?? post.titleEn : post.titleEn}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {locale === "ar" ? post.excerptAr ?? post.excerptEn ?? "" : post.excerptEn ?? ""}
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
