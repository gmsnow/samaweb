"use client";

import * as React from "react";
import { Search, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";

interface SearchIndexEntry {
  title: string;
  href: string;
  keywords: string;
}

function buildIndex(t: (key: string) => string, nav: (key: string) => string): SearchIndexEntry[] {
  return [
    { title: nav("home"), href: "/", keywords: "home main" },
    { title: nav("about"), href: "/about", keywords: "about mission center" },
    { title: nav("services"), href: "/services", keywords: "services therapy rehab" },
    { title: nav("doctors"), href: "/doctors", keywords: "doctors specialists team" },
    { title: nav("treatments"), href: "/treatments", keywords: "treatments recovery" },
    { title: nav("anatomy"), href: "/anatomy", keywords: "3d anatomy body explorer" },
    { title: nav("gallery"), href: "/gallery", keywords: "gallery photos facility" },
    { title: nav("pricing"), href: "/pricing", keywords: "pricing plans insurance" },
    { title: nav("blog"), href: "/blog", keywords: "blog articles health" },
    { title: nav("contact"), href: "/contact", keywords: "contact map location" },
    { title: t("common.bookNow"), href: "/appointment", keywords: "appointment booking" },
  ];
}

export function SearchDialog() {
  const t = useTranslations();
  const nav = useTranslations("nav");
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const index = React.useMemo(() => buildIndex(t, nav), [t, nav]);

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return index;
    return index.filter(
      (entry) =>
        entry.title.toLowerCase().includes(q) ||
        entry.keywords.toLowerCase().includes(q)
    );
  }, [query, index]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label={t("common.search")}
      >
        <Search className="h-5 w-5" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogTitle className="sr-only">{t("common.search")}</DialogTitle>
          <div className="relative">
            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`${t("common.search")}... (Ctrl+K)`}
              className="ps-9"
            />
          </div>
          <div className="max-h-80 space-y-1 overflow-y-auto">
            {results.length === 0 ? (
              <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                No results found.
              </p>
            ) : (
              results.map((entry) => (
                <Link
                  key={entry.href}
                  href={entry.href}
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                >
                  <span>{entry.title}</span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
