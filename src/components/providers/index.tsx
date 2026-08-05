"use client";

import * as React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RatingModal } from "@/components/shared/rating-modal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={200}>
      <RatingModal />
      <SmoothScrollInner>{children}</SmoothScrollInner>
    </TooltipProvider>
  );
}

import { SmoothScrollProvider } from "@/components/providers/smooth-scroll";

function SmoothScrollInner({ children }: { children: React.ReactNode }) {
  return <SmoothScrollProvider>{children}</SmoothScrollProvider>;
}
