"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { Download, FileText } from "lucide-react";
import { demoReports } from "@/data/portal";
import { Button } from "@/components/ui/button";

function generatePdf(
  title: string,
  doctor: string,
  date: string,
  diagnosis: string,
  summary: string
) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, 210, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Sama Center — Medical Report", 14, 15);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Physical Therapy & Rehabilitation", 14, 22);

  doc.setTextColor(30, 30, 30);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(title, 14, 44);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Doctor: ${doctor}`, 14, 52);
  doc.text(`Date: ${date}`, 14, 58);

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Diagnosis", 14, 70);
  doc.setFont("helvetica", "normal");
  doc.text(doc.splitTextToSize(diagnosis, 182), 14, 76);

  doc.setFont("helvetica", "bold");
  doc.text("Summary", 14, 92);
  doc.setFont("helvetica", "normal");
  const lines = doc.splitTextToSize(summary, 182);
  doc.text(lines, 14, 98);

  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(
    "This report is generated for informational purposes and is reviewed by your therapist.",
    14,
    278
  );

  doc.save(`${title.replace(/[^\w]+/g, "-").toLowerCase()}.pdf`);
}

export function PortalReports() {
  const t = useTranslations("portal");

  return (
    <div className="glass-strong space-y-4 rounded-3xl p-6">
      <div className="mb-2 flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">{t("reports")}</h3>
      </div>
      {demoReports.map((r) => (
        <div key={r.id} className="rounded-2xl border border-border/50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold">{r.title}</p>
              <p className="text-xs text-muted-foreground">
                {r.doctor} • {r.date}
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => {
                generatePdf(r.title, r.doctor, r.date, r.diagnosis, r.summary);
                toast.success("PDF downloaded");
              }}
            >
              <Download className="h-4 w-4" />
              {t("downloadPdf")}
            </Button>
          </div>
          <p className="mt-3 text-sm font-medium text-primary">{r.diagnosis}</p>
          <p className="mt-1 text-sm text-muted-foreground">{r.summary}</p>
        </div>
      ))}
    </div>
  );
}
