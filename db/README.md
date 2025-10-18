# UniMinder Database Documentation

## Overview

This directory contains the complete database schema and setup scripts for the UniMinder platform - a mentorship and networking application for students, alumni, and aspirants.

## Database Architecture

### Core Components

1. **User Management** - Profiles, verification, and preferences
2. **Content System** - Posts (jobs, referrals, updates, questions, resources)
3. **Messaging** - Real-time conversations and group chats
4. **Mentorship** - Mentor-mentee connections and relationships
5. **Notifications** - Multi-channel notification system
6. **Moderation** - Safety, reporting, and content moderation
7. **Analytics** - Engagement tracking and metrics

## Schema Files

### Migration Files (Execute in Order)

| File | Description | Tables Created |
|------|-------------|----------------|
| `01_init_schema.sql` | Core schema and profiles | profiles |
| `02_verification_tables.sql` | Verification system | verification_requests, verification_documents |
| `03_posts_tables.sql` | Content management | posts, post_interactions, post_comments |
| `04_messaging_tables.sql` | Messaging system | conversations, messages, message_reads |
| `05_mentorship_tables.sql` | Mentorship features | mentorship_connections, connection_requests, user_connections |
| `06_notifications_tables.sql` | Notification system | notifications, user_preferences |
| `07_moderation_tables.sql` | Safety and moderation | reports, moderation_actions, audit_logs |
| `08_functions_triggers.sql` | Database functions | Various helper functions and triggers |
| `09_rls_policies.sql` | Row Level Security | RLS policies for all tables |
| `10_realtime_storage.sql` | Realtime config | Publication and storage setup |

## Setup Instructions

### Option 1: Automated Setup (Recommended)

#### Using Bash Script
```bash
# Make the script executable
chmod +x db/setup.sh

# Run the setup
./db/setup.sh
```

#### Using Node.js Script
```bash
# Install dependencies if needed
npm install

# Run the setup
node db/setup.js
```

### Option 2: Manual Setup

1. **Connect to your Supabase project**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor

2. **Execute files in order**
   - Copy contents of each file
   - Execute in the SQL Editor
   - Start with `01_init_schema.sql` and proceed sequentially

3. **Verify installation**
   - Check that all tables are created
   - Verify RLS policies are enabled
   - Confirm indexes are created

### Option 3: Using Supabase CLI

```bash
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_ID

# Run migrations
supabase db execute --file db/01_init_schema.sql
supabase db execute --file db/02_verification_tables.sql
# ... continue for all files
```

## Environment Variables

Ensure these are set in your `.env` file:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
```

## Database Schema

### Key Tables

#### profiles
Main user data table with role-based fields (student/alumni/aspirant)

**Key Fields:**
- `id`, `user_id` - User identification (matches Clerk)
- `role` - User type (student, alumni, aspirant, admin)
- `onboarded` - Completion status
- `verification_status` - Account verification state
- `skills`, `interests`, `looking_for` - Array fields for matching

#### posts
Content sharing system for jobs, referrals, questions, and updates

**Key Fields:**
- `type` - Content type (job, referral, update, question, resource)
- `author_id` - References profiles
- `tags` - Array of tags for categorization
- `views_count`, `likes_count`, `comments_count` - Engagement metrics

#### conversations & messages
Real-time messaging system

**Key Features:**
- Direct and group conversations
- Read receipts
- File attachments
- Reply threading

#### mentorship_connections
Mentor-mentee relationship management

**Statuses:**
- pending, accepted, declined, completed, cancelled

#### notifications
Multi-channel notification system

**Channels:**
- in_app, email, push, whatsapp

## Storage Buckets

Configure these in Supabase Storage:

### avatars
- **Purpose**: User profile pictures
- **Access**: Public
- **Size Limit**: 2MB
- **Types**: image/jpeg, image/png, image/webp

### verification-documents
- **Purpose**: ID cards and verification files
- **Access**: Private (owner + admins)
- **Size Limit**: 5MB
- **Types**: image/jpeg, image/png, application/pdf

### post-attachments
- **Purpose**: Files attached to posts
- **Access**: Public
- **Size Limit**: 10MB
- **Types**: image/*, application/pdf

### message-attachments
- **Purpose**: Files shared in conversations
- **Access**: Private (participants only)
- **Size Limit**: 25MB
- **Types**: */*

## Realtime Configuration

The following tables have realtime enabled:

- `messages` - Instant messaging
- `conversations` - Conversation updates
- `notifications` - Live notification updates
- `connection_requests` - Real-time connection notifications
- `mentorship_connections` - Mentorship request updates

### Subscribing to Realtime

```javascript
// Subscribe to new messages in a conversation
supabase
  .channel('conversation:123')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: 'conversation_id=eq.123'
  }, payload => {
    console.log('New message:', payload.new);
  })
  .subscribe();
```

## Security

### Row Level Security (RLS)

All tables have RLS enabled with policies ensuring:
- Users can only access their own data
- Public content is readable by all
- Participants can access shared conversations
- Admins have elevated access for moderation

### Authentication

The database integrates with Clerk for authentication:
- `auth.uid()` is used in RLS policies
- Profiles are created via webhook on user signup
- User IDs are synchronized between Clerk and Supabase

## Database Functions

### Helper Functions

```sql
-- Increment post views safely
SELECT increment_post_views(post_id);

-- Get unread message count
SELECT get_unread_message_count(user_id);

-- Mark notifications as read
SELECT mark_notifications_read(user_id, ARRAY[id1, id2]);

-- Check if users have blocked each other
SELECT is_user_blocked(user_id1, user_id2);

-- Clean expired tokens
SELECT clean_expired_tokens();
```

## Maintenance

### Scheduled Jobs

Consider setting up these maintenance tasks:

1. **Daily**: Clean expired tokens and verification codes
2. **Weekly**: Archive old read notifications (30+ days)
3. **Monthly**: Clean old audit logs (90+ days)
4. **As Needed**: Reindex tables, vacuum, analyze

### Monitoring

Monitor these metrics:
- Table sizes and growth rates
- Index usage and performance
- Query performance (slow queries)
- Connection pool usage
- Realtime subscription count

## Troubleshooting

### Common Issues

**Issue**: Policies preventing data access
- **Solution**: Check RLS policies and ensure auth.uid() matches user_id

**Issue**: Slow queries
- **Solution**: Verify indexes are created, run EXPLAIN ANALYZE

**Issue**: Realtime not working
- **Solution**: Check publication configuration and subscription filters

**Issue**: Foreign key violations
- **Solution**: Ensure parent records exist before inserting child records

### Useful Queries

```sql
-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Find slow queries
SELECT 
  query,
  calls,
  total_time,
  mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

## Migration Guide

### Adding New Tables

1. Create migration file: `db/11_new_feature.sql`
2. Define table with proper constraints
3. Add indexes
4. Create RLS policies
5. Update this README
6. Run migration

### Modifying Existing Tables

1. Create ALTER TABLE statements
2. Test on development database first
3. Backup production before applying
4. Use transactions for safety
5. Update documentation

## Support

For issues or questions:
- Check Supabase logs in dashboard
- Review error messages in SQL editor
- Consult Supabase documentation
- Check application logs for API errors

## License

This database schema is part of the UniMinder project.
