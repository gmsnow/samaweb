-- Sama Center — RLS recursion fix
-- The profiles_admin_all policy queried profiles from within a profiles policy
-- (infinite recursion, Postgres error 42P17). Replaced with SECURITY DEFINER
-- helper functions that bypass RLS on profiles.
-- Run: psql -v ON_ERROR_STOP=1 -f supabase\schema-fix.sql "<CONN-URI>"

-- ============================================================
-- HELPER FUNCTIONS (bypass RLS via security definer)
-- ============================================================
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

create or replace function public.is_staff()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'therapist')
  );
$$;

-- ============================================================
-- REPLACE RECURSIVE POLICIES
-- ============================================================

drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all" on public.profiles
  for all using (public.is_admin());

drop policy if exists "doctors_admin_write" on public.doctors;
create policy "doctors_admin_write" on public.doctors
  for all using (public.is_admin());

drop policy if exists "reports_staff" on public.medical_reports;
create policy "reports_staff" on public.medical_reports
  for all using (public.is_staff());

drop policy if exists "exercises_staff" on public.exercise_programs;
create policy "exercises_staff" on public.exercise_programs
  for all using (public.is_staff());

drop policy if exists "newsletter_admin_read" on public.newsletter_subscribers;
create policy "newsletter_admin_read" on public.newsletter_subscribers
  for select using (public.is_admin());

drop policy if exists "contact_admin_read" on public.contact_messages;
create policy "contact_admin_read" on public.contact_messages
  for select using (public.is_admin());

drop policy if exists "blog_staff_write" on public.blog_posts;
create policy "blog_staff_write" on public.blog_posts
  for all using (public.is_staff());

drop policy if exists "testimonials_staff_write" on public.testimonials;
create policy "testimonials_staff_write" on public.testimonials
  for all using (public.is_staff());
