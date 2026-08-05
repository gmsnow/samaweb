"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Check, Sparkles, Landmark } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  fetchLivePackages,
  fetchLiveInsuranceCompanies,
  type LivePackage,
  type LiveInsuranceCompany,
} from "@/lib/data/live";

export function Pricing() {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const [live, setLive] = React.useState<LivePackage[]>([]);
  const [companies, setCompanies] = React.useState<LiveInsuranceCompany[]>([]);

  React.useEffect(() => {
    let active = true;
    fetchLivePackages().then((list) => {
      if (active) setLive(list);
    });
    fetchLiveInsuranceCompanies().then((list) => {
      if (active) setCompanies(list);
    });
    return () => {
      active = false;
    };
  }, []);

  const currency =
    locale === "ar"
      ? (price: number) => `${price.toLocaleString("ar-SA")} ر.ي`
      : (price: number) => `$${price.toLocaleString("en-US")}`;

  return (
    <section id="pricing" className="relative bg-muted/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          highlight={t("highlight")}
          description={t("description")}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {live.map((plan, i) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <Card
                    className={`relative h-full p-8 transition-all duration-300 hover:-translate-y-1.5 ${
                      plan.popular
                        ? "border-primary/40 bg-gradient-to-b from-brand/[0.07] to-background shadow-lift"
                        : "hover:shadow-soft"
                    }`}
                  >
                    {plan.popular ? (
                      <Badge className="absolute -top-3 start-1/2 -translate-x-1/2 gap-1 rtl:translate-x-1/2">
                        <Sparkles className="h-3 w-3" />
                        {t("popular")}
                      </Badge>
                    ) : null}
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                    <div className="mt-4 flex items-end gap-1">
                      <span className="text-4xl font-extrabold text-gradient">{currency(plan.priceUsd)}</span>
                      <span className="pb-1 text-sm text-muted-foreground">{currency(plan.priceYer)}</span>
                    </div>
                    <ul className="mt-6 space-y-3">
                      {plan.features.map((feature, fi) => (
                        <li key={fi} className="flex items-start gap-2 text-sm">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8">
                      <Link href="/appointment">
                        <Button
                          className="w-full"
                          variant={plan.popular ? "accent" : "outline"}
                        >
                          {t("book")}
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-col items-center gap-4 rounded-3xl border border-border/60 bg-background/60 p-8 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2">
            <Landmark className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">{t("insurance")}</h3>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {companies.map((company) => (
              <span
                key={company.id}
                className="flex h-12 items-center justify-center rounded-xl border border-border/60 bg-muted/50 px-4 text-sm font-medium text-muted-foreground"
              >
                {company.logoUrl ? (
                  <Image
                    src={company.logoUrl}
                    alt={company.name}
                    width={200}
                    height={64}
                    className="h-8 w-auto max-w-[140px] object-contain"
                    loading="lazy"
                  />
                ) : (
                  company.name
                )}
              </span>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{t("insuranceText")}</p>
        </motion.div>
      </div>
    </section>
  );
}
