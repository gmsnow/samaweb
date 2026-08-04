"use client";

import { useTranslations } from "next-intl";
import { adminPatients } from "@/data/admin";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600",
  new: "bg-brand/10 text-brand",
  inactive: "bg-muted/50 text-muted-foreground",
};

export function AdminPatients() {
  const t = useTranslations("admin");
  return (
    <div className="glass-strong overflow-hidden rounded-3xl">
      <div className="p-6">
        <h3 className="font-semibold">{t("patients")}</h3>
      </div>
      <div className="overflow-x-auto px-6 pb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-start text-xs uppercase tracking-wider text-muted-foreground">
              <th className="pb-3 pe-4 text-start">Patient</th>
              <th className="pb-3 pe-4 text-start">Last Visit</th>
              <th className="pb-3 pe-4 text-start">Sessions</th>
              <th className="pb-3 text-start">Status</th>
            </tr>
          </thead>
          <tbody>
            {adminPatients.map((p) => (
              <tr key={p.id} className="border-b border-border/40 last:border-0">
                <td className="py-3 pe-4 font-medium">{p.name}</td>
                <td className="py-3 pe-4 text-muted-foreground">{p.lastVisit}</td>
                <td className="py-3 pe-4 text-muted-foreground">{p.sessions}</td>
                <td className="py-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[p.status]}`}>
                    {p.status}
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
