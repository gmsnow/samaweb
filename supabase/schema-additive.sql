-- Sama Center — Additive schema (idempotent)
-- Adds ONLY the tables/policies missing from the live DB.
-- Legacy tables (services, appointments, invoices, notifications, users,
-- patients, sessions, ...) are preserved untouched.
-- Run: psql -v ON_ERROR_STOP=1 -f supabase\schema-additive.sql "<CONN-URI>"

create extension if not exists "pgcrypto";

-- ============================================================
-- DOCTORS
-- ============================================================
create table if not exists public.doctors (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  name_ar text,
  specialty text not null,
  specialty_ar text,
  bio text,
  photo_url text,
  experience_years integer not null default 0,
  rating numeric(3,2) not null default 5.00,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.doctors enable row level security;

-- ============================================================
-- MEDICAL REPORTS
-- NOTE: appointment_id intentionally has NO foreign key — the legacy
-- public.appointments table uses text ids incompatible with uuid.
-- ============================================================
create table if not exists public.medical_reports (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  doctor_id uuid references public.doctors(id) on delete set null,
  appointment_id uuid,
  title text not null,
  summary text,
  diagnosis text,
  treatment_plan text,
  prescription jsonb default '{}'::jsonb,
  progress_notes text,
  pdf_url text,
  created_at timestamptz not null default now()
);

alter table public.medical_reports enable row level security;

-- ============================================================
-- EXERCISE PROGRAMS
-- ============================================================
create table if not exists public.exercise_programs (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  doctor_id uuid references public.doctors(id) on delete set null,
  title text not null,
  description text,
  exercises jsonb not null default '[]'::jsonb,
  assigned_at timestamptz not null default now(),
  due_date date,
  is_completed boolean not null default false
);

alter table public.exercise_programs enable row level security;

-- ============================================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================================
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

-- ============================================================
-- CONTACT MESSAGES
-- ============================================================
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  is_resolved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- ============================================================
-- BLOG POSTS
-- ============================================================
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_en text not null,
  title_ar text,
  excerpt_en text,
  excerpt_ar text,
  content_en text,
  content_ar text,
  cover_url text,
  author_id uuid references public.profiles(id) on delete set null,
  category text,
  tags text[] not null default '{}',
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.blog_posts enable row level security;

-- ============================================================
-- TESTIMONIALS
-- ============================================================
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  patient_name text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  text_en text not null,
  text_ar text,
  treatment text,
  photo_url text,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;

-- ============================================================
-- SITE REVIEWS (anonymous visitor ratings)
-- ============================================================
create table if not exists public.site_reviews (
  id uuid primary key default gen_random_uuid(),
  rating integer not null check (rating between 1 and 5),
  comment text,
  page text,
  created_at timestamptz not null default now()
);

alter table public.site_reviews enable row level security;

drop policy if exists "reviews_insert" on public.site_reviews;
create policy "reviews_insert" on public.site_reviews
  for insert with check (true);
drop policy if exists "reviews_public_read" on public.site_reviews;
create policy "reviews_public_read" on public.site_reviews
  for select using (true);
drop policy if exists "reviews_admin_all" on public.site_reviews;
create policy "reviews_admin_all" on public.site_reviews
  for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- ============================================================
-- UPDATED_AT TRIGGER (profiles already exists)
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- ============================================================
-- AUTH PROFILE TRIGGER (idempotent)
-- ============================================================
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY POLICIES (idempotent)
-- ============================================================

-- Profiles: user manages own, admins see all
drop policy if exists "profiles_own" on public.profiles;
create policy "profiles_own" on public.profiles
  for all using (auth.uid() = id);
drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all" on public.profiles
  for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Doctors: public read
drop policy if exists "doctors_read" on public.doctors;
create policy "doctors_read" on public.doctors for select using (true);
drop policy if exists "doctors_admin_write" on public.doctors;
create policy "doctors_admin_write" on public.doctors for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Reports: patient or admin/therapist
drop policy if exists "reports_patient" on public.medical_reports;
create policy "reports_patient" on public.medical_reports
  for all using (patient_id = auth.uid());
drop policy if exists "reports_staff" on public.medical_reports;
create policy "reports_staff" on public.medical_reports
  for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'therapist')));

-- Exercises: patient or staff
drop policy if exists "exercises_patient" on public.exercise_programs;
create policy "exercises_patient" on public.exercise_programs
  for all using (patient_id = auth.uid());
drop policy if exists "exercises_staff" on public.exercise_programs;
create policy "exercises_staff" on public.exercise_programs
  for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'therapist')));

-- Newsletter: allow anon insert, admin read
drop policy if exists "newsletter_insert" on public.newsletter_subscribers;
create policy "newsletter_insert" on public.newsletter_subscribers
  for insert with check (true);
drop policy if exists "newsletter_admin_read" on public.newsletter_subscribers;
create policy "newsletter_admin_read" on public.newsletter_subscribers
  for select using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Contact: allow anon insert, admin read
drop policy if exists "contact_insert" on public.contact_messages;
create policy "contact_insert" on public.contact_messages
  for insert with check (true);
drop policy if exists "contact_admin_read" on public.contact_messages;
create policy "contact_admin_read" on public.contact_messages
  for select using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Blog: public read published, staff write
drop policy if exists "blog_read" on public.blog_posts;
create policy "blog_read" on public.blog_posts for select using (is_published = true);
drop policy if exists "blog_staff_write" on public.blog_posts;
create policy "blog_staff_write" on public.blog_posts for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'therapist')));

-- Testimonials: public read, staff write
drop policy if exists "testimonials_read" on public.testimonials;
create policy "testimonials_read" on public.testimonials for select using (true);
drop policy if exists "testimonials_staff_write" on public.testimonials;
create policy "testimonials_staff_write" on public.testimonials for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'therapist')));
