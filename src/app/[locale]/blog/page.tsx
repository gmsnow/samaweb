import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { BlogList } from "@/components/features/blog/blog-list";

export const metadata: Metadata = {
  title: "Blog | Sama Center",
  description: "Expert advice on movement, recovery and wellness.",
};

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute start-0 top-1/4 h-80 w-80 rounded-full bg-brand/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <BlogList />
      </div>
    </section>
  );
}
