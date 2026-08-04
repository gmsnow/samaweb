"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { CalendarCheck, ArrowRight, ShieldCheck, Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MagneticButton } from "@/components/shared/magnetic-button";
import { StatsCounter } from "@/components/shared/stats-counter";
import { ScrollIndicator } from "@/components/shared/scroll-indicator";
import { siteConfig } from "@/config/site";
import { fetchLiveStats, getExperienceYears, type LiveStats } from "@/lib/data/live";

const HeroScene = dynamic(
  () => import("@/components/three/hero-scene").then((m) => m.HeroScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-24 w-24 animate-pulse rounded-full bg-gradient-to-br from-brand/20 to-accent/20 blur-xl" />
      </div>
    ),
  }
);

export function Hero({ initialStats }: { initialStats?: LiveStats | null }) {
  const t = useTranslations("hero");
  const statsT = useTranslations("stats");
  const [liveStats, setLiveStats] = React.useState<LiveStats | null>(initialStats ?? null);

  React.useEffect(() => {
    if (initialStats) return;
    let active = true;
    fetchLiveStats().then((s) => {
      if (active && s) setLiveStats(s);
    });
    return () => {
      active = false;
    };
  }, [initialStats]);

  const patientsTreated = liveStats ? liveStats.patients + liveStats.sessions : siteConfig.stats.patients;
  const experienceYears = getExperienceYears();

  const stats = [
    { value: patientsTreated, suffix: "+", label: statsT("patients") },
    { value: experienceYears, suffix: "+", label: statsT("experience") },
    { value: liveStats ? liveStats.specialists : siteConfig.stats.doctors, suffix: "+", label: statsT("doctors") },
    { value: liveStats ? liveStats.successRate : siteConfig.stats.successRate, suffix: "%", label: statsT("successRate") },
  ];

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-grid pt-28 lg:pt-20"
      aria-label="Hero"
    >
      <div className="pointer-events-none absolute -top-40 start-1/3 h-[480px] w-[480px] rounded-full bg-brand/15 blur-3xl" />
      <div className="pointer-events-none absolute top-1/4 end-0 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl grid-cols-1 items-center gap-8 px-4 pb-24 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="relative z-10 pt-10 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Badge variant="glass" className="mb-6 gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              {t("badge")}
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl xl:text-7xl"
          >
            {t("title1")}
            <br />
            <span className="text-gradient">{t("title2")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-lg text-lg text-muted-foreground"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <MagneticButton>
              <Link href="/appointment">
                <Button size="xl" className="gap-2">
                  <CalendarCheck className="h-5 w-5" />
                  {t("ctaPrimary")}
                </Button>
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link href="/services">
                <Button size="xl" variant="outline" className="gap-2">
                  {t("ctaSecondary")}
                  <ArrowRight className="h-5 w-5 rtl:rotate-180" />
                </Button>
              </Link>
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </span>
            {t("trustedBy", { count: patientsTreated })}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative h-[420px] sm:h-[520px] lg:h-[640px]"
          aria-hidden
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand/20 via-accent/10 to-transparent blur-3xl" />
          <HeroScene />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8"
      >
        <StatsCounter stats={stats} />
      </motion.div>

      <ScrollIndicator />
    </section>
  );
}
