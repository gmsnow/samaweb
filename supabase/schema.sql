-- Sama Center — Database Schema
-- Run in Supabase SQL editor. Order matters: functions before triggers.

create extension if not exists "pgcrypto";

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  avatar_url text,
  role text not null default 'patient' check (role in ('patient', 'therapist', 'admin')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- SERVICES
-- ============================================================
create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_en text not null,
  name_ar text not null,
  description_en text not null,
  description_ar text not null,
  icon text,
  price numeric(10,2) not null default 0,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.services enable row level security;

-- ============================================================
-- DOCTORS
-- ============================================================
create table public.doctors (
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
-- BOOKINGS / APPOINTMENTS
-- ============================================================
create type public.appointment_status as enum ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');
create type public.appointment_type as enum ('in_person', 'home_visit', 'virtual');

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  service_id uuid references public.services(id) on delete set null,
  doctor_id uuid references public.doctors(id) on delete set null,
  status appointment_status not null default 'pending',
  appointment_type appointment_type not null default 'in_person',
  scheduled_at timestamptz not null,
  duration_minutes integer not null default 45,
  notes text,
  first_name text,
  last_name text,
  phone text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.appointments enable row level security;

-- ============================================================
-- MEDICAL REPORTS
-- ============================================================
create table public.medical_reports (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  doctor_id uuid references public.doctors(id) on delete set null,
  appointment_id uuid references public.appointments(id) on delete set null,
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
create table public.exercise_programs (
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
-- INVOICES
-- ============================================================
create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  appointment_id uuid references public.appointments(id) on delete set null,
  amount numeric(10,2) not null,
  currency text not null default 'YER',
  status text not null default 'unpaid' check (status in ('unpaid', 'paid', 'refunded', 'partially_paid')),
  description text,
  issued_at timestamptz not null default now(),
  paid_at timestamptz
);

alter table public.invoices enable row level security;

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null default 'info',
  title text not null,
  body text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

-- ============================================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================================
create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

-- ============================================================
-- CONTACT MESSAGES
-- ============================================================
create table public.contact_messages (
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
create table public.blog_posts (
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
create table public.testimonials (
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
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Profiles: user manages own, admins see all
create policy "profiles_own" on public.profiles
  for all using (auth.uid() = id);
create policy "profiles_admin_all" on public.profiles
  for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Services/Doctors: public read
create policy "services_read" on public.services for select using (true);
create policy "services_admin_write" on public.services for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "doctors_read" on public.doctors for select using (true);
create policy "doctors_admin_write" on public.doctors for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Appointments: patient or admin
create policy "appointments_patient" on public.appointments
  for all using (patient_id = auth.uid());
create policy "appointments_admin" on public.appointments
  for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Reports: patient or admin/therapist
create policy "reports_patient" on public.medical_reports
  for all using (patient_id = auth.uid());
create policy "reports_staff" on public.medical_reports
  for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'therapist')));

-- Exercises: patient or staff
create policy "exercises_patient" on public.exercise_programs
  for all using (patient_id = auth.uid());
create policy "exercises_staff" on public.exercise_programs
  for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'therapist')));

-- Invoices: patient or admin
create policy "invoices_patient" on public.invoices
  for all using (patient_id = auth.uid());
create policy "invoices_admin" on public.invoices
  for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Notifications: own user
create policy "notifications_own" on public.notifications
  for all using (user_id = auth.uid());

-- Newsletter/Contact: allow anon insert
create policy "newsletter_insert" on public.newsletter_subscribers
  for insert with check (true);
create policy "newsletter_admin_read" on public.newsletter_subscribers
  for select using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "contact_insert" on public.contact_messages
  for insert with check (true);
create policy "contact_admin_read" on public.contact_messages
  for select using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Blog: public read, staff write
create policy "blog_read" on public.blog_posts for select using (is_published = true);
create policy "blog_staff_write" on public.blog_posts for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'therapist')));

-- Testimonials: public read, staff write
create policy "testimonials_read" on public.testimonials for select using (true);
create policy "testimonials_staff_write" on public.testimonials for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'therapist')));

-- ============================================================
-- UPDATED_AT TRIGGER
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

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger appointments_updated_at before update on public.appointments
  for each row execute function public.set_updated_at();
