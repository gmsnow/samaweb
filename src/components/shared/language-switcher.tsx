"use client";

import * as React from "react";
import { Languages } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logger } from "@/lib/logger";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (next: string) => {
    if (next === locale) return;
    try {
      router.replace(pathname, { locale: next });
      router.refresh();
    } catch (error) {
      logger.error("language-switcher", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Switch language">
          <Languages className="h-5 w-5" />
          <span className="ms-1 text-xs font-semibold uppercase">
            {locale === "ar" ? "ع" : "EN"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => switchLocale("en")}>
          English
          {locale === "en" ? <span className="ms-auto">✓</span> : null}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchLocale("ar")}>
          العربية
          {locale === "ar" ? <span className="ms-auto">✓</span> : null}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
