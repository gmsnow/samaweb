import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Gallery } from "@/components/features/home/gallery";

export const metadata: Metadata = {
  title: "Gallery | Sama Center",
  description: "Inside our center — state-of-the-art facilities designed for healing.",
};

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <div className="pt-16" />
      <Gallery />
    </>
  );
}
