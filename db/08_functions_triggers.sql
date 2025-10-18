-- ============================================
-- UniMinder Database Initialization Script
-- Part 8: Database Functions & Triggers
-- ============================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Update post engagement counts
CREATE OR REPLACE FUNCTION public.update_post_stats()
RETURNS trigger AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.interaction_type = 'like' THEN
            UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
        ELSIF NEW.interaction_type = 'bookmark' THEN
            -- Could track bookmark count if needed
            NULL;
        ELSIF NEW.interaction_type = 'apply' THEN
            UPDATE public.posts SET applications_count = applications_count + 1 WHERE id = NEW.post_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.interaction_type = 'like' THEN
            UPDATE public.posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.post_id;
        ELSIF OLD.interaction_type = 'apply' THEN
            UPDATE public.posts SET applications_count = GREATEST(0, applications_count - 1) WHERE id = OLD.post_id;
        END IF;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Update comment counts
CREATE OR REPLACE FUNCTION public.update_comment_count()
RETURNS trigger AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.posts SET comments_count = GREATEST(0, comments_count - 1) WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Update conversation last message time
CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS trigger AS $$
BEGIN
    UPDATE public.conversations 
    SET last_message_at = NEW.created_at, updated_at = now()
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Create bidirectional connection
CREATE OR REPLACE FUNCTION public.create_bidirectional_connection()
RETURNS trigger AS $$
BEGIN
    -- When a connection is created, also create the reverse
    INSERT INTO public.user_connections (user_id, connected_user_id, connected_at)
    VALUES (NEW.connected_user_id, NEW.user_id, NEW.connected_at)
    ON CONFLICT (user_id, connected_user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Increment post views
CREATE OR REPLACE FUNCTION public.increment_post_views(post_id bigint)
RETURNS void AS $$
BEGIN
    UPDATE public.posts SET views_count = views_count + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Mark notifications as read
CREATE OR REPLACE FUNCTION public.mark_notifications_read(user_id_param text, notification_ids bigint[])
RETURNS void AS $$
BEGIN
    UPDATE public.notifications 
    SET is_read = true, read_at = now()
    WHERE user_id = user_id_param 
    AND id = ANY(notification_ids)
    AND is_read = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get unread message count
CREATE OR REPLACE FUNCTION public.get_unread_message_count(user_id_param text)
RETURNS bigint AS $$
DECLARE
    unread_count bigint;
BEGIN
    SELECT COUNT(DISTINCT m.id)
    INTO unread_count
    FROM public.messages m
    INNER JOIN public.conversation_participants cp 
        ON cp.conversation_id = m.conversation_id 
        AND cp.user_id = user_id_param
        AND cp.left_at IS NULL
    LEFT JOIN public.message_reads mr 
        ON mr.message_id = m.id 
        AND mr.user_id = user_id_param
    WHERE m.sender_id != user_id_param
    AND mr.message_id IS NULL
    AND m.created_at > cp.last_read_at;
    
    RETURN COALESCE(unread_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Clean expired tokens
CREATE OR REPLACE FUNCTION public.clean_expired_tokens()
RETURNS void AS $$
BEGIN
    DELETE FROM public.email_verification_tokens WHERE expires_at < now() AND used_at IS NULL;
    DELETE FROM public.password_reset_tokens WHERE expires_at < now() AND used_at IS NULL;
    DELETE FROM public.notifications WHERE expires_at < now() AND is_read = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Check if user is blocked
CREATE OR REPLACE FUNCTION public.is_user_blocked(user_id_param text, other_user_id_param text)
RETURNS boolean AS $$
DECLARE
    is_blocked boolean;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM public.user_blocks 
        WHERE (blocker_id = user_id_param AND blocked_id = other_user_id_param)
        OR (blocker_id = other_user_id_param AND blocked_id = user_id_param)
    ) INTO is_blocked;
    
    RETURN is_blocked;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Create Triggers
-- ============================================

-- Updated_at triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;
CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON public.posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_conversations_updated_at ON public.conversations;
CREATE TRIGGER update_conversations_updated_at
    BEFORE UPDATE ON public.conversations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON public.user_preferences;
CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Post stats triggers
DROP TRIGGER IF EXISTS update_post_stats_trigger ON public.post_interactions;
CREATE TRIGGER update_post_stats_trigger
    AFTER INSERT OR DELETE ON public.post_interactions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_post_stats();

DROP TRIGGER IF EXISTS update_comment_count_trigger ON public.post_comments;
CREATE TRIGGER update_comment_count_trigger
    AFTER INSERT OR DELETE ON public.post_comments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_comment_count();

-- Conversation triggers
DROP TRIGGER IF EXISTS update_conversation_last_message_trigger ON public.messages;
CREATE TRIGGER update_conversation_last_message_trigger
    AFTER INSERT ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_conversation_last_message();

-- Connection triggers
DROP TRIGGER IF EXISTS create_bidirectional_connection_trigger ON public.user_connections;
CREATE TRIGGER create_bidirectional_connection_trigger
    AFTER INSERT ON public.user_connections
    FOR EACH ROW
    EXECUTE FUNCTION public.create_bidirectional_connection();

-- Add comments
COMMENT ON FUNCTION public.update_updated_at_column() IS 'Automatically updates the updated_at timestamp';
COMMENT ON FUNCTION public.update_post_stats() IS 'Updates post engagement statistics on interactions';
COMMENT ON FUNCTION public.increment_post_views(bigint) IS 'Safely increments post view count';
COMMENT ON FUNCTION public.get_unread_message_count(text) IS 'Returns count of unread messages for a user';
