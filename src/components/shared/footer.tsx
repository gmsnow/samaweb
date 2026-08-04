"use client";

import * as React from "react";
import { useTranslations, useLocale } from "next-intl";
import { MapPin, Phone, Mail, Clock, Activity, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/config/site";
import { NewsletterForm } from "@/components/shared/newsletter";
import {
  InstagramIcon,
  FacebookIcon,
  XTwitterIcon,
  YoutubeIcon,
  LinkedinIcon,
} from "@/components/shared/social-icons";

const socialIcons = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  twitter: XTwitterIcon,
  youtube: YoutubeIcon,
  linkedin: LinkedinIcon,
} as const;

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const locale = useLocale();

  const quickLinks = [
    { href: "/about", label: nav("about") },
    { href: "/doctors", label: nav("doctors") },
    { href: "/treatments", label: nav("treatments") },
    { href: "/anatomy", label: nav("anatomy") },
    { href: "/gallery", label: nav("gallery") },
    { href: "/pricing", label: nav("pricing") },
    { href: "/blog", label: nav("blog") },
  ];

  const services = [
    { href: "/services#physical-therapy", label: "Physical Therapy" },
    { href: "/services#sports-rehab", label: "Sports Rehabilitation" },
    { href: "/services#neuro-rehab", label: "Neurological Rehab" },
    { href: "/services#orthopedic-rehab", label: "Orthopedic Rehab" },
    { href: "/services#pediatric-therapy", label: "Pediatric Therapy" },
    { href: "/services#pain-management", label: "Pain Management" },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-border/50 bg-gradient-to-b from-background to-muted/40">
      <div className="pointer-events-none absolute -top-32 start-1/4 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-accent text-white shadow-lift">
                <Activity className="h-5 w-5" />
              </span>
              <span className="text-lg font-extrabold tracking-tight">Sama Center</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">{t("tagline")}</p>
            <div className="mt-6 flex gap-2">
              {(Object.keys(socialIcons) as Array<keyof typeof socialIcons>).map((key) => {
                const Icon = socialIcons[key];
                return (
                  <a
                    key={key}
                    href={siteConfig.social[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={key}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition-all hover:border-primary hover:text-primary hover:shadow-glow"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <nav aria-label="Quick links">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              {t("quickLinks")}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Services">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">{t("services")}</h3>
            <ul className="space-y-3">
              {services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">{t("contact")}</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {siteConfig.address[locale as keyof typeof siteConfig.address]}
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <span className="ltr-only">{siteConfig.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                {siteConfig.email}
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div className="flex flex-col gap-1">
                  {siteConfig.workingHours.map((wh) => (
                    <span key={wh.day.en}>
                      {wh.day[locale as keyof typeof wh.day]}:{" "}
                      <span className="ltr-only">{wh.hours[locale as keyof typeof wh.hours]}</span>
                    </span>
                  ))}
                </div>
              </li>
            </ul>
            <div className="mt-6">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Sama Center. {t("rights")}
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="transition-colors hover:text-primary">
              {t("privacy")}
            </Link>
            <Link href="/terms" className="transition-colors hover:text-primary">
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
