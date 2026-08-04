import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Contact } from "@/components/features/home/contact";

export const metadata: Metadata = {
  title: "Contact | Sama Center",
  description: "Get in touch with Sama Center. We'd love to hear from you.",
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Contact />;
}
