import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { WebsiteManager } from "@/components/features/website/website-manager";

export const metadata: Metadata = {
  title: "Website Content | Sama Center",
  description: "Manage images for the public website.",
};

export default async function WebsitePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <WebsiteManager />
    </div>
  );
}
