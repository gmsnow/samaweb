"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  BarChart3,
  CalendarDays,
  Stethoscope,
  Users,
  Wallet,
  Bell,
  ShieldAlert,
} from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { AdminAnalytics } from "./analytics";
import { AdminAppointments } from "./appointments";
import { AdminDoctors } from "./doctors";
import { AdminPatients } from "./patients";
import { AdminFinance } from "./finance";
import { AdminNotifications } from "./notifications";

type View =
  | "analytics"
  | "appointments"
  | "doctors"
  | "patients"
  | "finance"
  | "notifications";

const VIEWS: { id: View; icon: typeof BarChart3; key: string }[] = [
  { id: "analytics", icon: BarChart3, key: "analytics" },
  { id: "appointments", icon: CalendarDays, key: "appointments" },
  { id: "doctors", icon: Stethoscope, key: "doctors" },
  { id: "patients", icon: Users, key: "patients" },
  { id: "finance", icon: Wallet, key: "finance" },
  { id: "notifications", icon: Bell, key: "notifications" },
];

const DEMO_ADMIN_KEY = "sama-demo-admin";

export function AdminShell() {
  const t = useTranslations("admin");
  const [view, setView] = React.useState<View>("analytics");
  const [authed, setAuthed] = React.useState<boolean | null>(null);

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
        <h2 className="text-xl font-bold">{t("adminAccess")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Demo: open this page, then use the console (or login) to enable admin demo access.
        </p>
        <button
          type="button"
          onClick={() => {
            localStorage.setItem(DEMO_ADMIN_KEY, "true");
            setAuthed(true);
          }}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-transform hover:scale-105"
        >
          Enable demo admin
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="glass-strong h-fit rounded-3xl p-4 lg:sticky lg:top-24">
        <div className="mb-4 flex items-center gap-3 border-b pb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-accent text-white">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">{t("title")}</p>
            <p className="text-xs text-muted-foreground">Sama Center</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {VIEWS.map((v) => {
            const Icon = v.icon;
            const active = view === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setView(v.id)}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "text-foreground/70 hover:bg-foreground/5"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t(v.key)}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="min-w-0">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          {view === "analytics" && <AdminAnalytics />}
          {view === "appointments" && <AdminAppointments />}
          {view === "doctors" && <AdminDoctors />}
          {view === "patients" && <AdminPatients />}
          {view === "finance" && <AdminFinance />}
          {view === "notifications" && <AdminNotifications />}
        </motion.div>
      </div>
    </div>
  );
}
