"use client";

import { useTranslations } from "next-intl";
import { adminDoctors } from "@/data/admin";

export function AdminDoctors() {
  const t = useTranslations("admin");
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {adminDoctors.map((d) => (
        <div key={d.id} className="glass-strong rounded-3xl p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand to-accent text-lg font-bold text-white">
                {d.name.replace("Dr. ", "").split(" ").map((s) => s[0]).join("")}
              </div>
              <div>
                <p className="font-semibold">{d.name}</p>
                <p className="text-xs text-muted-foreground">{d.specialty}</p>
              </div>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                d.status === "active"
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-amber-500/10 text-amber-600"
              }`}
            >
              {d.status.replace("_", " ")}
            </span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/40 p-3 text-center">
              <p className="text-lg font-extrabold">{d.patients}</p>
              <p className="text-xs text-muted-foreground">{t("activePatients")}</p>
            </div>
            <div className="rounded-xl bg-muted/40 p-3 text-center">
              <p className="text-lg font-extrabold text-primary">★ {d.rating}</p>
              <p className="text-xs text-muted-foreground">Rating</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
