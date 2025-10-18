-- ============================================
-- Database Verification Script
-- Run this to verify all tables and functions are created
-- ============================================

-- Check if all main tables exist
SELECT 
    'Tables Check' as check_type,
    COUNT(*) as total_tables,
    string_agg(tablename, ', ' ORDER BY tablename) as table_names
FROM pg_tables 
WHERE schemaname = 'public';

-- Check if RLS is enabled on all tables
SELECT 
    'RLS Check' as check_type,
    tablename,
    CASE 
        WHEN rowsecurity THEN '✓ Enabled'
        ELSE '✗ Disabled'
    END as rls_status
FROM pg_tables t
JOIN pg_class c ON c.relname = t.tablename
WHERE t.schemaname = 'public'
ORDER BY tablename;

-- Check indexes
SELECT 
    'Indexes Check' as check_type,
    COUNT(*) as total_indexes,
    string_agg(indexname, ', ' ORDER BY indexname) as index_names
FROM pg_indexes 
WHERE schemaname = 'public' 
AND indexname LIKE 'idx_%';

-- Check functions
SELECT 
    'Functions Check' as check_type,
    COUNT(*) as total_functions,
    string_agg(routine_name, ', ' ORDER BY routine_name) as function_names
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION';

-- Check triggers
SELECT 
    'Triggers Check' as check_type,
    COUNT(*) as total_triggers,
    string_agg(trigger_name, ', ' ORDER BY trigger_name) as trigger_names
FROM information_schema.triggers 
WHERE trigger_schema = 'public';

-- Check custom types
SELECT 
    'Types Check' as check_type,
    typname as type_name,
    string_agg(enumlabel, ', ' ORDER BY enumsortorder) as enum_values
FROM pg_type t
LEFT JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
AND t.typtype = 'e'
GROUP BY typname;

-- Summary
SELECT 
    '=== SETUP SUMMARY ===' as summary,
    (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public') as total_tables,
    (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public' AND indexname LIKE 'idx_%') as total_indexes,
    (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public') as total_functions,
    (SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_schema = 'public') as total_triggers;
