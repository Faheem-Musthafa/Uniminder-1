-- ============================================
-- UniMinder Database Initialization Script
-- Part 1: Core Schema Setup
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('student', 'alumni', 'aspirant', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.post_type AS ENUM ('job', 'referral', 'update', 'question', 'resource');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.interaction_type AS ENUM ('like', 'bookmark', 'apply', 'view');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.notification_type AS ENUM ('message', 'post_like', 'post_comment', 'mentorship_request', 'mentorship_accepted', 'system');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.verification_status AS ENUM ('pending', 'submitted', 'under_review', 'approved', 'rejected', 'resubmit');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- Core Tables
-- ============================================

-- Profiles table (main user data)
CREATE TABLE IF NOT EXISTS public.profiles (
    id text PRIMARY KEY,
    user_id text UNIQUE NOT NULL,
    email text UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    full_name text NOT NULL,
    avatar_url text,
    
    -- Basic info
    location text,
    phone text,
    bio text,
    
    -- Education details
    college text,
    degree text,
    branch text,
    passing_year text,
    graduation_year integer,
    
    -- Professional details (for alumni)
    company text,
    designation text,
    current_position text,
    experience_years integer,
    years_of_experience integer,
    
    -- Aspirant details
    entrance_exam text,
    target_college text,
    
    -- Profile enhancements
    linkedin text,
    linkedin_url text,
    github_url text,
    website_url text,
    skills text[] DEFAULT '{}',
    interests text[] DEFAULT '{}',
    looking_for text[] DEFAULT '{}',
    specializations text[] DEFAULT '{}',
    mentorship_areas text[] DEFAULT '{}',
    preferred_communication text[] DEFAULT '{}',
    availability text,
    
    -- Status and verification
    onboarded boolean DEFAULT false,
    is_verified boolean DEFAULT false,
    is_active boolean DEFAULT true,
    verification_status verification_status DEFAULT 'pending',
    verification_method text CHECK (verification_method IN ('id_card', 'phone', 'document')),
    phone_verified boolean DEFAULT false,
    verification_notes text,
    verified_at timestamptz,
    verification_submitted_at timestamptz,
    
    -- Profile image
    profile_image_url text,
    
    -- Timestamps
    last_seen timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    -- Constraints
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create indexes on profiles
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_role_active ON public.profiles(role, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_profiles_verification_status ON public.profiles(verification_status) WHERE verification_status != 'approved';

-- Add comments for documentation
COMMENT ON TABLE public.profiles IS 'Main user profiles table storing all user information';
COMMENT ON COLUMN public.profiles.id IS 'Primary key, matches Clerk user ID';
COMMENT ON COLUMN public.profiles.user_id IS 'Clerk user ID for authentication';
COMMENT ON COLUMN public.profiles.role IS 'User role: student, alumni, aspirant, or admin';
