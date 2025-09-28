-- Migration: Extend profiles for modern onboarding
-- Run in Supabase SQL editor

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS years_of_experience integer,
  ADD COLUMN IF NOT EXISTS interests text[],
  ADD COLUMN IF NOT EXISTS looking_for text[],
  ADD COLUMN IF NOT EXISTS preferences jsonb,
  ADD COLUMN IF NOT EXISTS social jsonb;

-- Optional indexes for array lookups
CREATE INDEX IF NOT EXISTS idx_profiles_interests ON profiles USING GIN (interests);
CREATE INDEX IF NOT EXISTS idx_profiles_looking_for ON profiles USING GIN (looking_for);
