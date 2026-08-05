"use client";

import * as React from "react";
import { useTranslations, useLocale } from "next-intl";
import { Star, Quote } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SectionHeading } from "@/components/shared/section-heading";
import { siteConfig } from "@/config/site";
import { fetchLiveTestimonials, fetchLiveStats, type LiveTestimonial, type LiveStats } from "@/lib/data/live";

export function Testimonials({ initialStats }: { initialStats?: LiveStats | null }) {
  const t = useTranslations("testimonials");
  const locale = useLocale();
  const [plugin] = React.useState(() =>
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );
  const [items, setItems] = React.useState<LiveTestimonial[]>([]);
  const [patientsTreated, setPatientsTreated] = React.useState<number | null>(
    initialStats ? initialStats.patients + initialStats.sessions : null
  );

  React.useEffect(() => {
    let active = true;
    fetchLiveTestimonials().then((list) => {
      if (active) setItems(list);
    });
    return () => {
      active = false;
    };
  }, []);

  const patientsLabel = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US").format(
    patientsTreated ?? siteConfig.stats.patients
  );

  React.useEffect(() => {
    if (initialStats) return;
    let active = true;
    fetchLiveStats().then((s) => {
      if (active && s) setPatientsTreated(s.patients + s.sessions);
    });
    return () => {
      active = false;
    };
  }, [initialStats]);

  return (
    <section id="testimonials" className="relative bg-muted/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          highlight={t("highlight")}
          description={t("description")}
        />

        {items.length > 0 && (
        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[plugin]}
          className="mx-auto max-w-5xl"
        >
          <CarouselContent>
            {items.map((item) => (
              <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="group relative flex h-full flex-col p-6 transition-all hover:-translate-y-1 hover:shadow-lift">
                  <Quote className="absolute end-4 top-4 h-8 w-8 text-primary/10 transition-colors group-hover:text-primary/20" />
                  <div className="mb-3 flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.round(item.rating) ? "fill-current" : "text-muted"}`}
                      />
                    ))}
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-foreground/85">
                    &ldquo;{locale === "ar" ? item.textAr ?? item.textEn : item.textEn}&rdquo;
                  </p>
                  <div className="mt-5 flex items-center gap-3 border-t pt-4">
                    <Avatar className="h-11 w-11">
                      <AvatarImage src={item.photoUrl ?? undefined} alt={item.patientName} />
                      <AvatarFallback>{item.patientName.trim().slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">{item.patientName}</p>
                      {item.treatment && (
                        <p className="text-xs text-muted-foreground">{item.treatment}</p>
                      )}
                    </div>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
        )}

        <div className="mt-10 flex justify-center">
          <div className="glass-strong flex items-center gap-3 rounded-2xl px-6 py-4 shadow-soft">
            <div className="flex items-center gap-0.5 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <div className="text-start">
              <p className="text-lg font-bold">4.9 / 5.0</p>
              <p className="text-xs text-muted-foreground">
                {t("ratingLabel")} · {patientsLabel}+ {t("patients")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
