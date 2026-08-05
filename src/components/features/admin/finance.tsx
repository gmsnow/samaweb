"use client";

import { useTranslations } from "next-intl";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { revenueByMonth } from "@/data/admin";

const PAYMENT_SPLIT = [
  { name: "Insurance", value: 46 },
  { name: "Out of pocket", value: 39 },
  { name: "Corporate plans", value: 15 },
];

const COLORS = ["#2563eb", "#06b6d4", "#818cf8"];

export function AdminFinance() {
  const t = useTranslations("admin");
  const totalRevenue = revenueByMonth.reduce((s, r) => s + r.revenue, 0);

  return (
    <div className="space-y-6">
      <div className="glass-strong rounded-3xl bg-gradient-to-br from-brand/10 to-accent/10 p-6">
        <p className="text-sm text-muted-foreground">{t("revenue")} (YTD)</p>
        <p className="text-4xl font-extrabold">
          {(totalRevenue / 1000).toFixed(0)}K <span className="text-lg text-muted-foreground">YER</span>
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-strong rounded-3xl p-6">
          <h3 className="mb-4 font-semibold">Monthly Revenue (YER)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                <XAxis dataKey="month" stroke="currentColor" fontSize={12} tickLine={false} />
                <YAxis stroke="currentColor" fontSize={12} tickLine={false} width={52} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, background: "rgba(15,23,42,0.9)", border: "none", color: "#fff" }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-strong rounded-3xl p-6">
          <h3 className="mb-4 font-semibold">Payment Methods</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={PAYMENT_SPLIT} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {PAYMENT_SPLIT.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 12, background: "rgba(15,23,42,0.9)", border: "none", color: "#fff" }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
