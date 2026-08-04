import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/features/home/hero";
import { Services } from "@/components/features/home/services";
import { About } from "@/components/features/home/about";
import { Treatments } from "@/components/features/home/treatments";
import { Journey } from "@/components/features/home/journey";
import { Doctors } from "@/components/features/home/doctors";
import { Testimonials } from "@/components/features/home/testimonials";
import { Gallery } from "@/components/features/home/gallery";
import { Pricing } from "@/components/features/home/pricing";
import { Faq } from "@/components/features/home/faq";
import { Blog } from "@/components/features/home/blog";
import { Cta } from "@/components/features/home/cta";
import { Contact } from "@/components/features/home/contact";
import { fetchLiveStats, fetchLiveServices } from "@/lib/data/live";

export const revalidate = 60;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [stats, services] = await Promise.all([fetchLiveStats(), fetchLiveServices()]);

  return (
    <>
      <Hero initialStats={stats} />
      <Services initialServices={services} />
      <About />
      <Treatments />
      <Journey />
      <Doctors />
      <Testimonials initialStats={stats} />
      <Gallery />
      <Pricing />
      <Faq />
      <Blog />
      <Cta />
      <Contact />
    </>
  );
}
