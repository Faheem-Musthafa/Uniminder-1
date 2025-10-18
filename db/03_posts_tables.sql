-- ============================================
-- UniMinder Database Initialization Script
-- Part 3: Posts & Content System
-- ============================================

-- Posts table (jobs, referrals, updates, questions, resources)
CREATE TABLE IF NOT EXISTS public.posts (
    id bigserial PRIMARY KEY,
    author_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type post_type NOT NULL,
    
    -- Content
    title text NOT NULL,
    content text,
    external_url text,
    
    -- Job/referral specific fields
    company_name text,
    location text,
    salary_range text,
    experience_required text,
    
    -- Organization
    tags text[] DEFAULT '{}',
    
    -- Status and features
    is_featured boolean DEFAULT false,
    is_active boolean DEFAULT true,
    
    -- Engagement metrics
    views_count integer DEFAULT 0,
    likes_count integer DEFAULT 0,
    comments_count integer DEFAULT 0,
    applications_count integer DEFAULT 0,
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    expires_at timestamptz,
    
    -- Constraints
    CONSTRAINT title_not_empty CHECK (length(trim(title)) > 0)
);

-- Post interactions (likes, bookmarks, applications, views)
CREATE TABLE IF NOT EXISTS public.post_interactions (
    id bigserial PRIMARY KEY,
    post_id bigint NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    interaction_type interaction_type NOT NULL,
    
    -- Additional data for applications
    application_data jsonb,
    
    created_at timestamptz DEFAULT now(),
    
    CONSTRAINT unique_interaction UNIQUE(post_id, user_id, interaction_type)
);

-- Post comments
CREATE TABLE IF NOT EXISTS public.post_comments (
    id bigserial PRIMARY KEY,
    post_id bigint NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    author_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content text NOT NULL,
    
    -- Threading support
    parent_comment_id bigint REFERENCES public.post_comments(id) ON DELETE CASCADE,
    
    -- Status
    is_edited boolean DEFAULT false,
    is_deleted boolean DEFAULT false,
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    CONSTRAINT content_not_empty CHECK (length(trim(content)) > 0)
);

-- Create indexes for posts
CREATE INDEX IF NOT EXISTS idx_posts_author_created ON public.posts(author_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_type_active ON public.posts(type, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_posts_created ON public.posts(created_at DESC) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_posts_featured ON public.posts(is_featured, created_at DESC) WHERE is_featured = true AND is_active = true;
CREATE INDEX IF NOT EXISTS idx_posts_tags ON public.posts USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_post_interactions_post ON public.post_interactions(post_id);
CREATE INDEX IF NOT EXISTS idx_post_interactions_user ON public.post_interactions(user_id, interaction_type);

CREATE INDEX IF NOT EXISTS idx_post_comments_post ON public.post_comments(post_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_comments_author ON public.post_comments(author_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_parent ON public.post_comments(parent_comment_id) WHERE parent_comment_id IS NOT NULL;

-- Add comments
COMMENT ON TABLE public.posts IS 'User-generated content: job posts, referrals, questions, updates, and resources';
COMMENT ON TABLE public.post_interactions IS 'Tracks user interactions with posts (likes, bookmarks, applications)';
COMMENT ON TABLE public.post_comments IS 'Comments and replies on posts';
