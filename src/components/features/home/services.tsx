"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { ArrowUpRight, Activity } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/shared/section-heading";
import { services } from "@/data/content";
import { fetchLiveServices, formatPrice, type LiveService } from "@/lib/data/live";

export function Services({ initialServices }: { initialServices?: LiveService[] | null }) {
  const t = useTranslations("services");
  const common = useTranslations("common");
  const locale = useLocale();
  const items = t.raw("list");
  const [live, setLive] = React.useState<LiveService[] | null>(
    initialServices && initialServices.length > 0 ? initialServices : null
  );

  React.useEffect(() => {
    if (initialServices && initialServices.length > 0) return;
    let active = true;
    fetchLiveServices().then((list) => {
      if (active && list.length > 0) setLive(list);
    });
    return () => {
      active = false;
    };
  }, [initialServices]);

  return (
    <section id="services" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute end-0 top-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          highlight={t("highlight")}
          description={t("description")}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {live
            ? live.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: (i % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link href="/appointment">
                    <Card className="group relative h-full overflow-hidden p-6 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-lift">
                      <div className="absolute -end-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20" />
                      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-soft transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                        <Activity className="h-6 w-6" />
                      </div>
                      <h3 className="text-base font-semibold">{service.name}</h3>
                      <p className="mt-2 text-sm font-medium text-primary">
                        {formatPrice(service.price, locale)}{" "}
                        <span className="text-xs text-muted-foreground">
                          {locale === "ar" ? "ريال" : "YER"}
                        </span>
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        {common("learnMore")}
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </Card>
                  </Link>
                </motion.div>
              ))
            : services.map((service, i) => {
            const local = items[service.slug] as { name: string; desc: string } | undefined;
            const Icon = service.icon;
            return (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href={`/services#${service.slug}`}>
                  <Card className="group relative h-full overflow-hidden p-6 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-lift">
                    <div
                      className={`absolute -end-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${service.gradient} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20`}
                    />
                    <div
                      className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${service.gradient} text-white shadow-soft transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-semibold">
                      {locale === "ar" ? service.name.ar : service.name.en}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                      {locale === "ar"
                        ? (local?.desc ?? service.desc.ar)
                        : (local?.desc ?? service.desc.en)}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      {common("learnMore")}
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
