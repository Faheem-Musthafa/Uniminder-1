-- update_profiles.sql
-- Updated schema to match the API route expectations

-- Drop the existing table if you want to start fresh
-- DROP TABLE IF EXISTS profiles;

-- Create the updated profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id text primary key,            -- Use Clerk user ID directly as primary key
  user_id text unique,           -- Keep for backward compatibility
  email text,                    -- User email
  role text not null,           -- student, alumni, aspirant
  full_name text not null,      -- Full name (required)
  location text,                -- Location (optional)
  college text,                 -- College/University
  degree text,                  -- Degree type (Bachelor's, Master's, etc.)
  branch text,                  -- Branch/Major
  passing_year text,            -- Graduation/Expected year
  company text,                 -- Current company (for alumni)
  designation text,             -- Job title (for alumni)
  entrance_exam text,           -- Target exam (for aspirants)
  target_college text,          -- Target college (for aspirants)
  linkedin text,                -- LinkedIn profile URL
  skills text,                  -- Skills and interests
  bio text,                     -- Brief bio
  onboarded boolean default false, -- Onboarding status
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_onboarded ON profiles(onboarded);

-- If you're migrating from the old schema, use this migration:
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email text;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name text;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location text;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS college text;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS degree text;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS branch text;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS passing_year text;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company text;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS designation text;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS entrance_exam text;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS target_college text;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS linkedin text;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS skills text;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio text;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at timestamptz default now();

-- Update the role column to be NOT NULL if it isn't already
-- ALTER TABLE profiles ALTER COLUMN role SET NOT NULL;

-- Rename name to full_name if needed
-- ALTER TABLE profiles RENAME COLUMN name TO full_name;

-- Update the primary key to use Clerk user ID (if migrating)
-- ALTER TABLE profiles DROP CONSTRAINT profiles_pkey;
-- UPDATE profiles SET id = user_id WHERE id != user_id;
-- ALTER TABLE profiles ADD PRIMARY KEY (id);
