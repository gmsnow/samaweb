import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Services } from "@/components/features/home/services";
import { fetchLiveServices } from "@/lib/data/live";

export const metadata: Metadata = {
  title: "Services | Sama Center",
  description: "Comprehensive rehabilitation — thirteen specialized programs.",
};

export const revalidate = 60;

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const services = await fetchLiveServices();
  return (
    <>
      <div className="pt-16" />
      <Services initialServices={services} />
    </>
  );
}
