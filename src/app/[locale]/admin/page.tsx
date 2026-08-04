import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { AdminShell } from "@/components/features/admin/admin-shell";

export const metadata: Metadata = {
  title: "Admin Dashboard | Sama Center",
  description: "Sama Center administration — analytics, appointments, patients, finance.",
};

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <AdminShell />
    </div>
  );
}
