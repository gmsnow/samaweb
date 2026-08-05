"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Target, Eye, HeartHandshake, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { getExperienceYears } from "@/lib/data/live";

const values = [
  { icon: HeartHandshake, key: "value1" },
  { icon: Target, key: "value2" },
  { icon: Eye, key: "value3" },
];

export function About() {
  const t = useTranslations("about");
  const statsT = useTranslations("stats");
  const locale = useLocale();

  return (
    <section id="about" className="relative bg-muted/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          highlight={t("highlight")}
          description={t("description")}
        />

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal direction="right" className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lift">
              <Image
                src="/images/premium_photo-1663052427377-3f41fde11508.avif"
                alt={locale === "ar" ? "مركز سما" : "Sama Center facility"}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand/30 to-transparent" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="glass-strong absolute -bottom-6 start-6 flex items-center gap-3 rounded-2xl p-4 shadow-lift"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-accent text-white">
                <Building2 className="h-6 w-6" />
              </span>
              <div>
                <p className="text-lg font-bold text-gradient">{getExperienceYears()}+</p>
                <p className="text-xs text-muted-foreground">{statsT("experience")}</p>
              </div>
            </motion.div>
          </Reveal>

          <div className="space-y-6">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <Reveal key={value.key} delay={i * 0.1} direction="up">
                  <Card className="flex gap-4 p-6 hover:border-primary/30 hover:shadow-soft">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand/15 to-accent/15 text-primary">
                      <Icon className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="font-semibold">{t(value.key)}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t(`${value.key}Text`)}
                      </p>
                    </div>
                  </Card>
                </Reveal>
              );
            })}
            <Reveal delay={0.3} direction="up">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-gradient-to-br from-brand to-blue-700 p-6 text-white">
                  <h3 className="font-semibold">{t("mission")}</h3>
                  <p className="mt-2 text-sm text-white/85">{t("missionText")}</p>
                </Card>
                <Card className="bg-gradient-to-br from-ink to-slate-700 p-6 text-white">
                  <h3 className="font-semibold">{t("vision")}</h3>
                  <p className="mt-2 text-sm text-white/85">{t("visionText")}</p>
                </Card>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
