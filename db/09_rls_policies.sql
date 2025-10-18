-- ============================================
-- UniMinder Database Initialization Script
-- Part 9: Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_suspensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Profiles Policies
-- ============================================

CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (
        is_active = true 
        AND NOT EXISTS (
            SELECT 1 FROM public.user_blocks 
            WHERE blocked_id = id AND blocker_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid()::text = id OR auth.uid()::text = user_id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid()::text = id OR auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own profile"
    ON public.profiles FOR DELETE
    USING (auth.uid()::text = id OR auth.uid()::text = user_id);

-- ============================================
-- Verification Policies
-- ============================================

CREATE POLICY "Users can view their own verification requests"
    ON public.verification_requests FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create their own verification requests"
    ON public.verification_requests FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own verification requests"
    ON public.verification_requests FOR UPDATE
    USING (auth.uid()::text = user_id AND status IN ('pending', 'resubmit'));

CREATE POLICY "Admins can view all verification requests"
    ON public.verification_requests FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid()::text AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update all verification requests"
    ON public.verification_requests FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid()::text AND role = 'admin'
        )
    );

CREATE POLICY "Users can view their own verification documents"
    ON public.verification_documents FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can upload their own verification documents"
    ON public.verification_documents FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

-- ============================================
-- Posts Policies
-- ============================================

CREATE POLICY "Posts are publicly readable"
    ON public.posts FOR SELECT
    USING (is_active = true);

CREATE POLICY "Authenticated users can create posts"
    ON public.posts FOR INSERT
    WITH CHECK (auth.uid()::text = author_id);

CREATE POLICY "Users can update their own posts"
    ON public.posts FOR UPDATE
    USING (auth.uid()::text = author_id);

CREATE POLICY "Users can delete their own posts"
    ON public.posts FOR DELETE
    USING (auth.uid()::text = author_id);

-- ============================================
-- Post Interactions Policies
-- ============================================

CREATE POLICY "Users can view all interactions"
    ON public.post_interactions FOR SELECT
    USING (true);

CREATE POLICY "Users can manage their own interactions"
    ON public.post_interactions FOR ALL
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);

-- ============================================
-- Comments Policies
-- ============================================

CREATE POLICY "Comments are publicly readable"
    ON public.post_comments FOR SELECT
    USING (NOT is_deleted);

CREATE POLICY "Authenticated users can create comments"
    ON public.post_comments FOR INSERT
    WITH CHECK (auth.uid()::text = author_id);

CREATE POLICY "Users can update their own comments"
    ON public.post_comments FOR UPDATE
    USING (auth.uid()::text = author_id);

CREATE POLICY "Users can delete their own comments"
    ON public.post_comments FOR DELETE
    USING (auth.uid()::text = author_id);

-- ============================================
-- Conversations Policies
-- ============================================

CREATE POLICY "Users can view conversations they participate in"
    ON public.conversations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.conversation_participants 
            WHERE conversation_id = id 
            AND user_id = auth.uid()::text 
            AND left_at IS NULL
        )
    );

CREATE POLICY "Authenticated users can create conversations"
    ON public.conversations FOR INSERT
    WITH CHECK (auth.uid()::text = created_by);

CREATE POLICY "Conversation creators can update their conversations"
    ON public.conversations FOR UPDATE
    USING (auth.uid()::text = created_by);

-- ============================================
-- Conversation Participants Policies
-- ============================================

CREATE POLICY "Users can view participants in their conversations"
    ON public.conversation_participants FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.conversation_participants cp
            WHERE cp.conversation_id = conversation_id 
            AND cp.user_id = auth.uid()::text 
            AND cp.left_at IS NULL
        )
    );

CREATE POLICY "Users can manage their own participation"
    ON public.conversation_participants FOR ALL
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);

-- ============================================
-- Messages Policies
-- ============================================

CREATE POLICY "Users can view messages in their conversations"
    ON public.messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.conversation_participants 
            WHERE conversation_id = conversation_id 
            AND user_id = auth.uid()::text 
            AND left_at IS NULL
        )
    );

CREATE POLICY "Users can send messages to their conversations"
    ON public.messages FOR INSERT
    WITH CHECK (
        auth.uid()::text = sender_id 
        AND EXISTS (
            SELECT 1 FROM public.conversation_participants 
            WHERE conversation_id = conversation_id 
            AND user_id = auth.uid()::text 
            AND left_at IS NULL
        )
    );

CREATE POLICY "Users can update their own messages"
    ON public.messages FOR UPDATE
    USING (auth.uid()::text = sender_id);

-- ============================================
-- Message Reads Policies
-- ============================================

CREATE POLICY "Users can manage their own read receipts"
    ON public.message_reads FOR ALL
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);

-- ============================================
-- Mentorship Policies
-- ============================================

CREATE POLICY "Users can view mentorship connections involving them"
    ON public.mentorship_connections FOR SELECT
    USING (auth.uid()::text = mentor_id OR auth.uid()::text = mentee_id);

CREATE POLICY "Users can create mentorship requests"
    ON public.mentorship_connections FOR INSERT
    WITH CHECK (auth.uid()::text = mentee_id);

CREATE POLICY "Participants can update mentorship connections"
    ON public.mentorship_connections FOR UPDATE
    USING (auth.uid()::text = mentor_id OR auth.uid()::text = mentee_id);

-- ============================================
-- Connection Requests Policies
-- ============================================

CREATE POLICY "Users can view connection requests involving them"
    ON public.connection_requests FOR SELECT
    USING (auth.uid()::text = requester_id OR auth.uid()::text = recipient_id);

CREATE POLICY "Users can send connection requests"
    ON public.connection_requests FOR INSERT
    WITH CHECK (auth.uid()::text = requester_id);

CREATE POLICY "Recipients can update connection requests"
    ON public.connection_requests FOR UPDATE
    USING (auth.uid()::text = recipient_id);

-- ============================================
-- User Connections Policies
-- ============================================

CREATE POLICY "Users can view their connections"
    ON public.user_connections FOR SELECT
    USING (auth.uid()::text = user_id OR auth.uid()::text = connected_user_id);

CREATE POLICY "Users can manage their connections"
    ON public.user_connections FOR ALL
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);

-- ============================================
-- Blocks Policies
-- ============================================

CREATE POLICY "Users can manage their blocks"
    ON public.user_blocks FOR ALL
    USING (auth.uid()::text = blocker_id)
    WITH CHECK (auth.uid()::text = blocker_id);

-- ============================================
-- Notifications Policies
-- ============================================

CREATE POLICY "Users can view their own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own notifications"
    ON public.notifications FOR UPDATE
    USING (auth.uid()::text = user_id);

CREATE POLICY "System can create notifications"
    ON public.notifications FOR INSERT
    WITH CHECK (true); -- System service handles this

-- ============================================
-- User Preferences Policies
-- ============================================

CREATE POLICY "Users can manage their own preferences"
    ON public.user_preferences FOR ALL
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);

-- ============================================
-- Reports Policies
-- ============================================

CREATE POLICY "Users can view their own reports"
    ON public.reports FOR SELECT
    USING (auth.uid()::text = reporter_id);

CREATE POLICY "Authenticated users can create reports"
    ON public.reports FOR INSERT
    WITH CHECK (auth.uid()::text = reporter_id);

CREATE POLICY "Admins can view all reports"
    ON public.reports FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid()::text AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update reports"
    ON public.reports FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid()::text AND role = 'admin'
        )
    );

-- ============================================
-- Moderation Policies (Admin Only)
-- ============================================

CREATE POLICY "Admins can manage moderation actions"
    ON public.moderation_actions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid()::text AND role = 'admin'
        )
    );

CREATE POLICY "Admins can manage suspensions"
    ON public.user_suspensions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid()::text AND role = 'admin'
        )
    );

CREATE POLICY "Admins can view audit logs"
    ON public.audit_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid()::text AND role = 'admin'
        )
    );

-- Add comments
COMMENT ON POLICY "Public profiles are viewable by everyone" ON public.profiles IS 'Active profiles are visible to all users except blocked ones';
COMMENT ON POLICY "Users can manage their own interactions" ON public.post_interactions IS 'Users can like, bookmark, and apply to posts';
