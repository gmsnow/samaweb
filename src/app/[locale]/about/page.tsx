import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { About } from "@/components/features/home/about";
import { Doctors } from "@/components/features/home/doctors";

export const metadata: Metadata = {
  title: "About | Sama Center",
  description: "Where science meets healing — 15 years of world-class rehabilitation.",
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <div className="pt-16" />
      <About />
      <Doctors />
    </>
  );
}
