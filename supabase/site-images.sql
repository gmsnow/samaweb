-- Site image changer setup
-- Run this once in Supabase Dashboard -> SQL Editor (service role).
-- Creates a public storage bucket + a small overrides table.
-- Does NOT touch legacy tables (read-only legacy DB stays untouched).

-- 1) Storage bucket (public so image URLs are permanent & cacheable)
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

-- 2) Overrides table: slot -> public image url + storage path
create table if not exists public.site_images (
  slot       text primary key,
  url        text not null,
  path       text not null,
  updated_at timestamptz default now()
);

alter table public.site_images enable row level security;

-- Public read: any visitor can read overrides (used by GET /api/site-images)
drop policy if exists "public read site_images" on public.site_images;
create policy "public read site_images"
  on public.site_images for select
  using (true);

-- Writes only via service role key (used by POST/DELETE /api/site-images)
drop policy if exists "service write site_images" on public.site_images;
create policy "service write site_images"
  on public.site_images for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
