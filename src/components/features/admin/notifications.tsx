"use client";

import { useTranslations } from "next-intl";
import { Bell } from "lucide-react";
import { adminNotifications } from "@/data/admin";

export function AdminNotifications() {
  const t = useTranslations("admin");
  return (
    <div className="glass-strong space-y-3 rounded-3xl p-6">
      <div className="mb-2 flex items-center gap-2">
        <Bell className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">{t("notifications")}</h3>
      </div>
      {adminNotifications.map((n) => (
        <div
          key={n.id}
          className={`rounded-2xl p-4 ${n.read ? "bg-muted/30" : "bg-primary/5"}`}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="font-medium">{n.title}</p>
            {!n.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
          <p className="mt-1 text-xs text-muted-foreground/70">{n.time}</p>
        </div>
      ))}
    </div>
  );
}
