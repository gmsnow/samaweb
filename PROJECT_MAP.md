# PROJECT_MAP — Sama Center (Physical Therapy & Rehabilitation)

> Live state map. Update after every milestone. Anything not wired appears in `[ORPHANS & PENDING]` and is removed once complete.

## [TECH_STACK]

| Layer | Choice | Version |
|---|---|---|
| Framework | Next.js 16 (App Router, Webpack build — Turbopack native unavailable on host) | 16.2.12 |
| Language | TypeScript | 5.9.3 |
| Styling | Tailwind CSS v4 (+ `@theme` tokens) | 4.3.3 |
| Motion | Framer Motion + GSAP | 12.43.0 / 3.15.0 |
| 3D | Three.js + React Three Fiber + Drei (stylized procedural, per decision) | 0.185.1 / 9.7.0 / 10.7.7 |
| Smooth scroll | Lenis | 1.3.25 |
| i18n | next-intl (en/ar, RTL/LTR, `localePrefix: always`) | 4.13.4 |
| BaaS | Supabase (auth + DB) — graceful fallback when keys absent | @supabase/ssr 0.12.4 |
| AI Chat | Real LLM via OpenAI-compatible endpoint (env-gated) | — |
| UI Kit | Hand-written shadcn-style (Radix primitives + CVA) | — |
| Forms | React Hook Form + Zod v4 + @hookform/resolvers | — |
| Carousel | Embla | 8.6.0 |
| Charts | Recharts | 3.10.1 |
| Toasts | sonner | 2.0.7 |
| Icons | lucide-react (brand icons replaced with inline SVG) | 1.28.0 |

**Constraints found:**
- Turbopack + SWC native binding broken on host (cross-drive corruption / platform) → `--webpack` build scripts. SWC package was reinstalled to fix corruption.
- lucide-react v1 removed brand icons → `src/components/shared/social-icons.tsx`.
- Next 16 `cookies()` is async → `createClient` is async.
- Next 16 deprecates `middleware.ts` → file is `src/proxy.ts`.

## [SYSTEM_FLOW]

Three verified user paths (only scope allowed):

1. **Visitor → Conversion**: `/` (hero→services→doctors→testimonials) → `/appointment` (multi-step form: details → service/doctor → date/time → confirm) → success screen. Optional contact/WhatsApp.
2. **Patient**: `/portal/auth` (login/register/forgot) → `/portal/dashboard` → appointments / reports (PDF) / exercises / invoices / notifications / profile.
3. **Admin**: `/admin` (session-gated) → analytics / appointments / doctors / patients / finance / reports / notifications.

Locale routing: every route under `/[locale]`, `dir=rtl` when ar, SSG per locale.

## [ARCHITECTURE]

```
src/
  app/                     # [locale]/... routes (SSG per locale), api/, portal/, admin/
  components/
    ui/                    # shadcn-style primitives (Radix + CVA)
    shared/                # Navbar, Footer, MagneticButton, Reveal, cursor, whatsapp, etc.
    features/              # home/* sections, booking, portal, admin
    three/                 # R3F scenes (hero, spine, skeleton, knee, shoulder, brain, viewer)
  i18n/                    # routing, navigation, request
  lib/                     # utils(cn), logger, supabase (client/server/proxy)
  config/                  # site.ts, env validation
  db/                      # supabase schema + seed (SQL)
  data/                    # static domain data (doctors, services, testimonials, blog)
messages/                  # en.json, ar.json (typed dictionaries)
```

- Server Components first; `"use client"` only for interactive layers.
- No micro-files; features are cohesive modules.
- Logging: async, 4 levels, prod-suppressed, via `src/lib/logger.ts`.
- Supabase optional: `NEXT_PUBLIC_SUPABASE_URL/KEY` env-gated, demo fallback layer.

## [ORPHANS & PENDING]

- [x] M1: complete (i18n AR/EN verified via smoke test; RTL OK; cookie/back-to-top/whatsapp/emergency/search mounted).
- [x] M2: Home page complete (Hero+3D, Services, About, Treatments, Journey, Doctors, Testimonials, Gallery, Pricing, FAQ, Blog, CTA, Contact). Build+lint+SSR verified.
- [x] M3: 3D layer — hero scene (spine+DNA+glass orbs+Bloom+parallax) + interactive anatomy viewer (spine/knee/shoulder/brain/muscle procedural scenes, OrbitControls, part switcher, i18n) on `/anatomy` (SSG EN/AR). Linked from footer + search + mobile nav.
- [x] M4: Supabase schema (`supabase/schema.sql` — profiles/services/doctors/appointments/reports/exercises/invoices/notifications/newsletter/contact/blog/testimonials + RLS + triggers) + `supabase/seed.sql` + auth pages `/login` `/register` `/forgot-password` (demo-mode fallback).
- [x] M5: Patient Portal `/portal` — client auth guard (Supabase or demo localStorage), sidebar shell, dashboard stats, appointments, reports w/ jsPDF download (jspdf 4.2.1), exercise tracker, invoices. Demo data in `src/data/portal.ts`.
- [x] M6: Admin Dashboard `/admin` — client shell + analytics (AreaChart + BarChart recharts), appointments table with filter/status, doctor cards, patient table, finance view (LineChart + PieChart), notifications.
- [x] M7: Booking `/appointment` — 4-step multi-step form (react-hook-form + zod + useWatch), animated stepper, date/time selector, confirm summary + success screen. `/api/appointment` route (Zod validated, Supabase-aware).
- [x] M8: Content/SEO — `/blog` (+ 12 SSG post pages), `/contact`, `/about`, `/services`, `/doctors`, `/treatments` (+ anatomy viewer), `/gallery`, `/pricing`, `/faq`, `/maintenance`, 404 (`[locale]/not-found`), `sitemap.xml` (34 URLs), `robots.txt`, `manifest.webmanifest`, `icon.svg`.
- [x] M9: AI chat — `/api/chat` (OpenAI-compatible endpoint, env-gated `AI_API_URL/KEY/MODEL`, fallback reply) + floating `AiChatWidget` with voice input (Web Speech API, capability-detected). WhatsApp/CookieConsent/Emergency/Newsletter already mounted.
- [x] M10: QA — full 22-route smoke test (all 200, unknown → 404), APIs tested (contact 201, appointment 201, chat 200 fallback), AR content + `dir=rtl` verified, robots/sitemap live. Build + lint green.

## [DONE] All milestones implemented. Outstanding when real infra arrives:
- Provide `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` (run `supabase/schema.sql` + `seed.sql`).
- Provide `AI_API_URL`, `AI_API_KEY`, `AI_MODEL` to enable live chat replies.
- Set `SITE_URL` for canonical/sitemap base.
- Swap picsum/pravatar demo images for real media.
