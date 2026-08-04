"use client";

import { useTranslations } from "next-intl";
import { CalendarDays, Home, Video } from "lucide-react";
import { demoAppointments } from "@/data/portal";

export function PortalAppointments() {
  const t = useTranslations("portal");
  const upcoming = demoAppointments.filter((a) => a.status !== "completed");
  const past = demoAppointments.filter((a) => a.status === "completed");

  const TypeIcon = ({ type }: { type: string }) =>
    type === "virtual" ? (
      <Video className="h-4 w-4" />
    ) : type === "home_visit" ? (
      <Home className="h-4 w-4" />
    ) : (
      <CalendarDays className="h-4 w-4" />
    );

  const Row = ({ a }: { a: (typeof demoAppointments)[number] }) => (
    <div className="flex items-center justify-between rounded-2xl bg-muted/40 p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <TypeIcon type={a.type} />
        </span>
        <div>
          <p className="font-medium">{a.service}</p>
          <p className="text-xs text-muted-foreground">
            {a.doctor} • {a.date} • {a.time}
          </p>
        </div>
      </div>
      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
          a.status === "confirmed"
            ? "bg-emerald-500/10 text-emerald-600"
            : a.status === "cancelled"
              ? "bg-red-500/10 text-red-500"
              : "bg-brand/10 text-brand"
        }`}
      >
        {a.status}
      </span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="glass-strong rounded-3xl p-6">
        <h3 className="mb-4 font-semibold">{t("upcomingAppointments")}</h3>
        {upcoming.length ? (
          <div className="space-y-3">
            {upcoming.map((a) => (
              <Row key={a.id} a={a} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t("noAppointments")}</p>
        )}
      </div>

      <div className="glass-strong rounded-3xl p-6">
        <h3 className="mb-4 font-semibold">{t("pastAppointments")}</h3>
        <div className="space-y-3">
          {past.map((a) => (
            <Row key={a.id} a={a} />
          ))}
        </div>
      </div>
    </div>
  );
}
