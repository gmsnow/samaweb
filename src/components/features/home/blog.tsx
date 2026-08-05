"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { ArrowUpRight, Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/shared/section-heading";
import { fetchLiveBlogPosts, type LiveBlogPost } from "@/lib/data/live";

export function Blog() {
  const t = useTranslations("blog");
  const locale = useLocale();
  const common = useTranslations("common");
  const [posts, setPosts] = React.useState<LiveBlogPost[]>([]);

  React.useEffect(() => {
    let active = true;
    fetchLiveBlogPosts().then((list) => {
      if (active) setPosts(list);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="blog" className="relative bg-muted/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            align="left"
            eyebrow={t("eyebrow")}
            title={t("title")}
            highlight={t("highlight")}
            description={t("description")}
            className="mb-0"
          />
          <Link href="/blog" className="mb-2 hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex">
            {t("readMore")}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {posts.length > 0 && (
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`}>
                <Card className="group h-full overflow-hidden hover:-translate-y-1.5 hover:shadow-lift">
                  <div className="relative overflow-hidden">
                    {post.coverUrl ? (
                      <Image
                        src={post.coverUrl}
                        alt={locale === "ar" ? post.titleAr ?? post.titleEn : post.titleEn}
                        width={800}
                        height={450}
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
                      {common("readMore")}
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}
