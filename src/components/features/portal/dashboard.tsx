"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { CalendarDays, CheckCircle2, Activity, Trophy } from "lucide-react";
import { demoAppointments } from "@/data/portal";

export function PortalDashboard({ name }: { name: string }) {
  const t = useTranslations("portal");
  const next = demoAppointments.find((a) => a.status === "confirmed");

  const stats = [
    { icon: Activity, value: "12", label: t("sessionsCompleted") },
    { icon: Trophy, value: "78%", label: t("healthScore") },
    { icon: CheckCircle2, value: "4", label: t("upcomingAppointments") },
  ];

  return (
    <div className="space-y-6">
      <div className="glass-strong rounded-3xl bg-gradient-to-br from-brand/10 to-accent/10 p-6">
        <h2 className="text-xl font-bold">
          {t("welcome")} 👋 {name}!
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("nextAppointment")}:{" "}
          <span className="font-semibold text-foreground">
            {next ? `${next.date} • ${next.time}` : t("noAppointments")}
          </span>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-strong rounded-2xl p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-2 text-3xl font-extrabold">{s.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="glass-strong rounded-3xl p-6">
        <div className="mb-4 flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">{t("upcomingAppointments")}</h3>
        </div>
        <div className="space-y-3">
          {demoAppointments
            .filter((a) => a.status !== "completed")
            .map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between rounded-2xl bg-muted/40 p-4"
              >
                <div>
                  <p className="font-medium">{a.service}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.doctor} • {a.date} • {a.time}
                  </p>
                </div>
                <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold capitalize text-brand">
                  {a.status}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
