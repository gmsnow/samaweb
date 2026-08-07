import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { LazySpineViewer } from "@/components/spine/lazy-spine-viewer";
import { LazyFullBodyViewer } from "@/components/spine/lazy-full-body-viewer";
import { SectionHeading } from "@/components/shared/section-heading";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "anatomy" });
  return {
    title: `${t("title")} ${t("highlight")} | Sama Center`,
    description: t("description"),
  };
}

export default async function AnatomyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("anatomy");

  return (
    <div className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute -start-40 top-10 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
      <div className="pointer-events-none absolute -end-40 bottom-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          highlight={t("highlight")}
          description={t("description")}
        />
        <LazySpineViewer />

        <div className="mt-24">
          <SectionHeading
            eyebrow={t("fullBody.eyebrow")}
            title={t("fullBody.title")}
            highlight={t("fullBody.highlight")}
            description={t("fullBody.description")}
          />
          <LazyFullBodyViewer />
        </div>
      </div>
    </div>
  );
}
