"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/shared/section-heading";
import { treatmentsStages } from "@/data/content";

export function Treatments() {
  const t = useTranslations("treatments");

  return (
    <section id="treatments" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute start-0 top-1/3 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          highlight={t("highlight")}
          description={t("description")}
        />

        <div className="relative mx-auto max-w-4xl">
          <div className="absolute inset-y-0 start-4 w-px bg-gradient-to-b from-brand via-accent to-transparent lg:start-1/2" />

          <div className="space-y-12">
            {treatmentsStages.map((stage, i) => {
              const Icon = stage.icon;
              const even = i % 2 === 0;
              return (
                <motion.div
                  key={stage.key}
                  initial={{ opacity: 0, x: even ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative flex items-start gap-6 ps-14 lg:w-1/2 lg:ps-0 ${
                    even
                      ? "lg:pe-14 lg:text-end"
                      : "lg:ms-auto lg:ps-14"
                  }`}
                >
                  <span
                    className={`absolute start-0 top-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-gradient-to-br from-brand to-accent text-white shadow-lift ${
                      even ? "lg:start-auto lg:-end-5" : ""
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="glass-strong flex-1 rounded-2xl p-6 shadow-soft">
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold">{t(`${stage.key}`)}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t(`${stage.key}Text`)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
