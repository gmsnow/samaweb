"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Phone } from "lucide-react";
import { siteConfig } from "@/config/site";

export function EmergencyCall() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="fixed end-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-2 lg:flex">
      <AnimatePresence>
        {open ? (
          <motion.a
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            href={`tel:${siteConfig.emergency.replace(/[^+\d]/g, "")}`}
            className="glass-strong rounded-2xl px-4 py-3 text-center text-sm font-semibold shadow-soft"
          >
            <span className="block text-xs text-destructive">Emergency</span>
            {siteConfig.emergency}
          </motion.a>
        ) : null}
      </AnimatePresence>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Emergency call"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive text-white shadow-lift transition-transform hover:scale-110"
      >
        <Phone className="h-5 w-5" />
      </button>
    </div>
  );
}
