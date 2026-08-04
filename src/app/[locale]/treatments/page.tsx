import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Treatments } from "@/components/features/home/treatments";
import { AnatomyViewer } from "@/components/three/anatomy-viewer";
import { SectionHeading } from "@/components/shared/section-heading";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Treatments | Sama Center",
  description: "Your recovery journey — assessment, personalized plan, treatment, progress.",
};

export default async function TreatmentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("anatomy");
  return (
    <>
      <div className="pt-16" />
      <Treatments />
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            highlight={t("highlight")}
            description={t("description")}
          />
          <AnatomyViewer />
        </div>
      </section>
    </>
  );
}
