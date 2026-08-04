"use client";

import * as React from "react";
import { motion, useInView, animate } from "framer-motion";

interface StatItem {
  value: number;
  suffix?: string;
  label: string;
}

interface StatsCounterProps {
  stats: StatItem[];
  locale?: string;
}

function Counter({ to, suffix = "", locale = "en" }: { to: number; suffix?: string; locale?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  const formatted = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US").format(
    display
  );

  return (
    <span ref={ref} className="tabular-nums">
      {formatted}
      {suffix}
    </span>
  );
}

export function StatsCounter({ stats, locale = "en" }: StatsCounterProps) {
  return (
    <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-2xl border border-border/60 bg-background/60 p-6 text-center backdrop-blur-sm"
        >
          <div className="text-3xl font-bold text-gradient sm:text-4xl">
            <Counter to={stat.value} suffix={stat.suffix} locale={locale} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
