"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { CheckCircle2, Dumbbell, PlayCircle } from "lucide-react";
import { demoPrograms } from "@/data/portal";

export function PortalExercises() {
  const t = useTranslations("portal");
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const toggle = (programId: string, exerciseId: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(exerciseId)) {
        next.delete(exerciseId);
      } else {
        next.add(exerciseId);
      }
      const program = demoPrograms.find((p) => p.id === programId);
      if (program) {
        const allDone = program.exercises.every((e) => next.has(e.id));
        if (allDone) toast.success(`Program "${program.title}" completed! 🎉`);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {demoPrograms.map((program) => {
        const doneCount = program.exercises.filter((e) => completed.has(e.id)).length;
        return (
          <div key={program.id} className="glass-strong rounded-3xl p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Dumbbell className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold">{program.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {program.doctor} • {program.assignedAt}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                {doneCount}/{program.exercises.length} {t("sessionsCompleted").toLowerCase()}
              </span>
            </div>

            <div className="space-y-2">
              {program.exercises.map((ex) => {
                const isDone = completed.has(ex.id);
                return (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => toggle(program.id, ex.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-start transition-colors ${
                      isDone
                        ? "border-emerald-500/40 bg-emerald-500/10"
                        : "border-border/50 bg-muted/20 hover:bg-muted/40"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                    ) : (
                      <PlayCircle className="h-5 w-5 shrink-0 text-primary" />
                    )}
                    <div className="flex-1">
                      <p className={`font-medium ${isDone ? "line-through opacity-70" : ""}`}>
                        {ex.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {ex.sets} × {ex.reps} — {ex.notes}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
