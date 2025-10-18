# 📋 Database Setup Checklist

Use this checklist to ensure complete database setup for UniMinder.

## ✅ Pre-Setup

- [ ] Supabase project created
- [ ] `.env` file configured with:
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `SUPABASE_ANON_KEY`
- [ ] Node.js installed (v18+)
- [ ] npm dependencies installed (`npm install`)

## ✅ Database Schema Setup

- [ ] Run `npm run db:setup` OR
- [ ] Manually execute SQL files in order:
  - [ ] `01_init_schema.sql` - Core profiles
  - [ ] `02_verification_tables.sql` - Verification system
  - [ ] `03_posts_tables.sql` - Content management
  - [ ] `04_messaging_tables.sql` - Chat system
  - [ ] `05_mentorship_tables.sql` - Mentorship
  - [ ] `06_notifications_tables.sql` - Notifications
  - [ ] `07_moderation_tables.sql` - Safety
  - [ ] `08_functions_triggers.sql` - Functions
  - [ ] `09_rls_policies.sql` - Security
  - [ ] `10_realtime_storage.sql` - Realtime

## ✅ Verification

- [ ] All tables created (24 tables)
- [ ] RLS enabled on all tables
- [ ] Indexes created (40+)
- [ ] Functions created (9 functions)
- [ ] Triggers created (6 triggers)
- [ ] Run `npm run db:verify` to confirm

## ✅ Storage Buckets

- [ ] Create `avatars` bucket
  - [ ] Set as Public
  - [ ] File size limit: 2MB
  - [ ] Add upload policy for authenticated users
  - [ ] Add delete policy for file owners
  
- [ ] Create `verification-documents` bucket
  - [ ] Set as Private
  - [ ] File size limit: 5MB
  - [ ] Add upload policy (users → their folder)
  - [ ] Add read policy (users → their files, admins → all)
  
- [ ] Create `post-attachments` bucket
  - [ ] Set as Public
  - [ ] File size limit: 10MB
  - [ ] Add upload policy for authenticated users
  
- [ ] Create `message-attachments` bucket
  - [ ] Set as Private
  - [ ] File size limit: 25MB
  - [ ] Add access policy for conversation participants

## ✅ Storage Policies Setup

### Avatars Bucket
```sql
-- Upload policy
CREATE POLICY "Users can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Read policy
CREATE POLICY "Avatars are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Delete policy
CREATE POLICY "Users can delete their own avatars"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### Verification Documents Bucket
```sql
-- Upload policy
CREATE POLICY "Users can upload verification documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'verification-documents' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Read policy (own documents)
CREATE POLICY "Users can view their verification documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'verification-documents' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Admin read policy
CREATE POLICY "Admins can view all verification documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'verification-documents' AND
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid()::text AND role = 'admin'
  )
);
```

## ✅ Realtime Configuration

- [ ] Verify realtime enabled for:
  - [ ] `messages`
  - [ ] `conversations`
  - [ ] `notifications`
  - [ ] `mentorship_connections`
  - [ ] `connection_requests`

- [ ] Test realtime subscription in code:
```typescript
const subscription = supabase
  .channel('test')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'messages'
  }, payload => console.log(payload))
  .subscribe();
```

## ✅ Authentication Setup

- [ ] Clerk project configured
- [ ] Webhook endpoint created: `/api/clerk-webhook`
- [ ] Webhook URL set in Clerk dashboard
- [ ] Webhook secret added to `.env` as `CLERK_WEBHOOK_SECRET`
- [ ] Webhook events subscribed:
  - [ ] `user.created`
  - [ ] `user.updated`
  - [ ] `user.deleted`

## ✅ Testing

- [ ] Load sample data: `npm run db:sample`
- [ ] Test user profiles created
- [ ] Test posts visible
- [ ] Test connections working
- [ ] Test notifications appearing

## ✅ API Routes Working

- [ ] `/api/health` - Health check
- [ ] `/api/onboarding` - Profile creation
- [ ] `/api/verification/upload` - Document upload
- [ ] `/api/verification/phone` - Phone verification
- [ ] `/api/verification/status` - Verification status
- [ ] `/api/posts` - Post CRUD
- [ ] `/api/dashboard/alumni/stats` - Alumni stats
- [ ] `/api/dashboard/aspirant/stats` - Aspirant stats

## ✅ Application Testing

- [ ] Sign up new user
- [ ] Complete onboarding
- [ ] Upload verification documents
- [ ] Create a post
- [ ] Like/bookmark posts
- [ ] Send connection request
- [ ] Start conversation
- [ ] Send message
- [ ] Receive notifications

## ✅ Security Verification

- [ ] RLS prevents unauthorized access
- [ ] Service role key not exposed to client
- [ ] Anon key used for client operations
- [ ] Storage policies prevent unauthorized uploads
- [ ] Users can't access other users' private data
- [ ] Blocked users can't interact

## ✅ Performance Check

- [ ] Indexes created for common queries
- [ ] Queries execute in <100ms
- [ ] No N+1 query problems
- [ ] Pagination implemented for large lists
- [ ] Real-time subscriptions efficient

## ✅ Production Readiness

- [ ] Environment variables secured
- [ ] Database backups configured
- [ ] Error logging set up
- [ ] Rate limiting implemented
- [ ] CORS configured properly
- [ ] SSL/TLS enabled
- [ ] Database connection pooling configured

## ✅ Documentation

- [ ] API endpoints documented
- [ ] Database schema documented
- [ ] Setup instructions clear
- [ ] Troubleshooting guide available
- [ ] Sample data documented

## ✅ Monitoring & Maintenance

- [ ] Database monitoring enabled
- [ ] Slow query alerts configured
- [ ] Error tracking set up (Sentry/similar)
- [ ] Scheduled cleanup jobs planned
- [ ] Backup strategy defined

---

## 🎯 Quick Verification Commands

```bash
# Verify database setup
npm run db:verify

# Check tables exist
echo "SELECT tablename FROM pg_tables WHERE schemaname = 'public';" | psql $DATABASE_URL

# Count records
echo "SELECT 
  'profiles' as table, COUNT(*) as count FROM profiles
  UNION ALL
  SELECT 'posts', COUNT(*) FROM posts
  UNION ALL
  SELECT 'messages', COUNT(*) FROM messages;" | psql $DATABASE_URL
```

## ✅ Final Sign-Off

- [ ] All checklist items completed
- [ ] Database fully functional
- [ ] Application connecting successfully
- [ ] Sample data loaded and visible
- [ ] Ready for development! 🚀

---

**Date Completed:** _______________  
**Verified By:** _______________  
**Notes:** _____________________
