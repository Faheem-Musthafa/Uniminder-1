-- ============================================
-- UniMinder Database Initialization Script
-- Part 10: Realtime & Storage Setup
-- ============================================

-- Enable realtime for specific tables
-- This allows Supabase to broadcast changes in real-time

-- Realtime for messaging
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.typing_indicators;

-- Realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Realtime for connection requests
ALTER PUBLICATION supabase_realtime ADD TABLE public.connection_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mentorship_connections;

-- ============================================
-- Storage Buckets Configuration
-- ============================================

-- Note: These need to be created via Supabase UI or API
-- The SQL below documents the expected configuration

-- Bucket: avatars
-- Purpose: User profile pictures
-- Public: true
-- File size limit: 2MB
-- Allowed mime types: image/jpeg, image/png, image/webp

-- Bucket: verification-documents
-- Purpose: ID cards and verification documents
-- Public: false (only accessible by owner and admins)
-- File size limit: 5MB
-- Allowed mime types: image/jpeg, image/png, image/pdf

-- Bucket: post-attachments
-- Purpose: Images and files attached to posts
-- Public: true
-- File size limit: 10MB
-- Allowed mime types: image/*, application/pdf

-- Bucket: message-attachments
-- Purpose: Files shared in messages
-- Public: false (only accessible by conversation participants)
-- File size limit: 25MB
-- Allowed mime types: */*

-- ============================================
-- Storage Policies (RLS for Storage)
-- ============================================

-- Note: Storage policies are created in Supabase Storage settings
-- Documentation of expected policies:

-- avatars bucket:
-- 1. Public read access for all files
-- 2. Authenticated users can upload to their own folder (user_id/*)
-- 3. Users can update/delete their own files

-- verification-documents bucket:
-- 1. Users can upload to their own folder (user_id/*)
-- 2. Users can read their own documents
-- 3. Admins can read all documents

-- post-attachments bucket:
-- 1. Public read access
-- 2. Authenticated users can upload
-- 3. Users can delete their own uploads

-- message-attachments bucket:
-- 1. Users can upload to their conversations
-- 2. Users can read attachments from their conversations
-- 3. Users can delete their own attachments

-- ============================================
-- Database Maintenance Jobs
-- ============================================

-- Create a scheduled job to clean up expired data
-- Note: This requires pg_cron extension (available in Supabase)

-- Clean expired tokens daily
-- SELECT cron.schedule(
--     'clean-expired-tokens',
--     '0 2 * * *', -- Run at 2 AM daily
--     $$SELECT public.clean_expired_tokens()$$
-- );

-- Clean old audit logs (keep 90 days)
-- SELECT cron.schedule(
--     'clean-old-audit-logs',
--     '0 3 * * 0', -- Run at 3 AM every Sunday
--     $$DELETE FROM public.audit_logs WHERE created_at < now() - interval '90 days'$$
-- );

-- Clean old notifications (keep 30 days of read notifications)
-- SELECT cron.schedule(
--     'clean-old-notifications',
--     '0 4 * * 0', -- Run at 4 AM every Sunday
--     $$DELETE FROM public.notifications WHERE is_read = true AND created_at < now() - interval '30 days'$$
-- );

COMMENT ON TABLE public.messages IS 'Messages table with realtime enabled for instant messaging';
COMMENT ON TABLE public.notifications IS 'Notifications table with realtime enabled for instant updates';
