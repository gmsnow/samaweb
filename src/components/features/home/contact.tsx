"use client";

import * as React from "react";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import type { FieldError } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { MapPin, Phone, Mail, Clock, Send, MessageSquareReply } from "lucide-react";
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
  name: z.string().min(2, { message: "nameMin" }),
  phone: z.string().min(8, { message: "phoneMin" }).max(30, { message: "phoneMax" }),
  subject: z.string().min(2, { message: "subjectMin" }),
  message: z.string().min(10, { message: "messageMin" }),
});

type ContactValues = z.infer<typeof contactSchema>;

interface ContactReply {
  id: string;
  name: string;
  subject: string | null;
  message: string;
  reply: string | null;
  replied_at: string | null;
  created_at: string;
}

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

  const [checkPhone, setCheckPhone] = useState("");
  const [checking, setChecking] = useState(false);
  const [replies, setReplies] = useState<ContactReply[]>([]);
  const [repliesChecked, setRepliesChecked] = useState(false);

  const checkReplies = async () => {
    const phone = checkPhone.trim();
    if (!phone) return;
    setChecking(true);
    try {
      const res = await fetch(`/api/contact/replies?phone=${encodeURIComponent(phone)}`);
      const data = await res.json().catch(() => ({ replies: [] }));
      setReplies(data.replies ?? []);
    } catch {
      setReplies([]);
    } finally {
      setChecking(false);
      setRepliesChecked(true);
    }
  };

  const errorText = (error?: FieldError) =>
    error?.message ? t(error.message as never) : null;

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
                    <p className="font-medium">{t("location")}</p>
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
                      <p className="text-xs text-destructive">{errorText(errors.name)}</p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone">{t("phone")}</Label>
                    <Input id="contact-phone" type="tel" dir="ltr" {...register("phone")} aria-invalid={!!errors.phone} />
                    {errors.phone ? <p className="text-xs text-destructive">{errorText(errors.phone)}</p> : null}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-subject">{t("subject")}</Label>
                  <Input id="contact-subject" {...register("subject")} aria-invalid={!!errors.subject} />
                  {errors.subject ? <p className="text-xs text-destructive">{errorText(errors.subject)}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-message">{t("message")}</Label>
                  <Textarea id="contact-message" rows={5} {...register("message")} aria-invalid={!!errors.message} />
                  {errors.message ? <p className="text-xs text-destructive">{errorText(errors.message)}</p> : null}
                </div>
                <Button type="submit" size="lg" className="w-full gap-2 sm:w-auto" disabled={isSubmitting}>
                  <Send className="h-4 w-4" />
                  {isSubmitting ? common("loading") : t("send")}
                </Button>
              </form>
            </Card>
          </Reveal>
        </div>

        <Reveal direction="left" className="mt-10">
          <Card className="p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="mb-1 flex items-center gap-2 text-xl font-semibold">
                  <MessageSquareReply className="h-5 w-5 text-primary" />
                  {t("checkReplyTitle")}
                </h3>
                <p className="text-sm text-muted-foreground">{t("checkReplyText")}</p>
              </div>
              <div className="flex w-full gap-2 sm:w-auto">
                <Input
                  type="tel"
                  dir="ltr"
                  placeholder={t("phonePlaceholder")}
                  value={checkPhone}
                  onChange={(e) => setCheckPhone(e.target.value)}
                  className="sm:w-64"
                />
                <Button onClick={checkReplies} disabled={checking || !checkPhone.trim()}>
                  {checking ? common("loading") : t("checkReplyBtn")}
                </Button>
              </div>
            </div>

            {repliesChecked && (
              <div className="mt-6 space-y-4">
                {replies.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t("noReplies")}</p>
                ) : (
                  replies.map((r) => (
                    <div key={r.id} className="rounded-xl border bg-muted/30 p-4">
                      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-medium">
                          {r.subject || t("subject")}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(r.replied_at || r.created_at).toLocaleDateString(locale)}
                        </span>
                      </div>
                      <p className="mb-2 text-sm text-muted-foreground">{r.message}</p>
                      <div className="rounded-lg bg-primary/5 p-3">
                        <p className="mb-0.5 text-xs font-semibold text-primary">{t("ourReply")}</p>
                        <p className="text-sm">{r.reply}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </Card>
        </Reveal>

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
