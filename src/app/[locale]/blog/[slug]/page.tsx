import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { blogPosts } from "@/data/content";
import { Badge } from "@/components/ui/badge";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title.en,
    description: post.excerpt.en,
    openGraph: { title: post.title.en, description: post.excerpt.en, images: [post.image] },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const locale_ = locale as "en" | "ar";

  return (
    <article className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Badge>{post.category[locale_]}</Badge>
      </div>
      <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
        {post.title[locale_]}
      </h1>
      <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
        <span>{post.author}</span>
        <span>·</span>
        <time>{new Date(post.date).toLocaleDateString(locale)}</time>
        <span>·</span>
        <span>{post.readTime} min read</span>
      </div>

      <div className="relative mt-8 overflow-hidden rounded-3xl">
        <Image
          src={post.image}
          alt={post.title[locale_]}
          width={1200}
          height={700}
          className="aspect-[16/9] w-full object-cover"
          priority
        />
      </div>

      <div className="prose prose-neutral dark:prose-invert mt-10 space-y-6 text-lg leading-relaxed">
        <p>{post.excerpt[locale_]}</p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <h2>Understanding the Science</h2>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
          deserunt mollit anim id est laborum.
        </p>
        <p>
          Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et
          commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.
        </p>
        <h2>Practical Tips</h2>
        <ul>
          <li>Maintain proper ergonomics throughout the day</li>
          <li>Take movement breaks every 30–45 minutes</li>
          <li>Strengthen supporting muscle groups regularly</li>
          <li>Consult a specialist for persistent symptoms</li>
        </ul>
        <p>
          Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula.
          Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula ut dictum pharetra,
          nisi nunc fringilla magna, in commodo elit erat nec turpis.
        </p>
      </div>
    </article>
  );
}
