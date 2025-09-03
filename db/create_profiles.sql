-- create_profiles.sql

-- Run this in Supabase SQL editor or psql connected to your Supabase DB

create table if not exists profiles (
  id uuid default gen_random_uuid() primary key,
  user_id text not null unique,
  name text,
  onboarded boolean default false,
  created_at timestamptz default now()
);
