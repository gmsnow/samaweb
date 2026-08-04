import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { AuthForm } from "@/components/features/auth/auth-form";

export const metadata: Metadata = {
  title: "Create Account | Sama Center",
  description: "Create your Sama Center patient portal account.",
};

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden py-24">
      <div className="pointer-events-none absolute -start-32 top-1/4 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -end-32 bottom-0 h-80 w-80 rounded-full bg-brand/10 blur-3xl" />
      <AuthForm initialMode="register" />
    </div>
  );
}
