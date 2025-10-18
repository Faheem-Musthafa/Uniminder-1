-- ============================================
-- UniMinder Database Initialization Script
-- Part 6: Notifications & Preferences
-- ============================================

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id bigserial PRIMARY KEY,
    user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Content
    type notification_type NOT NULL,
    title text NOT NULL,
    content text,
    
    -- Links and metadata
    action_url text,
    data jsonb DEFAULT '{}',
    
    -- Related entities
    related_user_id text REFERENCES public.profiles(id) ON DELETE SET NULL,
    related_post_id bigint REFERENCES public.posts(id) ON DELETE CASCADE,
    related_message_id bigint REFERENCES public.messages(id) ON DELETE CASCADE,
    
    -- Status
    is_read boolean DEFAULT false,
    
    -- Delivery tracking
    channel text CHECK (channel IN ('in_app', 'email', 'push', 'whatsapp')),
    status text CHECK (status IN ('queued', 'sent', 'failed', 'delivered')) DEFAULT 'queued',
    sent_at timestamptz,
    delivered_at timestamptz,
    read_at timestamptz,
    
    -- Error tracking
    error_message text,
    retry_count integer DEFAULT 0,
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    expires_at timestamptz
);

-- User preferences
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id text PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Notification preferences
    email_notifications boolean DEFAULT true,
    push_notifications boolean DEFAULT true,
    sms_notifications boolean DEFAULT false,
    whatsapp_notifications boolean DEFAULT false,
    
    -- Notification frequency
    notification_frequency text DEFAULT 'instant' CHECK (notification_frequency IN ('instant', 'hourly', 'daily', 'weekly', 'never')),
    digest_time time DEFAULT '09:00:00',
    
    -- Notification types
    notify_messages boolean DEFAULT true,
    notify_post_likes boolean DEFAULT true,
    notify_post_comments boolean DEFAULT true,
    notify_mentorship_requests boolean DEFAULT true,
    notify_connection_requests boolean DEFAULT true,
    notify_post_mentions boolean DEFAULT true,
    
    -- Privacy settings
    privacy_level text DEFAULT 'public' CHECK (privacy_level IN ('public', 'connections', 'private')),
    show_email boolean DEFAULT false,
    show_phone boolean DEFAULT false,
    show_linkedin boolean DEFAULT true,
    show_location boolean DEFAULT true,
    allow_connection_requests boolean DEFAULT true,
    allow_mentorship_requests boolean DEFAULT true,
    
    -- Profile visibility
    searchable boolean DEFAULT true,
    show_in_directory boolean DEFAULT true,
    
    -- Theme and display
    theme text DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
    language text DEFAULT 'en',
    timezone text DEFAULT 'UTC',
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Email verification tokens
CREATE TABLE IF NOT EXISTS public.email_verification_tokens (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    email text NOT NULL,
    token text NOT NULL UNIQUE,
    expires_at timestamptz NOT NULL,
    used_at timestamptz,
    created_at timestamptz DEFAULT now()
);

-- Password reset tokens (if using email/password)
CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    token text NOT NULL UNIQUE,
    expires_at timestamptz NOT NULL,
    used_at timestamptz,
    ip_address inet,
    created_at timestamptz DEFAULT now()
);

-- Create indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read, created_at DESC) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON public.notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON public.notifications(status, created_at) WHERE status IN ('queued', 'failed');
CREATE INDEX IF NOT EXISTS idx_notifications_expires ON public.notifications(expires_at) WHERE expires_at IS NOT NULL AND is_read = false;

CREATE INDEX IF NOT EXISTS idx_email_verification_token ON public.email_verification_tokens(token) WHERE used_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_password_reset_token ON public.password_reset_tokens(token) WHERE used_at IS NULL;

-- Add comments
COMMENT ON TABLE public.notifications IS 'User notifications for various events';
COMMENT ON TABLE public.user_preferences IS 'User preferences for notifications, privacy, and display';
COMMENT ON TABLE public.email_verification_tokens IS 'Tokens for email verification';
COMMENT ON TABLE public.password_reset_tokens IS 'Tokens for password reset requests';
