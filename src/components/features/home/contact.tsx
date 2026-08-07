"use client";

import * as React from "react";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { siteConfig } from "@/config/site";
import { logger } from "@/lib/logger";

const contactSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8),
  subject: z.string().min(2),
  message: z.string().min(10),
});

type ContactValues = z.infer<typeof contactSchema>;

export function Contact() {
  const t = useTranslations("contact");
  const common = useTranslations("common");
  const locale = useLocale();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (values: ContactValues) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(`contact submit failed: ${res.status}`);
      logger.info("contact", "message sent", values.phone);
      toast.success(t("successTitle"), { description: t("successText") });
      reset();
    } catch (error) {
      logger.error("contact", error);
      toast.error(common("error"));
    }
  };

  return (
    <section id="contact" className="relative bg-muted/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          highlight={t("highlight")}
          description={t("description")}
        />

        <div className="grid gap-10 lg:grid-cols-5">
          <Reveal direction="right" className="lg:col-span-2">
            <Card className="h-full p-8">
              <h3 className="mb-6 text-xl font-semibold">{t("workingHours")}</h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-medium">{t("name")}</p>
                    <p className="text-sm text-muted-foreground">
                      {siteConfig.address[locale as keyof typeof siteConfig.address]}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-medium">{t("emergency")}</p>
                    <p className="ltr-only text-sm text-muted-foreground">
                      {siteConfig.emergency}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{siteConfig.email}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                    <Clock className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-medium">{t("workingHours")}</p>
                    <ul className="text-sm text-muted-foreground">
                      {siteConfig.workingHours.map((wh) => (
                        <li key={wh.day.en}>
                          {wh.day[locale as keyof typeof wh.day]}:{" "}
                          <span className="ltr-only">{wh.hours[locale as keyof typeof wh.hours]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              </ul>
            </Card>
          </Reveal>

          <Reveal direction="left" className="lg:col-span-3">
            <Card className="h-full p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">{t("name")}</Label>
                    <Input id="contact-name" {...register("name")} aria-invalid={!!errors.name} />
                    {errors.name ? (
                      <p className="text-xs text-destructive">{t("name")} required</p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone">{t("phone")}</Label>
                    <Input id="contact-phone" type="tel" dir="ltr" {...register("phone")} aria-invalid={!!errors.phone} />
                    {errors.phone ? <p className="text-xs text-destructive">{t("invalidPhone")}</p> : null}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-subject">{t("subject")}</Label>
                  <Input id="contact-subject" {...register("subject")} aria-invalid={!!errors.subject} />
                  {errors.subject ? <p className="text-xs text-destructive">{t("subject")} required</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-message">{t("message")}</Label>
                  <Textarea id="contact-message" rows={5} {...register("message")} aria-invalid={!!errors.message} />
                  {errors.message ? <p className="text-xs text-destructive">{t("message")} required</p> : null}
                </div>
                <Button type="submit" size="lg" className="w-full gap-2 sm:w-auto" disabled={isSubmitting}>
                  <Send className="h-4 w-4" />
                  {isSubmitting ? common("loading") : t("send")}
                </Button>
              </form>
            </Card>
          </Reveal>
        </div>

        <Reveal className="mt-10">
          <Card className="overflow-hidden p-0">
            <iframe
              title={t("mapTitle")}
              src="https://www.google.com/maps?q=C572%2BJ79%20Sanaa%20Yemen&output=embed"
              className="h-[400px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
