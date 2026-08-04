"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/shared/section-heading";
import { journeySteps } from "@/data/content";

export function Journey() {
  const t = useTranslations("journey");

  return (
    <section id="journey" className="relative bg-muted/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          highlight={t("highlight")}
          description={t("description")}
        />

        <div className="relative">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-8 top-7 h-1 origin-left rounded-full bg-gradient-to-r from-brand via-accent to-brand"
          />
          <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
            {journeySteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.12, duration: 0.6 }}
                  className="group flex flex-col items-center text-center"
                >
                  <div className="relative mb-4">
                    <span className="absolute inset-0 rounded-full bg-primary/20 blur-md opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-border/60 bg-background text-primary shadow-soft transition-all group-hover:scale-110 group-hover:border-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold">
                    {t(`steps.${step.key}.title`)}
                  </h3>
                  <p className="mt-1 px-3 text-xs text-muted-foreground">
                    {t(`steps.${step.key}.desc`)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
