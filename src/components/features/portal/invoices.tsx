"use client";

import { useTranslations, useLocale } from "next-intl";
import { Receipt, Wallet } from "lucide-react";
import { demoInvoices } from "@/data/portal";

export function PortalInvoices() {
  const t = useTranslations("portal");
  const locale = useLocale();
  const totalSpent = demoInvoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.amount, 0);
  const fmt = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US");

  return (
    <div className="space-y-6">
      <div className="glass-strong flex items-center gap-4 rounded-3xl bg-gradient-to-br from-brand/10 to-accent/10 p-6">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Wallet className="h-6 w-6" />
        </span>
        <div>
          <p className="text-sm text-muted-foreground">{t("totalSpent")}</p>
          <p className="text-3xl font-extrabold">
            {fmt.format(totalSpent)} {locale === "ar" ? "ريال" : "YER"}
          </p>
        </div>
      </div>

      <div className="glass-strong space-y-3 rounded-3xl p-6">
        <div className="mb-2 flex items-center gap-2">
          <Receipt className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">{t("invoices")}</h3>
        </div>
        {demoInvoices.map((inv) => (
          <div
            key={inv.id}
            className="flex items-center justify-between rounded-2xl bg-muted/40 p-4"
          >
            <div>
              <p className="font-medium">{inv.description}</p>
              <p className="text-xs text-muted-foreground">
                {inv.id} • {inv.issuedAt}
              </p>
            </div>
            <div className="text-end">
              <p className="font-bold">
                {fmt.format(inv.amount)} {inv.currency}
              </p>
              <span
                className={`rounded-full px-3 py-0.5 text-xs font-semibold capitalize ${
                  inv.status === "paid"
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-amber-500/10 text-amber-600"
                }`}
              >
                {inv.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
