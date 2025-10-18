-- ============================================
-- Migration Tracker
-- Keeps track of applied migrations
-- ============================================

CREATE TABLE IF NOT EXISTS public.schema_migrations (
    id serial PRIMARY KEY,
    version text NOT NULL UNIQUE,
    name text NOT NULL,
    applied_at timestamptz DEFAULT now(),
    execution_time_ms integer,
    success boolean DEFAULT true,
    error_message text
);

-- Insert migration records
INSERT INTO public.schema_migrations (version, name, success)
VALUES 
    ('01', 'init_schema', true),
    ('02', 'verification_tables', true),
    ('03', 'posts_tables', true),
    ('04', 'messaging_tables', true),
    ('05', 'mentorship_tables', true),
    ('06', 'notifications_tables', true),
    ('07', 'moderation_tables', true),
    ('08', 'functions_triggers', true),
    ('09', 'rls_policies', true),
    ('10', 'realtime_storage', true)
ON CONFLICT (version) DO NOTHING;

-- View to check migration status
CREATE OR REPLACE VIEW public.migration_status AS
SELECT 
    version,
    name,
    applied_at,
    CASE 
        WHEN success THEN '✓ Success'
        ELSE '✗ Failed'
    END as status,
    execution_time_ms,
    error_message
FROM public.schema_migrations
ORDER BY version;

-- Function to record migration
CREATE OR REPLACE FUNCTION public.record_migration(
    p_version text,
    p_name text,
    p_success boolean DEFAULT true,
    p_execution_time_ms integer DEFAULT NULL,
    p_error_message text DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    INSERT INTO public.schema_migrations (version, name, success, execution_time_ms, error_message)
    VALUES (p_version, p_name, p_success, p_execution_time_ms, p_error_message)
    ON CONFLICT (version) 
    DO UPDATE SET
        applied_at = now(),
        success = p_success,
        execution_time_ms = p_execution_time_ms,
        error_message = p_error_message;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON TABLE public.schema_migrations IS 'Tracks database schema migrations and their status';
