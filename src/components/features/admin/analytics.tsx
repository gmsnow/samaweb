"use client";

import { useTranslations } from "next-intl";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";
import { Wallet, Users, CalendarDays, Stethoscope } from "lucide-react";
import { revenueByMonth, appointmentsByDay } from "@/data/admin";

export function AdminAnalytics() {
  const t = useTranslations("admin");
  const totalRevenue = revenueByMonth.reduce((s, r) => s + r.revenue, 0);

  const stats = [
    { icon: Wallet, value: `${(totalRevenue / 1000).toFixed(0)}K`, label: t("revenue") },
    { icon: Users, value: "12,400", label: t("activePatients") },
    { icon: CalendarDays, value: "48", label: t("todayAppointments") },
    { icon: Stethoscope, value: "6", label: t("totalDoctors") },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass-strong rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-2 text-3xl font-extrabold">{s.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-strong rounded-3xl p-6">
          <h3 className="mb-4 font-semibold">Revenue (SAR)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueByMonth}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                <XAxis dataKey="month" stroke="currentColor" fontSize={12} tickLine={false} />
                <YAxis stroke="currentColor" fontSize={12} tickLine={false} width={46} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, background: "rgba(15,23,42,0.9)", border: "none", color: "#fff" }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" fill="url(#rev)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-strong rounded-3xl p-6">
          <h3 className="mb-4 font-semibold">Appointments / Week</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appointmentsByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                <XAxis dataKey="day" stroke="currentColor" fontSize={12} tickLine={false} />
                <YAxis stroke="currentColor" fontSize={12} tickLine={false} width={30} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, background: "rgba(15,23,42,0.9)", border: "none", color: "#fff" }}
                  cursor={{ fill: "rgba(37,99,235,0.08)" }}
                />
                <Bar dataKey="count" fill="#06b6d4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
