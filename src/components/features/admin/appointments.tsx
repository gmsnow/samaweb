"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { adminAppointments } from "@/data/admin";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600",
  confirmed: "bg-emerald-500/10 text-emerald-600",
  completed: "bg-brand/10 text-brand",
  cancelled: "bg-red-500/10 text-red-500",
};

export function AdminAppointments() {
  const t = useTranslations("admin");
  const [filter, setFilter] = useState<string>("all");
  const rows = adminAppointments.filter(
    (a) => filter === "all" || a.status === filter
  );

  return (
    <div className="glass-strong rounded-3xl p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-semibold">{t("appointments")}</h3>
        <div className="flex gap-2">
          {["all", "pending", "confirmed", "completed", "cancelled"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
                filter === s
                  ? "bg-primary text-white"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-start text-xs uppercase tracking-wider text-muted-foreground">
              <th className="pb-3 pe-4 text-start">ID</th>
              <th className="pb-3 pe-4 text-start">Patient</th>
              <th className="pb-3 pe-4 text-start">Doctor</th>
              <th className="pb-3 pe-4 text-start">Service</th>
              <th className="pb-3 pe-4 text-start">When</th>
              <th className="pb-3 text-start">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id} className="border-b border-border/40 last:border-0">
                <td className="py-3 pe-4 font-medium text-primary">{a.id}</td>
                <td className="py-3 pe-4 font-medium">{a.patient}</td>
                <td className="py-3 pe-4 text-muted-foreground">{a.doctor}</td>
                <td className="py-3 pe-4 text-muted-foreground">{a.service}</td>
                <td className="py-3 pe-4 text-muted-foreground">
                  {a.date} • {a.time}
                </td>
                <td className="py-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[a.status]}`}>
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
