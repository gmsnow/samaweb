"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/logger";

export function NewsletterForm() {
  const t = useTranslations("newsletter");
  const [email, setEmail] = React.useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email.");
      return;
    }
    logger.info("newsletter", "subscribe", email);
    toast.success(t("success"));
    setEmail("");
  };

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <Input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("placeholder")}
        className="h-10"
        aria-label={t("placeholder")}
      />
      <Button type="submit" size="icon" aria-label={t("button")}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
