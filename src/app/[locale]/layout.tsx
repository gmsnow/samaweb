import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Cairo } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Providers } from "@/components/providers";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { ScrollProgress } from "@/components/shared/progress-bar";
import { CursorGlow } from "@/components/shared/cursor";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { EmergencyCall } from "@/components/shared/emergency-call";
import { BackToTop } from "@/components/shared/back-to-top";
import { AiChatWidget } from "@/components/features/ai/ai-chat-widget";
import { CookieConsent } from "@/components/shared/cookie-consent";
import { Toaster } from "@/components/shared/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.SITE_URL ?? "https://samacenter.vercel.app";
  return {
    title: {
      default: "Sama Center | Physical Therapy & Rehabilitation",
      template: "%s | Sama Center",
    },
    description:
      "Premium physical therapy & rehabilitation center. Move Better. Live Stronger.",
    applicationName: "Sama Center",
    keywords: [
      "physical therapy",
      "rehabilitation",
      "sports injury",
      "orthopedic rehab",
      "physiotherapy clinic",
    ],
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: "/",
      languages: {
        en: "/en",
        ar: "/ar",
      },
    },
    openGraph: {
      title: "Sama Center | Physical Therapy & Rehabilitation",
      description:
        "Premium physical therapy & rehabilitation center. Move Better. Live Stronger.",
      type: "website",
      locale: "en_US",
      siteName: "Sama Center",
    },
    twitter: {
      card: "summary_large_image",
      title: "Sama Center | Physical Therapy & Rehabilitation",
      description:
        "Premium physical therapy & rehabilitation center. Move Better. Live Stronger.",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} antialiased`}
    >
      <body className="min-h-screen font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <Providers>
              <ScrollProgress />
              <CursorGlow />
              <Navbar />
              <main className="flex min-h-screen flex-col">{children}</main>
              <Footer />
              <WhatsAppButton />
              <EmergencyCall />
              <AiChatWidget />
              <BackToTop />
              <CookieConsent />
              <Toaster />
            </Providers>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
