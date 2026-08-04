import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maintenance | Sama Center",
  description: "We are currently undergoing scheduled maintenance.",
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <div className="relative flex min-h-[70vh] items-center justify-center px-4 text-center">
      <div className="pointer-events-none absolute start-1/4 top-1/3 h-80 w-80 rounded-full bg-brand/10 blur-3xl" />
      <div className="glass-strong max-w-lg rounded-3xl p-12">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/15">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-9 w-9 text-amber-500">
            <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold">Under Maintenance</h1>
        <p className="mt-3 text-muted-foreground">
          We are performing scheduled maintenance. Please check back in a few minutes.
        </p>
        <a
          href="mailto:sama.center.pt@gmail.com"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-transform hover:scale-105"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}
