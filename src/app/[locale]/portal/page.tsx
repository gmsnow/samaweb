import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PortalShell } from "@/components/features/portal/portal-shell";

export const metadata: Metadata = {
  title: "Patient Portal | Sama Center",
  description: "Manage your appointments, reports, exercises and invoices.",
};

export default async function PortalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <PortalShell />
    </div>
  );
}
