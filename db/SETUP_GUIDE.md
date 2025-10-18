# 🚀 UniMinder Database Setup - Quick Start Guide

## Overview

Complete database setup for UniMinder - a mentorship and networking platform with support for students, alumni, and aspirants.

## 📋 What's Included

- ✅ 20+ tables covering all features
- ✅ Row Level Security (RLS) policies
- ✅ Real-time subscriptions
- ✅ Database functions and triggers
- ✅ Indexes for performance
- ✅ Sample data for testing
- ✅ Verification and moderation systems

## ⚡ Quick Setup (5 minutes)

### Prerequisites

1. **Supabase Project** - [Create one](https://supabase.com/dashboard)
2. **Environment Variables** - Add to `.env`:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   SUPABASE_ANON_KEY=your-anon-key
   ```

### Option 1: Automated Setup (Recommended)

```bash
# Run the setup script
npm run db:setup

# This will:
# ✓ Connect to your Supabase project
# ✓ Create all tables and schemas
# ✓ Set up RLS policies
# ✓ Configure indexes and functions
# ✓ Enable realtime features
```

### Option 2: Manual Setup

1. Go to your [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql)
2. Execute files in this order:

```
01_init_schema.sql       → Core profiles table
02_verification_tables.sql → Verification system
03_posts_tables.sql       → Posts and content
04_messaging_tables.sql   → Real-time messaging
05_mentorship_tables.sql  → Mentorship features
06_notifications_tables.sql → Notifications
07_moderation_tables.sql  → Safety and reports
08_functions_triggers.sql → Helper functions
09_rls_policies.sql      → Security policies
10_realtime_storage.sql  → Realtime config
```

3. (Optional) Load sample data:
```sql
-- Run sample_data.sql for test users and content
```

### Option 3: Using Bash Script

```bash
# Make executable
chmod +x db/setup.sh

# Run setup
./db/setup.sh
```

## ✅ Verify Installation

```bash
# Check if everything is created
npm run db:verify

# Or manually run verify.sql in Supabase SQL Editor
```

Expected output:
- ✓ 20+ tables created
- ✓ 40+ indexes created
- ✓ 10+ functions created
- ✓ RLS enabled on all tables
- ✓ Realtime enabled for messaging

## 🗄️ Storage Buckets Setup

**Important:** Create these buckets in [Supabase Storage](https://supabase.com/dashboard/project/_/storage/buckets):

### 1. avatars (Public)
```
Name: avatars
Public: ✓ Yes
File size limit: 2MB
Allowed types: image/jpeg, image/png, image/webp
```

**RLS Policy:**
```sql
-- Users can upload to their own folder
(bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = (SELECT auth.uid()::text))
```

### 2. verification-documents (Private)
```
Name: verification-documents
Public: ✗ No
File size limit: 5MB
Allowed types: image/jpeg, image/png, application/pdf
```

**RLS Policy:**
```sql
-- Users can access their own documents
(bucket_id = 'verification-documents'::text) AND ((storage.foldername(name))[1] = (SELECT auth.uid()::text))
```

### 3. post-attachments (Public)
```
Name: post-attachments
Public: ✓ Yes
File size limit: 10MB
Allowed types: image/*, application/pdf
```

### 4. message-attachments (Private)
```
Name: message-attachments
Public: ✗ No
File size limit: 25MB
Allowed types: */*
```

**RLS Policy:**
```sql
-- Users can access messages from their conversations
(bucket_id = 'message-attachments'::text) AND (
  EXISTS (
    SELECT 1 FROM conversation_participants 
    WHERE conversation_id::text = (storage.foldername(name))[1]
    AND user_id = auth.uid()::text
  )
)
```

## 🔐 Authentication Setup

### Clerk Integration

1. **Webhook for Profile Creation**
   - Set webhook URL: `https://your-app.com/api/clerk-webhook`
   - Subscribe to: `user.created`, `user.updated`
   - This auto-creates profiles when users sign up

2. **User ID Synchronization**
   - Clerk user ID is stored in `profiles.user_id`
   - Used for RLS policies: `auth.uid()::text = user_id`

## 📊 Database Schema

### Core Tables

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `profiles` | User data | Role-based fields, verification status |
| `posts` | Content sharing | Jobs, referrals, questions, resources |
| `conversations` | Chat system | Direct & group messaging |
| `messages` | Chat messages | Real-time updates, read receipts |
| `mentorship_connections` | Mentorship | Request workflow, feedback |
| `notifications` | Notifications | Multi-channel (app, email, push) |
| `verification_requests` | Verification | ID card & phone verification |
| `reports` | Moderation | User reports and safety |

### Entity Relationships

```
profiles
  ├── posts (author)
  ├── messages (sender)
  ├── mentorship_connections (mentor/mentee)
  ├── notifications (recipient)
  └── verification_requests (user)

posts
  ├── post_interactions (likes, bookmarks)
  ├── post_comments (comments)
  └── author (profile)

conversations
  ├── conversation_participants (members)
  └── messages (chat history)
```

## 🔄 Real-time Features

Tables with realtime enabled:
- ✅ `messages` - Instant messaging
- ✅ `conversations` - Conversation updates
- ✅ `notifications` - Live notifications
- ✅ `mentorship_connections` - Request updates

### Subscribe to Realtime

```typescript
import { supabase } from '@/lib/supabase';

// Listen for new messages
supabase
  .channel('messages')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `conversation_id=eq.${conversationId}`
  }, (payload) => {
    console.log('New message:', payload.new);
  })
  .subscribe();
```

## 🧪 Testing with Sample Data

Load sample users and content:

```bash
npm run db:sample
```

This creates:
- 1 admin user
- 2 students
- 2 alumni
- 2 aspirants
- Sample posts (jobs, referrals, questions)
- Sample connections and mentorships
- Sample notifications

**Test Users:**
- `admin@uniminder.com` (Admin)
- `john.doe@student.com` (Student)
- `mike.johnson@alumni.com` (Alumni)
- `rahul.kumar@aspirant.com` (Aspirant)

## 🛠️ Useful Commands

```bash
# Setup database
npm run db:setup

# Verify installation
npm run db:verify

# Load sample data
npm run db:sample

# Generate TypeScript types
npm run db:types

# Start development server
npm run dev
```

## 📖 Additional Resources

- **Full Documentation**: `db/README.md`
- **Schema Files**: `db/01_init_schema.sql` to `db/10_realtime_storage.sql`
- **Verification Script**: `db/verify.sql`
- **Sample Data**: `db/sample_data.sql`

## 🐛 Troubleshooting

### Issue: "Cannot connect to Supabase"
✅ **Solution**: Check `.env` file has correct `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`

### Issue: "Permission denied"
✅ **Solution**: Ensure you're using the SERVICE_ROLE_KEY, not the anon key

### Issue: "Table already exists"
✅ **Solution**: This is expected - scripts use `IF NOT EXISTS` to safely re-run

### Issue: "RLS prevents data access"
✅ **Solution**: 
- Check auth.uid() matches user_id in profiles
- Use service role key for admin operations
- Review RLS policies in Supabase dashboard

### Issue: "Realtime not working"
✅ **Solution**:
- Verify realtime is enabled for the table
- Check subscription filters match your data
- Ensure RLS allows reading the data

## 🔒 Security Checklist

- ✅ RLS enabled on all tables
- ✅ Service role key stored securely (never in client)
- ✅ Anon key used for client-side operations
- ✅ Storage buckets have appropriate policies
- ✅ User blocks prevent unwanted interactions
- ✅ Admin-only access for moderation tables

## 📝 Migration Tracking

The database includes a migrations tracker:

```sql
-- Check migration status
SELECT * FROM migration_status;

-- Record a new migration
SELECT record_migration('11', 'new_feature', true);
```

## 🚀 Next Steps

1. ✅ Verify all tables are created
2. ✅ Configure storage buckets
3. ✅ Set up Clerk webhook
4. ✅ Test with sample data
5. ✅ Start building features!

## 💡 Tips

- Use **Supabase Dashboard** to visually explore tables
- Check **Logs** tab for SQL errors
- Use **Table Editor** to manually inspect data
- Enable **Database** webhooks for advanced integrations
- Set up **scheduled functions** for cleanup tasks

## 📞 Support

- 📚 [Supabase Docs](https://supabase.com/docs)
- 💬 [Supabase Discord](https://discord.supabase.com)
- 🐛 Issues? Check `db/README.md` for detailed troubleshooting

---

**Ready to build something amazing! 🎉**
