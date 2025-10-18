-- ============================================
-- UniMinder Database Initialization Script
-- Part 7: Moderation & Safety
-- ============================================

-- Reports table
CREATE TABLE IF NOT EXISTS public.reports (
    id bigserial PRIMARY KEY,
    reporter_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- What is being reported
    reported_user_id text REFERENCES public.profiles(id) ON DELETE CASCADE,
    reported_post_id bigint REFERENCES public.posts(id) ON DELETE CASCADE,
    reported_comment_id bigint REFERENCES public.post_comments(id) ON DELETE CASCADE,
    reported_message_id bigint REFERENCES public.messages(id) ON DELETE CASCADE,
    
    -- Report details
    reason text NOT NULL CHECK (reason IN ('spam', 'harassment', 'hate_speech', 'inappropriate_content', 'fake_profile', 'scam', 'violence', 'other')),
    description text NOT NULL,
    additional_info jsonb DEFAULT '{}',
    
    -- Status and resolution
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'resolved', 'dismissed', 'escalated')),
    priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Moderation
    resolved_by text REFERENCES public.profiles(id) ON DELETE SET NULL,
    resolution_notes text,
    action_taken text CHECK (action_taken IN ('warning', 'content_removed', 'user_suspended', 'user_banned', 'no_action')),
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    reviewed_at timestamptz,
    resolved_at timestamptz,
    
    CONSTRAINT at_least_one_reported CHECK (
        reported_user_id IS NOT NULL OR 
        reported_post_id IS NOT NULL OR 
        reported_comment_id IS NOT NULL OR 
        reported_message_id IS NOT NULL
    )
);

-- Moderation actions
CREATE TABLE IF NOT EXISTS public.moderation_actions (
    id bigserial PRIMARY KEY,
    moderator_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Action details
    action_type text NOT NULL CHECK (action_type IN ('warning', 'mute', 'suspend', 'ban', 'unban', 'content_removal')),
    reason text NOT NULL,
    duration_hours integer,
    notes text,
    
    -- Related report
    report_id bigint REFERENCES public.reports(id) ON DELETE SET NULL,
    
    -- Status
    is_active boolean DEFAULT true,
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    expires_at timestamptz,
    revoked_at timestamptz,
    revoked_by text REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- User suspensions (for quick checks)
CREATE TABLE IF NOT EXISTS public.user_suspensions (
    user_id text PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    suspended_by text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reason text NOT NULL,
    notes text,
    suspended_at timestamptz DEFAULT now(),
    expires_at timestamptz,
    is_permanent boolean DEFAULT false
);

-- Audit logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id bigserial PRIMARY KEY,
    user_id text REFERENCES public.profiles(id) ON DELETE SET NULL,
    
    -- Action details
    action text NOT NULL,
    resource_type text,
    resource_id text,
    
    -- Changes
    old_values jsonb,
    new_values jsonb,
    
    -- Context
    ip_address inet,
    user_agent text,
    metadata jsonb DEFAULT '{}',
    
    -- Timestamp
    created_at timestamptz DEFAULT now()
);

-- Create indexes for moderation
CREATE INDEX IF NOT EXISTS idx_reports_reporter ON public.reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_reports_reported_user ON public.reports(reported_user_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status, created_at DESC) WHERE status IN ('pending', 'under_review');
CREATE INDEX IF NOT EXISTS idx_reports_priority ON public.reports(priority, created_at DESC) WHERE status IN ('pending', 'under_review');

CREATE INDEX IF NOT EXISTS idx_moderation_actions_target ON public.moderation_actions(target_user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_moderation_actions_moderator ON public.moderation_actions(moderator_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_moderation_actions_active ON public.moderation_actions(is_active, expires_at) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);

-- Add comments
COMMENT ON TABLE public.reports IS 'User-submitted reports for content and behavior moderation';
COMMENT ON TABLE public.moderation_actions IS 'Moderation actions taken by administrators';
COMMENT ON TABLE public.user_suspensions IS 'Active user suspensions and bans';
COMMENT ON TABLE public.audit_logs IS 'System audit trail for important actions';
