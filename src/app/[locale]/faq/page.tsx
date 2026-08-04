import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Faq } from "@/components/features/home/faq";

export const metadata: Metadata = {
  title: "FAQ | Sama Center",
  description: "Everything you need to know before your first visit.",
};

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <div className="pt-16" />
      <Faq />
    </>
  );
}
