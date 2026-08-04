"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { toast } from "sonner";
import {
  CalendarDays,
  FileText,
  Dumbbell,
  Receipt,
  LayoutDashboard,
  LogOut,
  Bell,
} from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { PortalDashboard } from "./dashboard";
import { PortalAppointments } from "./appointments";
import { PortalReports } from "./reports";
import { PortalExercises } from "./exercises";
import { PortalInvoices } from "./invoices";

type View = "dashboard" | "appointments" | "reports" | "exercises" | "invoices";

const VIEWS: { id: View; icon: typeof LayoutDashboard; key: string }[] = [
  { id: "dashboard", icon: LayoutDashboard, key: "dashboard" },
  { id: "appointments", icon: CalendarDays, key: "appointments" },
  { id: "reports", icon: FileText, key: "reports" },
  { id: "exercises", icon: Dumbbell, key: "exercises" },
  { id: "invoices", icon: Receipt, key: "invoices" },
];

const DEMO_SESSION_KEY = "sama-demo-session";

export function PortalShell() {
  const t = useTranslations("portal");
  const [view, setView] = React.useState<View>("dashboard");
  const [authed, setAuthed] = React.useState<boolean | null>(null);
  const [session, setSession] = React.useState<{ email: string; name: string } | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabaseUser = supabaseBrowser.auth.getSession();
      const { data } = await supabaseUser;
      const sbSession = data.session;
      const demoRaw = localStorage.getItem(DEMO_SESSION_KEY);
      const demo = demoRaw ? (JSON.parse(demoRaw) as { email: string; name: string }) : null;
      if (cancelled) return;
      if (sbSession) {
        setAuthed(true);
        setSession({ email: sbSession.user.email ?? "", name: sbSession.user.user_metadata?.full_name ?? "Patient" });
      } else if (demo) {
        setAuthed(true);
        setSession(demo);
      } else {
        setAuthed(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem(DEMO_SESSION_KEY);
    await supabaseBrowser.auth.signOut().catch(() => {});
    toast.success("Signed out");
    setAuthed(false);
  };

  if (authed === null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!authed) {
    return <SignInPrompt />;
  }

  const initials = (session?.name ?? "P")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="glass-strong h-fit rounded-3xl p-4 lg:sticky lg:top-24">
        <div className="mb-4 flex items-center gap-3 border-b pb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand to-accent font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{session?.name}</p>
            <p className="truncate text-xs text-muted-foreground">{session?.email}</p>
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
          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 flex items-center gap-3 rounded-xl border-t px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            {t("logout")}
          </button>
        </nav>
      </aside>

      <div className="min-w-0">
        <AnimatedView view={view}>
          {view === "dashboard" && <PortalDashboard name={session?.name ?? ""} />}
          {view === "appointments" && <PortalAppointments />}
          {view === "reports" && <PortalReports />}
          {view === "exercises" && <PortalExercises />}
          {view === "invoices" && <PortalInvoices />}
        </AnimatedView>
      </div>
    </div>
  );
}

function AnimatedView({ view, children }: { view: View; children: React.ReactNode }) {
  return (
    <motion.div
      key={view}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {children}
    </motion.div>
  );
}

function SignInPrompt() {
  const t = useTranslations("auth");
  return (
    <div className="glass-strong mx-auto flex max-w-md flex-col items-center rounded-3xl p-10 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-accent text-white">
        <Bell className="h-7 w-7" />
      </div>
      <h2 className="text-xl font-bold">{t("loginTitle")}</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("loginSubtitle")} — {t("demoNotice")}
      </p>
      <Link
        href="/login"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-transform hover:scale-105"
      >
        {t("signIn")}
      </Link>
    </div>
  );
}
