"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { CalendarCheck, PhoneCall } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/shared/magnetic-button";
import { siteConfig } from "@/config/site";

export function Cta() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand via-blue-700 to-ink p-10 text-center text-white shadow-lift sm:p-16"
        >
          <div className="pointer-events-none absolute -start-20 -top-20 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />
          <div className="pointer-events-none absolute -end-16 -bottom-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="bg-grid absolute inset-0 opacity-20" />

          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-extrabold sm:text-5xl">
              {t("title1")} <span className="text-accent">{t("title2")}</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/80">{t("subtitle")}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <MagneticButton>
                <Link href="/appointment">
                  <Button
                    size="xl"
                    className="gap-2 bg-white text-brand shadow-lift hover:bg-white/90"
                  >
                    <CalendarCheck className="h-5 w-5" />
                    {t("ctaPrimary")}
                  </Button>
                </Link>
              </MagneticButton>
              <MagneticButton>
                <a href={`tel:${siteConfig.phone.replace(/[^+\d]/g, "")}`}>
                  <Button
                    size="xl"
                    variant="glass"
                    className="gap-2 border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
                  >
                    <PhoneCall className="h-5 w-5" />
                    {siteConfig.phone}
                  </Button>
                </a>
              </MagneticButton>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
