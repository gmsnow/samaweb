"use client";

import * as React from "react";
import { Star, Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const SHOW_DELAY = 3 * 60 * 1000;
const DISMISS_COOLDOWN = 7 * 24 * 60 * 60 * 1000;

const SUBMITTED_KEY = "sama_rating_submitted";
const DISMISSED_KEY = "sama_rating_dismissed_at";

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

export function RatingModal() {
  const t = useTranslations("rating");
  const [open, setOpen] = React.useState(false);
  const [rating, setRating] = React.useState(0);
  const [hovered, setHovered] = React.useState(0);
  const [comment, setComment] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  React.useEffect(() => {
    if (readStorage(SUBMITTED_KEY) === "1") return;

    let shown = false;
    let cancelled = false;

    const dismissTimeout = readStorage(DISMISSED_KEY);
    if (dismissTimeout) {
      const elapsed = Date.now() - Number(dismissTimeout);
      if (elapsed < DISMISS_COOLDOWN) return;
    }

    const maybeOpen = () => {
      if (cancelled || shown) return;
      if (document.visibilityState !== "visible") return;
      shown = true;
      setOpen(true);
    };

    const timer = window.setTimeout(maybeOpen, SHOW_DELAY);
    const onVisibility = () => {
      if (document.visibilityState === "visible") maybeOpen();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const handleClose = React.useCallback(() => {
    setOpen(false);
    if (!submitted) writeStorage(DISMISSED_KEY, String(Date.now()));
  }, [submitted]);

  const handleSubmit = async () => {
    if (rating < 1) return;
    setSubmitting(true);
    try {
      await fetch("/api/rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          comment: comment.trim(),
          page: window.location.pathname,
        }),
      });
      writeStorage(SUBMITTED_KEY, "1");
      setSubmitted(true);
    } catch {
      /* network failure — keep dialog open so the user can retry */
    } finally {
      setSubmitting(false);
    }
  };

  const label = rating > 0 ? `${rating} / 5` : "";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogTitle className="sr-only">{t("title")}</DialogTitle>
        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
              <Heart className="h-7 w-7 fill-current" />
            </span>
            <p className="text-xl font-bold">{t("thanks")}</p>
            <p className="text-sm text-muted-foreground">{t("thanksMsg")}</p>
            <Button className="mt-2" onClick={handleClose}>
              {t("close")}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-xl font-bold">{t("title")}</p>
              <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
            </div>

            <div className="flex items-center justify-center gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => {
                const value = i + 1;
                const active = value <= (hovered || rating);
                return (
                  <button
                    key={value}
                    type="button"
                    aria-label={`${value} / 5`}
                    onMouseEnter={() => setHovered(value)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setRating(value)}
                    className="rounded-lg p-1 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Star
                      className={cn(
                        "h-8 w-8",
                        active
                          ? "fill-current text-amber-500"
                          : "text-muted"
                      )}
                    />
                  </button>
                );
              })}
            </div>
            <p className="h-5 text-center text-sm font-medium text-muted-foreground">
              {label}
            </p>

            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("commentPlaceholder")}
              className="min-h-[90px]"
              maxLength={2000}
            />

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleClose}
                disabled={submitting}
              >
                {t("dismiss")}
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmit}
                disabled={rating < 1 || submitting}
              >
                {submitting ? "..." : t("submit")}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
