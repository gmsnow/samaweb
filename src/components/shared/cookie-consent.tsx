"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/logger";

const STORAGE_KEY = "sama-cookie-consent";

export function CookieConsent() {
  const t = useTranslations("cookie");
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    const showLater = (delay: number) => {
      const timer = setTimeout(() => {
        if (!cancelled) setVisible(true);
      }, delay);
      return () => {
        cancelled = true;
        clearTimeout(timer);
      };
    };
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return showLater(2000);
    } catch {
      return showLater(500);
    }
  }, []);

  const decide = (value: "accepted" | "declined") => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      logger.warn("cookie-consent", "localStorage unavailable");
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 start-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-border/60 bg-background/90 p-5 shadow-lift backdrop-blur-xl rtl:translate-x-1/2"
          role="dialog"
          aria-label="Cookie consent"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-primary">
              <Cookie className="h-5 w-5" />
            </span>
            <p className="text-sm text-muted-foreground">{t("message")}</p>
          </div>
          <div className="mt-4 flex gap-2">
            <Button size="sm" className="flex-1" onClick={() => decide("accepted")}>
              {t("accept")}
            </Button>
            <Button size="sm" variant="outline" onClick={() => decide("declined")}>
              {t("decline")}
            </Button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
