-- ===================================================================
-- MoveAbroad SG — Supabase PostgreSQL Database Schema
-- Version: 1.0 (MVP-1)
-- ===================================================================

-- 1. Profiles Table (linked to auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  interest_tags text[] not null default '{}',
  created_at timestamptz default now()
);

-- Enable RLS for profiles
alter table profiles enable row level security;

-- Profiles Policies: Users can read and write only their own profile
create policy "Users can view own profile" 
  on profiles for select 
  using (auth.uid() = id);

create policy "Users can insert own profile" 
  on profiles for insert 
  with check (auth.uid() = id);

create policy "Users can update own profile" 
  on profiles for update 
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 2. Groups Table (Publicly readable, seeded manually by admin)
create table if not exists groups (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  interest_tag text not null check (interest_tag in
    ('food','outdoors','arts','sports','professional','language','other')),
  description text,
  external_link text not null,
  next_event_at timestamptz
);

-- Enable RLS for groups
alter table groups enable row level security;

-- Groups Policies: Public read access, no client write access
create policy "Groups are viewable by everyone" 
  on groups for select 
  using (true);

-- 3. RSVPs Table (Users RSVP to groups)
create table if not exists rsvps (
  user_id uuid references auth.users(id) on delete cascade,
  group_id uuid references groups(id) on delete cascade,
  status text not null check (status in ('going','interested','cancelled')),
  created_at timestamptz default now(),
  primary key (user_id, group_id)
);

-- Enable RLS for rsvps
alter table rsvps enable row level security;

-- RSVPs Policies: Users can read, insert, update, or delete only their own RSVPs
create policy "Users can view own rsvps" 
  on rsvps for select 
  using (auth.uid() = user_id);

create policy "Users can insert own rsvps" 
  on rsvps for insert 
  with check (auth.uid() = user_id);

create policy "Users can update own rsvps" 
  on rsvps for update 
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own rsvps" 
  on rsvps for delete 
  using (auth.uid() = user_id);

-- Indexes for performance
create index if not exists idx_groups_interest_tag on groups(interest_tag);
create index if not exists idx_rsvps_user_id on rsvps(user_id);
create index if not exists idx_rsvps_group_id on rsvps(group_id);
