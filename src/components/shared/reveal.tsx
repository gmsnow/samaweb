"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "none";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  once?: boolean;
  distance?: number;
}

const offsetByDirection: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 40 },
  down: { x: 0, y: -40 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
  none: { x: 0, y: 0 },
};

export function Reveal({
  children,
  className,
  id,
  direction = "up",
  delay = 0,
  duration = 0.7,
  once = true,
  distance,
}: RevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-80px" });
  const offset = offsetByDirection[direction];
  const dist = distance ?? 40;

  return (
    <motion.div
      id={id}
      ref={ref}
      initial={{
        opacity: 0,
        x: offset.x ? Math.sign(offset.x) * dist : 0,
        y: offset.y ? Math.sign(offset.y) * dist : 0,
      }}
      animate={
        inView
          ? { opacity: 1, x: 0, y: 0 }
          : {
              opacity: 0,
              x: offset.x ? Math.sign(offset.x) * dist : 0,
              y: offset.y ? Math.sign(offset.y) * dist : 0,
            }
      }
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}
