"use client";

import * as React from "react";
import { motion, useScroll } from "framer-motion";
import { useTranslations } from "next-intl";
import { Activity, Menu, CalendarCheck, Stethoscope } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { SearchDialog } from "@/components/shared/search-dialog";

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { scrollY } = useScroll();

  React.useEffect(() => {
    const unsubscribe = scrollY.on("change", (y) => setScrolled(y > 24));
    return () => unsubscribe();
  }, [scrollY]);

  const links = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/services", label: t("services") },
    { href: "/doctors", label: t("doctors") },
    { href: "/treatments", label: t("treatments") },
    { href: "/gallery", label: t("gallery") },
    { href: "/pricing", label: t("pricing") },
    { href: "/blog", label: t("blog") },
    { href: "/contact", label: t("contact") },
  ];

  const mobileLinks = [
    ...links,
    { href: "/anatomy", label: t("anatomy") },
  ];

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/40 bg-background/80 shadow-soft backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        <Link href="/" className="group flex items-center gap-2.5" aria-label="Sama Center home">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-accent text-white shadow-lift transition-transform group-hover:scale-105">
            <Activity className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-lg font-extrabold tracking-tight">Sama Center</span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Rehabilitation
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-xl px-3.5 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary",
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <SearchDialog />
          <LanguageSwitcher />
          <ThemeSwitcher />
          <Link href="/portal" className="hidden lg:block">
            <Button variant="ghost" size="sm" className="gap-2">
              <Stethoscope className="h-4 w-4" />
              {t("patientPortal")}
            </Button>
          </Link>
          <Link href="/appointment" className="hidden lg:block">
            <Button className="gap-2">
              <CalendarCheck className="h-4 w-4" />
              {t("appointment")}
            </Button>
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label={t("menu")}>
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm">
              <SheetHeader className="text-start">
                <SheetTitle className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-accent text-white">
                    <Activity className="h-4 w-4" />
                  </span>
                  Sama Center
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 overflow-y-auto px-2">
                {mobileLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-xl px-4 py-3 text-base font-medium transition-colors hover:bg-muted",
                      pathname === link.href
                        ? "bg-muted text-primary"
                        : "text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-4 flex flex-col gap-3 border-t pt-4">
                  <Link href="/portal" onClick={() => setOpen(false)}>
                    <Badge variant="glass" className="w-fit gap-2">
                      <Stethoscope className="h-3.5 w-3.5" />
                      {t("patientPortal")}
                    </Badge>
                  </Link>
                  <Link href="/appointment" onClick={() => setOpen(false)}>
                    <Button className="w-full gap-2">
                      <CalendarCheck className="h-4 w-4" />
                      {t("appointment")}
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </motion.header>
  );
}
