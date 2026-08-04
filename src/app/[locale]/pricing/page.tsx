import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Pricing } from "@/components/features/home/pricing";

export const metadata: Metadata = {
  title: "Pricing | Sama Center",
  description: "Transparent plans — flexible packages for your recovery goals.",
};

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <div className="pt-16" />
      <Pricing />
    </>
  );
}
