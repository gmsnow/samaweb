"use client";

import * as React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={200}>
      <SmoothScrollInner>{children}</SmoothScrollInner>
    </TooltipProvider>
  );
}

import { SmoothScrollProvider } from "@/components/providers/smooth-scroll";

function SmoothScrollInner({ children }: { children: React.ReactNode }) {
  return <SmoothScrollProvider>{children}</SmoothScrollProvider>;
}
