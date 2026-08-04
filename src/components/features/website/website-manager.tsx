"use client";

import * as React from "react";
import { useTranslations, useLocale } from "next-intl";
import { ShieldAlert, ImagePlus, Trash2, Loader2, CheckCircle2 } from "lucide-react";
import { testimonials, doctors, blogPosts } from "@/data/content";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useSiteImages, setSiteImage, clearSiteImage } from "@/hooks/use-site-images";

const DEMO_ADMIN_KEY = "sama-demo-admin";

interface SlotItem {
  slot: string;
  defaultSrc: string;
  label: string;
}

function SlotCard({
  slot,
  defaultSrc,
  label,
  value,
  onUploaded,
  onRemoved,
}: {
  slot: string;
  defaultSrc: string;
  label: string;
  value: string | undefined;
  onUploaded: () => void;
  onRemoved: () => void;
}) {
  const t = useTranslations("website");
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setUploading(true);
    setError(null);
    const fd = new FormData();
    fd.append("slot", slot);
    fd.append("file", file);
    try {
      const res = await fetch("/api/site-images", { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error === "missing_config" ? t("missingConfig") : t("error"));
        return;
      }
      setSiteImage(slot, data.url);
      onUploaded();
    } catch {
      setError(t("error"));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function remove() {
    setError(null);
    try {
      await fetch("/api/site-images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot }),
      });
      clearSiteImage(slot);
      onRemoved();
    } catch {
      setError(t("error"));
    }
  }

  const src = value ?? defaultSrc;

  return (
    <div className="glass-strong rounded-3xl p-4">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-muted/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={label} className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{label}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{slot}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void upload(file);
              }}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-primary/25 transition-transform hover:scale-105 disabled:opacity-60"
            >
              {uploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ImagePlus className="h-3.5 w-3.5" />
              )}
              {uploading ? t("uploading") : t("chooseFile")}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => void remove()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-muted/60 px-3 py-1.5 text-xs font-semibold text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {t("remove")}
              </button>
            )}
            {value && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {t("custom")}
              </span>
            )}
          </div>
          {error && <p className="mt-2 text-xs font-medium text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export function WebsiteManager() {
  const t = useTranslations("website");
  const locale = useLocale();
  const [authed, setAuthed] = React.useState<boolean | null>(null);
  const overrides = useSiteImages();

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const isDemoAdmin = localStorage.getItem(DEMO_ADMIN_KEY) === "true";
      const hasDemoSession = localStorage.getItem("sama-demo-session") !== null;
      if (cancelled) return;
      if (isDemoAdmin || (hasDemoSession && process.env.NODE_ENV === "development")) {
        setAuthed(true);
        return;
      }
      const { data } = await supabaseBrowser.auth.getSession().catch(() => ({ data: null }));
      if (data?.session) {
        setAuthed(true);
        return;
      }
      setAuthed(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (authed === null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="glass-strong mx-auto flex max-w-md flex-col items-center rounded-3xl p-10 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-accent text-white">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold">{t("accessDenied")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("accessHint")}</p>
        <button
          type="button"
          onClick={() => {
            localStorage.setItem(DEMO_ADMIN_KEY, "true");
            setAuthed(true);
          }}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-transform hover:scale-105"
        >
          {t("enableDemo")}
        </button>
      </div>
    );
  }

  const groups: { key: string; title: string; items: SlotItem[] }[] = [
    {
      key: "testimonials",
      title: t("testimonials"),
      items: testimonials.map((item) => ({
        slot: item.id,
        defaultSrc: item.avatar,
        label: locale === "ar" ? item.name.ar : item.name.en,
      })),
    },
    {
      key: "doctors",
      title: t("doctors"),
      items: doctors.map((d) => ({
        slot: d.id,
        defaultSrc: d.avatar,
        label: locale === "ar" ? d.name.ar : d.name.en,
      })),
    },
    {
      key: "blog",
      title: t("blog"),
      items: blogPosts.map((p) => ({
        slot: `blog-${p.slug}`,
        defaultSrc: p.image,
        label: locale === "ar" ? p.title.ar : p.title.en,
      })),
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold sm:text-3xl">{t("title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("description")}</p>
      </div>

      <div className="grid gap-8">
        {groups.map((group) => (
          <div key={group.key}>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <span className="h-6 w-1 rounded-full bg-gradient-to-b from-brand to-accent" />
              {group.title}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <SlotCard
                  key={item.slot}
                  slot={item.slot}
                  defaultSrc={item.defaultSrc}
                  label={item.label}
                  value={overrides[item.slot]}
                  onUploaded={() => undefined}
                  onRemoved={() => undefined}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
