import type { ReactNode } from "react";
import Script from "next/script";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Script id="sama-theme-init" src="/theme-init.js" strategy="beforeInteractive" />
      {children}
    </>
  );
}
