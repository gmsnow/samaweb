import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { BookingForm } from "@/components/features/booking/booking-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "appointment" });
  return {
    title: `${t("title")} ${t("highlight")} | Sama Center`,
    description: t("description"),
  };
}

export default async function AppointmentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("appointment");

  return (
    <div className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute -start-40 top-0 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
      <div className="pointer-events-none absolute -end-40 bottom-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Sama Center
          </p>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
            {t("title")}{" "}
            <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
              {t("highlight")}
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            {t("description")}
          </p>
        </div>
        <BookingForm />
      </div>
    </div>
  );
}
