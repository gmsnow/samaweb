import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Doctors } from "@/components/features/home/doctors";

export const metadata: Metadata = {
  title: "Doctors | Sama Center",
  description: "Board-certified physicians and therapists with decades of experience.",
};

export default async function DoctorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <div className="pt-16" />
      <Doctors />
    </>
  );
}
