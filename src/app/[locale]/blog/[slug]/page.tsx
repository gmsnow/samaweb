import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";

export const revalidate = 60;

async function getPost(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("id, slug, title_en, title_ar, excerpt_en, excerpt_ar, content_en, content_ar, cover_url, category, published_at")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title_en,
    description: post.excerpt_en ?? undefined,
    openGraph: {
      title: post.title_en,
      description: post.excerpt_en ?? undefined,
      images: post.cover_url ? [post.cover_url] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = await getPost(slug);
  if (!post) notFound();

  const locale_ = locale as "en" | "ar";
  const title = locale_ === "ar" ? post.title_ar ?? post.title_en : post.title_en;
  const excerpt = locale_ === "ar" ? post.excerpt_ar ?? post.excerpt_en : post.excerpt_en;
  const content = locale_ === "ar" ? post.content_ar ?? post.content_en : post.content_en;

  return (
    <article className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
      {post.category && (
        <div className="mb-6">
          <Badge>{post.category}</Badge>
        </div>
      )}
      <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">{title}</h1>
      <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
        {post.published_at && (
          <time>{new Date(post.published_at).toLocaleDateString(locale)}</time>
        )}
      </div>

      {post.cover_url && (
        <div className="relative mt-8 overflow-hidden rounded-3xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover_url}
            alt={title}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
      )}

      <div className="prose prose-neutral dark:prose-invert mt-10 space-y-6 text-lg leading-relaxed">
        {excerpt && <p>{excerpt}</p>}
        {content
          ? content.split(/\n+/).map((paragraph: string, i: number) => (
              <p key={i}>{paragraph}</p>
            ))
          : null}
      </div>
    </article>
  );
}
