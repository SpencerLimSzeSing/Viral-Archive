-- VIRAL ARCHIVE: Supabase PostgreSQL Schema
-- Run this SQL in your Supabase Dashboard -> SQL Editor.

create table if not exists viral_videos (
  id text primary key default gen_random_uuid()::text,

  -- A. Original Video & Media References (never store raw video files)
  platform text not null check (platform in ('TikTok', 'Instagram', 'Facebook', 'YouTube', 'X')),
  original_url text not null,
  embed_url text,
  thumbnail_url text not null default '',

  -- C. Video Information
  title text not null,
  description text not null default '',
  uploader text not null,
  country text not null default 'Malaysia',
  date_added date not null default current_date,
  categories text[] not null default '{}',
  tags text[] not null default '{}',

  -- B. Archival Context ("Why you should laugh?")
  what_happened text not null,      -- The story behind the video: brief explanation of the incident
  background_story text not null,   -- What led to this moment?
  additional_context text not null default '', -- Other angles, original footage, or follow-ups

  -- Curation control (only published rows are visible to public visitors)
  is_published boolean not null default true
);

create index if not exists viral_videos_date_added_idx
  on viral_videos (date_added desc);

create index if not exists viral_videos_country_idx
  on viral_videos (country);

-- Enable Row Level Security so visitors can only read published rows,
-- while only you (in Supabase Dashboard / service role) can add or edit entries.
alter table viral_videos enable row level security;

drop policy if exists "Public can view published viral videos" on viral_videos;
create policy "Public can view published viral videos"
  on viral_videos
  for select
  to anon, authenticated
  using (is_published = true);
