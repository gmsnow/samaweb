"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Star, Award, CalendarCheck, Stethoscope } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SectionHeading } from "@/components/shared/section-heading";
import { fetchLiveDoctors, type LiveDoctor } from "@/lib/data/live";
import { useSiteImages } from "@/hooks/use-site-images";

export function Doctors() {
  const t = useTranslations("doctors");
  const locale = useLocale();
  const overrides = useSiteImages();
  const [live, setLive] = React.useState<LiveDoctor[]>([]);

  React.useEffect(() => {
    let active = true;
    fetchLiveDoctors().then((list) => {
      if (active) setLive(list);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="doctors" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute -start-20 top-20 h-80 w-80 rounded-full bg-brand/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          highlight={t("highlight")}
          description={t("description")}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {live.map((doctor, i) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
                >
                  <Card className="group relative h-full overflow-hidden text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                    <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-br from-brand/20 via-accent/10 to-transparent" />
                    <CardContent className="relative pt-12">
                      <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border-4 border-background shadow-lift transition-transform duration-300 group-hover:scale-105">
                        <Avatar className="h-full w-full">
                          <AvatarImage src={doctor.photoUrl ?? overrides[doctor.id] ?? undefined} alt={doctor.name} />
                          <AvatarFallback className="bg-gradient-to-br from-brand to-accent text-lg font-semibold text-white">
                            {doctor.name.replace(/^(د\.|Dr\.)\s*/i, "").slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <h3 className="text-lg font-semibold">
                        {locale === "ar" ? doctor.nameAr ?? doctor.name : doctor.name}
                      </h3>
                      <p className="mt-1 text-sm text-primary">
                        {locale === "ar" ? doctor.specialtyAr ?? doctor.specialty : doctor.specialty}
                      </p>

                      <div className="mt-3 flex items-center justify-center gap-2 text-sm">
                        <span className="flex items-center gap-1 font-semibold text-amber-500">
                          <Star className="h-4 w-4 fill-current" />
                          {doctor.rating.toFixed(1)}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                        <Badge variant="glass" className="gap-1.5">
                          <Award className="h-3 w-3 text-primary" />
                          {doctor.experienceYears}+ {t("experience")}
                        </Badge>
                        <Badge variant="glass" className="gap-1.5">
                          <Stethoscope className="h-3 w-3 text-primary" />
                          {t("specialist")}
                        </Badge>
                      </div>

                      <div className="mt-5">
                        <Link href="/appointment">
                          <Button className="w-full gap-2" variant="outline">
                            <CalendarCheck className="h-4 w-4" />
                            {t("book")}
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}
