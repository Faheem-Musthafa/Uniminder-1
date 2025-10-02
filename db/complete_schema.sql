-- UniMinder Complete Database Schema
-- This creates the full schema for the mentorship platform

-- Create enum for user roles
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('student', 'alumni', 'aspirant', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Profiles table (extend existing)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS skills text[],
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS linkedin_url text,
ADD COLUMN IF NOT EXISTS github_url text,
ADD COLUMN IF NOT EXISTS website_url text,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS graduation_year integer,
ADD COLUMN IF NOT EXISTS current_position text,
ADD COLUMN IF NOT EXISTS experience_years integer,
ADD COLUMN IF NOT EXISTS specializations text[],
ADD COLUMN IF NOT EXISTS availability text,
ADD COLUMN IF NOT EXISTS mentorship_areas text[],
ADD COLUMN IF NOT EXISTS preferred_communication text[],
ADD COLUMN IF NOT EXISTS profile_image_url text,
ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS last_seen timestamptz DEFAULT now();

-- Posts table for job/referral/update sharing
CREATE TABLE IF NOT EXISTS public.posts (
    id bigserial PRIMARY KEY,
    author_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type text NOT NULL CHECK (type IN ('job', 'referral', 'update', 'question', 'resource')),
    title text NOT NULL,
    content text,
    external_url text,
    company_name text,
    location text,
    salary_range text,
    experience_required text,
    tags text[] DEFAULT '{}',
    is_featured boolean DEFAULT false,
    is_active boolean DEFAULT true,
    views_count integer DEFAULT 0,
    likes_count integer DEFAULT 0,
    comments_count integer DEFAULT 0,
    applications_count integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    expires_at timestamptz
);

-- Post interactions (likes, bookmarks, applications)
CREATE TABLE IF NOT EXISTS public.post_interactions (
    id bigserial PRIMARY KEY,
    post_id bigint NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    interaction_type text NOT NULL CHECK (interaction_type IN ('like', 'bookmark', 'apply', 'view')),
    created_at timestamptz DEFAULT now(),
    UNIQUE(post_id, user_id, interaction_type)
);

-- Comments on posts
CREATE TABLE IF NOT EXISTS public.post_comments (
    id bigserial PRIMARY KEY,
    post_id bigint NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    author_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content text NOT NULL,
    parent_comment_id bigint REFERENCES public.post_comments(id) ON DELETE CASCADE,
    is_edited boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Conversations for real-time chat
CREATE TABLE IF NOT EXISTS public.conversations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text,
    type text NOT NULL CHECK (type IN ('direct', 'group')) DEFAULT 'direct',
    created_by text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Conversation participants
CREATE TABLE IF NOT EXISTS public.conversation_participants (
    conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role text DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    joined_at timestamptz DEFAULT now(),
    left_at timestamptz,
    is_muted boolean DEFAULT false,
    PRIMARY KEY (conversation_id, user_id)
);

-- Messages in conversations
CREATE TABLE IF NOT EXISTS public.messages (
    id bigserial PRIMARY KEY,
    conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content text NOT NULL,
    message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
    attachment_url text,
    reply_to_id bigint REFERENCES public.messages(id) ON DELETE SET NULL,
    is_edited boolean DEFAULT false,
    is_deleted boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Message read receipts
CREATE TABLE IF NOT EXISTS public.message_reads (
    message_id bigint NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
    user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    read_at timestamptz DEFAULT now(),
    PRIMARY KEY (message_id, user_id)
);

-- Mentorship connections
CREATE TABLE IF NOT EXISTS public.mentorship_connections (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    mentee_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status text NOT NULL CHECK (status IN ('pending', 'accepted', 'declined', 'completed', 'cancelled')) DEFAULT 'pending',
    requested_at timestamptz DEFAULT now(),
    accepted_at timestamptz,
    completed_at timestamptz,
    notes text,
    rating integer CHECK (rating >= 1 AND rating <= 5),
    feedback text,
    UNIQUE(mentor_id, mentee_id)
);

-- Notifications system
CREATE TABLE IF NOT EXISTS public.notifications (
    id bigserial PRIMARY KEY,
    user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type text NOT NULL CHECK (type IN ('message', 'post_like', 'post_comment', 'mentorship_request', 'mentorship_accepted', 'system')),
    title text NOT NULL,
    content text,
    data jsonb DEFAULT '{}',
    is_read boolean DEFAULT false,
    channel text CHECK (channel IN ('in_app', 'email', 'whatsapp')),
    status text CHECK (status IN ('queued', 'sent', 'failed', 'delivered')) DEFAULT 'queued',
    sent_at timestamptz,
    created_at timestamptz DEFAULT now()
);

-- User preferences
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id text PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    email_notifications boolean DEFAULT true,
    push_notifications boolean DEFAULT true,
    whatsapp_notifications boolean DEFAULT false,
    notification_frequency text DEFAULT 'instant' CHECK (notification_frequency IN ('instant', 'daily', 'weekly', 'never')),
    privacy_level text DEFAULT 'public' CHECK (privacy_level IN ('public', 'connections', 'private')),
    show_email boolean DEFAULT false,
    show_phone boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Reports and moderation
CREATE TABLE IF NOT EXISTS public.reports (
    id bigserial PRIMARY KEY,
    reporter_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reported_user_id text REFERENCES public.profiles(id) ON DELETE CASCADE,
    reported_post_id bigint REFERENCES public.posts(id) ON DELETE CASCADE,
    reported_message_id bigint REFERENCES public.messages(id) ON DELETE CASCADE,
    reason text NOT NULL CHECK (reason IN ('spam', 'harassment', 'inappropriate_content', 'fake_profile', 'other')),
    description text,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'resolved', 'dismissed')),
    resolved_by text REFERENCES public.profiles(id) ON DELETE SET NULL,
    resolved_at timestamptz,
    resolution_notes text,
    created_at timestamptz DEFAULT now()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_author_created ON public.posts(author_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_type_active ON public.posts(type, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_posts_tags ON public.posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON public.messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_profiles_role_active ON public.profiles(role, is_active) WHERE is_active = true;

-- RLS (Row Level Security) Policies
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (users can read public content, modify their own)
CREATE POLICY IF NOT EXISTS "Posts are publicly readable" ON public.posts FOR SELECT USING (is_active = true);
CREATE POLICY IF NOT EXISTS "Users can create their own posts" ON public.posts FOR INSERT WITH CHECK (auth.uid()::text = author_id);
CREATE POLICY IF NOT EXISTS "Users can update their own posts" ON public.posts FOR UPDATE USING (auth.uid()::text = author_id);

CREATE POLICY IF NOT EXISTS "Users can manage their own interactions" ON public.post_interactions FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY IF NOT EXISTS "Comments are publicly readable" ON public.post_comments FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Users can create comments" ON public.post_comments FOR INSERT WITH CHECK (auth.uid()::text = author_id);
CREATE POLICY IF NOT EXISTS "Users can update their own comments" ON public.post_comments FOR UPDATE USING (auth.uid()::text = author_id);

-- Conversation access based on participation
CREATE POLICY IF NOT EXISTS "Users can access their conversations" ON public.conversations FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.conversation_participants cp WHERE cp.conversation_id = id AND cp.user_id = auth.uid()::text));

CREATE POLICY IF NOT EXISTS "Users can manage their participation" ON public.conversation_participants FOR ALL 
USING (auth.uid()::text = user_id);

CREATE POLICY IF NOT EXISTS "Users can access messages in their conversations" ON public.messages FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.conversation_participants cp WHERE cp.conversation_id = conversation_id AND cp.user_id = auth.uid()::text));

CREATE POLICY IF NOT EXISTS "Users can send messages to their conversations" ON public.messages FOR INSERT 
WITH CHECK (auth.uid()::text = sender_id AND EXISTS (SELECT 1 FROM public.conversation_participants cp WHERE cp.conversation_id = conversation_id AND cp.user_id = auth.uid()::text));

CREATE POLICY IF NOT EXISTS "Users can manage their own notifications" ON public.notifications FOR ALL USING (auth.uid()::text = user_id);
CREATE POLICY IF NOT EXISTS "Users can manage their own preferences" ON public.user_preferences FOR ALL USING (auth.uid()::text = user_id);

-- Functions for common operations
CREATE OR REPLACE FUNCTION public.increment_post_views(post_id bigint)
RETURNS void AS $$
BEGIN
    UPDATE public.posts SET views_count = views_count + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.update_post_stats()
RETURNS trigger AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.interaction_type = 'like' THEN
            UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.interaction_type = 'like' THEN
            UPDATE public.posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
        END IF;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER IF NOT EXISTS update_post_stats_trigger
    AFTER INSERT OR DELETE ON public.post_interactions
    FOR EACH ROW EXECUTE FUNCTION public.update_post_stats();

-- Real-time subscriptions for conversations
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;