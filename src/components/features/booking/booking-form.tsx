"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Calendar, CheckCircle2, ChevronLeft, ChevronRight, Loader2, User, Dumbbell, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { services } from "@/data/content";
import { fetchLiveServices, fetchLiveEmployees, formatPrice, type LiveService, type LiveEmployee } from "@/lib/data/live";
import { logger } from "@/lib/logger";

const STEPS = [
  { icon: User, key: "step1" },
  { icon: Dumbbell, key: "step2" },
  { icon: Clock, key: "step3" },
  { icon: CheckCircle2, key: "step4" },
];

const formSchema = z.object({
  firstName: z.string().min(2, "required"),
  lastName: z.string().min(2, "required"),
  phone: z.string().min(8, "invalidPhone"),
  message: z.string().optional(),
  service: z.string().min(1, "required"),
  doctor: z.string().min(1, "required"),
  date: z.string().min(1, "required"),
  time: z.string().min(1, "required"),
});

type FormValues = z.infer<typeof formSchema>;

const TIME_SLOTS = [
  "09:00", "09:45", "10:30", "11:15", "12:00",
  "14:00", "14:45", "15:30", "16:15", "17:00", "17:45",
];

function getNextDays(count: number) {
  const days: { iso: string; weekday: string; day: number; month: string }[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const dow = d.getDay();
    if (dow === 0) continue;
    days.push({
      iso: d.toISOString().slice(0, 10),
      weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
      day: d.getDate(),
      month: d.toLocaleDateString("en-US", { month: "short" }),
    });
  }
  return days.slice(0, 10);
}

export function BookingForm() {
  const locale = useLocale();
  const t = useTranslations("appointment");
  const [step, setStep] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [selectedTime, setSelectedTime] = React.useState("");
  const [liveServices, setLiveServices] = React.useState<LiveService[] | null>(null);
  const [liveEmployees, setLiveEmployees] = React.useState<LiveEmployee[] | null>(null);

  React.useEffect(() => {
    let active = true;
    fetchLiveServices().then((list) => {
      if (active && list.length > 0) setLiveServices(list);
    });
    fetchLiveEmployees().then((list) => {
      if (active && list.length > 0) setLiveEmployees(list);
    });
    return () => {
      active = false;
    };
  }, []);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      service: "",
      doctor: "",
      date: "",
      time: "",
    },
  });

  const serviceSlug = useWatch({ control, name: "service" });
  const doctorId = useWatch({ control, name: "doctor" });
  const date = useWatch({ control, name: "date" });
  const firstName = useWatch({ control, name: "firstName" });
  const lastName = useWatch({ control, name: "lastName" });
  const selectedService = liveServices
    ? liveServices.find((s) => s.id === serviceSlug)
    : services.find((s) => s.slug === serviceSlug);
  const doctorOptions = liveEmployees ?? [];
  const selectedDoctor = doctorOptions.find((d) => d.id === doctorId);
  const serviceOptions = React.useMemo(
    () =>
      liveServices
        ? liveServices.map((s) => ({
            value: s.id,
            label: s.name,
            sub: `${formatPrice(s.price, locale)} ${locale === "ar" ? "ريال" : "YER"}`,
          }))
        : services.map((s) => ({
            value: s.slug,
            label: s.name.en,
            sub: s.desc.en,
          })),
    [liveServices, locale]
  );
  const serviceDisplayName =
    selectedService == null
      ? "—"
      : typeof selectedService.name === "string"
        ? selectedService.name
        : selectedService.name.en;
  const days = React.useMemo(() => getNextDays(16), []);

  const goNext = () => {
    const labels = ["firstName", "service", "date"];
    const values = [getValues("firstName"), serviceSlug, date];
    if (step === 2 && !selectedTime) {
      toast.error(t("selectTime"));
      return;
    }
    if (!values[step] && step < 3) {
      toast.error(t(labels[step] === "firstName" ? "required" : "selectService"));
      return;
    }
    setStep((s) => Math.min(s + 1, 3));
  };

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          time: selectedTime,
          serviceName: serviceDisplayName === "—" ? data.service : serviceDisplayName,
          doctorName: selectedDoctor?.name ?? data.doctor,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setDone(true);
      toast.success(t("success"));
    } catch (err) {
      logger.error("booking", "Appointment submit failed", err);
      toast.error(t("error") ?? "Something went wrong. Please try again.");
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-strong mx-auto max-w-lg rounded-3xl p-10 text-center"
      >
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold">{t("success")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("successText")}</p>
        <button
          type="button"
          onClick={() => {
            setDone(false);
            setStep(0);
            setSelectedTime("");
          }}
          className="mt-6 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-transform hover:scale-105"
        >
          {t("bookAnother")}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="glass-strong mx-auto max-w-2xl rounded-3xl p-6 sm:p-8">
      <div className="mb-8 flex items-center justify-between">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const active = i === step;
          const completed = i < step;
          return (
            <React.Fragment key={s.key}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all ${
                    completed
                      ? "bg-emerald-500/15 text-emerald-500"
                      : active
                        ? "bg-primary text-white shadow-lg shadow-primary/30"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`hidden text-xs font-medium sm:block ${
                    active ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {t(s.key)}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="mx-1 h-px flex-1 bg-border">
                  <div
                    className="h-px bg-primary transition-all duration-500"
                    style={{ width: completed ? "100%" : "0%" }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="s0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t("firstName")}</Label>
                  <Input id="firstName" {...register("firstName")} placeholder="John" />
                  {errors.firstName && (
                    <p className="text-xs text-red-500">{t(errors.firstName.message ?? "required")}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t("lastName")}</Label>
                  <Input id="lastName" {...register("lastName")} placeholder="Doe" />
                  {errors.lastName && (
                    <p className="text-xs text-red-500">{t(errors.lastName.message ?? "required")}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t("phone")}</Label>
                <Input id="phone" type="tel" dir="ltr" {...register("phone")} placeholder="+966 5X XXX XXXX" />
                {errors.phone && (
                  <p className="text-xs text-red-500">{t(errors.phone.message ?? "invalidPhone")}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">{t("message")}</Label>
                <Textarea id="message" rows={3} {...register("message")} />
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div>
                <Label className="mb-2 block">{t("selectService")}</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {serviceOptions.map((s) => {
                    const selected = serviceSlug === s.value;
                    return (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => setValue("service", s.value)}
                        className={`rounded-2xl border p-3 text-start transition-all ${
                          selected
                            ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                            : "border-border/50 hover:border-primary/40"
                        }`}
                      >
                        <p className="text-sm font-semibold">{s.label}</p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                          {s.sub}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <Label className="mb-2 block">{t("selectDoctor")}</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {doctorOptions.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setValue("doctor", d.id)}
                      className={`flex items-center gap-3 rounded-2xl border p-3 text-start transition-all ${
                        doctorId === d.id
                          ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                          : "border-border/50 hover:border-primary/40"
                      }`}
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-accent text-xs font-bold text-white">
                        {d.name.split(" ").slice(0, 2).map((x) => x[0]).join("")}
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{d.name}</p>
                        <p className="text-xs text-muted-foreground">{d.department ?? ""}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div>
                <Label className="mb-2 block flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {t("selectDate")}
                </Label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {days.map((d) => (
                    <button
                      key={d.iso}
                      type="button"
                      onClick={() => setValue("date", d.iso)}
                      className={`flex flex-col items-center rounded-2xl border py-3 transition-all ${
                        date === d.iso
                          ? "border-primary bg-primary text-white shadow-lg shadow-primary/30"
                          : "border-border/50 hover:border-primary/40"
                      }`}
                    >
                      <span className="text-[10px] font-semibold uppercase opacity-70">{d.weekday}</span>
                      <span className="text-xl font-bold">{d.day}</span>
                      <span className="text-[10px] opacity-70">{d.month}</span>
                    </button>
                  ))}
                </div>
              </div>

              {date && (
                <div>
                  <Label className="mb-2 block">{t("selectTime")}</Label>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`rounded-xl border py-2 text-sm font-medium transition-all ${
                          selectedTime === slot
                            ? "border-primary bg-primary text-white"
                            : "border-border/50 hover:border-primary/40"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="s3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <h3 className="font-semibold">{t("details")}</h3>
              <dl className="space-y-3 rounded-2xl bg-muted/40 p-5 text-sm">
                <Row label={t("personal")} value={`${firstName ?? ""} ${lastName ?? ""}`} />
                <Row label={t("service")} value={serviceDisplayName} />
                <Row label={t("doctor")} value={selectedDoctor?.name ?? "—"} />
                <Row label={t("date")} value={date} />
                <Row label={t("time")} value={selectedTime} />
              </dl>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between gap-3">
          {step > 0 ? (
            <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)}>
              <ChevronLeft className="h-4 w-4" />
              {t("back")}
            </Button>
          ) : (
            <span />
          )}
          {step < 3 ? (
            <Button type="button" onClick={goNext}>
              {t("next")}
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {t("confirm")}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}
