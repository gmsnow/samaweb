"use client";

import * as React from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/shared/section-heading";
import { faqs } from "@/data/content";

export function Faq() {
  const t = useTranslations("faq");
  const locale = useLocale();

  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          highlight={t("highlight")}
          description={t("description")}
        />

        <Accordion type="single" collapsible className="rounded-3xl border border-border/60 bg-card px-6 shadow-soft sm:px-8">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-start">
                {locale === "ar" ? faq.question.ar : faq.question.en}
              </AccordionTrigger>
              <AccordionContent>
                {locale === "ar" ? faq.answer.ar : faq.answer.en}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
