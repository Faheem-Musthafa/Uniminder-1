# 📦 Supabase Storage Buckets Setup Guide

This guide will help you create and configure the required storage buckets for UniMinder.

---

## 🎯 Required Buckets

UniMinder requires **4 storage buckets**:

1. **avatars** - User profile pictures
2. **verification-documents** - ID cards and verification files
3. **post-attachments** - Images/files attached to posts
4. **message-attachments** - Files shared in messages

---

## 📋 Step-by-Step Setup

### 1. Access Supabase Storage

1. Go to your Supabase project: https://supabase.com/dashboard
2. Select your **UniMinder** project
3. Click on **Storage** in the left sidebar
4. Click **New bucket** button

---

### 2. Create Buckets

#### Bucket 1: `avatars`

**Settings:**
- **Name:** `avatars`
- **Public bucket:** ✅ **YES** (Public access)
- **File size limit:** `2 MB`
- **Allowed MIME types:** `image/*`

**Configuration:**
```
Name: avatars
Public: true
File size limit: 2097152 (2MB)
Allowed MIME types: image/jpeg, image/png, image/gif, image/webp
```

---

#### Bucket 2: `verification-documents`

**Settings:**
- **Name:** `verification-documents`
- **Public bucket:** ❌ **NO** (Private - only accessible by owner/admin)
- **File size limit:** `5 MB`
- **Allowed MIME types:** `image/*, application/pdf`

**Configuration:**
```
Name: verification-documents
Public: false
File size limit: 5242880 (5MB)
Allowed MIME types: image/jpeg, image/png, application/pdf
```

---

#### Bucket 3: `post-attachments`

**Settings:**
- **Name:** `post-attachments`
- **Public bucket:** ✅ **YES** (Public access)
- **File size limit:** `10 MB`
- **Allowed MIME types:** `image/*, video/*, application/pdf`

**Configuration:**
```
Name: post-attachments
Public: true
File size limit: 10485760 (10MB)
Allowed MIME types: image/*, video/mp4, video/webm, application/pdf
```

---

#### Bucket 4: `message-attachments`

**Settings:**
- **Name:** `message-attachments`
- **Public bucket:** ❌ **NO** (Private - only accessible by conversation participants)
- **File size limit:** `25 MB`
- **Allowed MIME types:** `image/*, video/*, application/*, text/*`

**Configuration:**
```
Name: message-attachments
Public: false
File size limit: 26214400 (25MB)
Allowed MIME types: image/*, video/*, application/pdf, application/msword, 
                    application/vnd.openxmlformats-officedocument.*, text/*
```

---

## 🔐 Row Level Security (RLS) Policies

After creating the buckets, you need to set up RLS policies for secure access.

### Bucket: `avatars` (Public)

**Policy 1: Public Read Access**
```sql
-- Anyone can view avatars
CREATE POLICY "Public avatars are viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');
```

**Policy 2: Users can upload their own avatar**
```sql
-- Users can upload their own avatar
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

**Policy 3: Users can update their own avatar**
```sql
-- Users can update their own avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

**Policy 4: Users can delete their own avatar**
```sql
-- Users can delete their own avatar
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

---

### Bucket: `verification-documents` (Private)

**Policy 1: Users can upload their own documents**
```sql
-- Users can upload their own verification documents
CREATE POLICY "Users can upload their own verification documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'verification-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

**Policy 2: Users can view their own documents**
```sql
-- Users can view their own verification documents
CREATE POLICY "Users can view their own verification documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'verification-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

**Policy 3: Admins can view all documents**
```sql
-- Admins can view all verification documents
CREATE POLICY "Admins can view all verification documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'verification-documents' 
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()::text
    AND role = 'admin'
  )
);
```

---

### Bucket: `post-attachments` (Public)

**Policy 1: Anyone can view post attachments**
```sql
-- Anyone can view post attachments
CREATE POLICY "Post attachments are viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'post-attachments');
```

**Policy 2: Authenticated users can upload**
```sql
-- Authenticated users can upload post attachments
CREATE POLICY "Authenticated users can upload post attachments"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'post-attachments' 
  AND auth.role() = 'authenticated'
);
```

**Policy 3: Users can delete their own attachments**
```sql
-- Users can delete their own post attachments
CREATE POLICY "Users can delete their own post attachments"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'post-attachments' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

---

### Bucket: `message-attachments` (Private)

**Policy 1: Users can upload to conversations they're part of**
```sql
-- Users can upload attachments to their conversations
CREATE POLICY "Users can upload to their conversations"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'message-attachments' 
  AND auth.role() = 'authenticated'
);
```

**Policy 2: Users can view attachments in their conversations**
```sql
-- Users can view attachments from their conversations
CREATE POLICY "Users can view their conversation attachments"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'message-attachments' 
  AND EXISTS (
    SELECT 1 FROM public.conversation_participants cp
    JOIN public.messages m ON m.conversation_id = cp.conversation_id
    WHERE cp.user_id = auth.uid()::text
    AND m.attachment_url LIKE '%' || name
  )
);
```

---

## 🚀 Quick Setup Script

You can run these SQL commands in the **Supabase SQL Editor** to set up all policies at once:

```sql
-- Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public avatars are viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own verification documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own verification documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all verification documents" ON storage.objects;
DROP POLICY IF EXISTS "Post attachments are viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload post attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own post attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload to their conversations" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their conversation attachments" ON storage.objects;

-- Avatars policies (Public)
CREATE POLICY "Public avatars are viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Verification documents policies (Private)
CREATE POLICY "Users can upload their own verification documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'verification-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own verification documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'verification-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all verification documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'verification-documents' 
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()::text
    AND role = 'admin'
  )
);

-- Post attachments policies (Public)
CREATE POLICY "Post attachments are viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'post-attachments');

CREATE POLICY "Authenticated users can upload post attachments"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'post-attachments' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete their own post attachments"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'post-attachments' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Message attachments policies (Private)
CREATE POLICY "Users can upload to their conversations"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'message-attachments' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can view their conversation attachments"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'message-attachments' 
  AND EXISTS (
    SELECT 1 FROM public.conversation_participants cp
    JOIN public.messages m ON m.conversation_id = cp.conversation_id
    WHERE cp.user_id = auth.uid()::text
    AND m.attachment_url LIKE '%' || name
  )
);
```

---

## ✅ Verification

After setup, verify your buckets are working:

### 1. Check Buckets Exist
```sql
SELECT * FROM storage.buckets;
```

Expected output:
```
id | name                    | public | file_size_limit
---+------------------------+--------+-----------------
1  | avatars                | true   | 2097152
2  | verification-documents | false  | 5242880
3  | post-attachments       | true   | 10485760
4  | message-attachments    | false  | 26214400
```

### 2. Test Upload (from your app)

**Test Avatar Upload:**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Upload avatar
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.png`, file);
```

### 3. Test Access Control

- Try accessing a private document from another user → Should fail
- Try accessing a public avatar → Should succeed
- Admin should be able to view verification documents

---

## 🎨 File Path Convention

Use this naming structure for organized storage:

```
avatars/
  └── {user_id}/
      └── avatar.{ext}

verification-documents/
  └── {user_id}/
      ├── id_card.{ext}
      ├── linkedin_screenshot.{ext}
      └── phone_verification.{ext}

post-attachments/
  └── {user_id}/
      └── {post_id}/
          ├── image_1.{ext}
          ├── image_2.{ext}
          └── document.pdf

message-attachments/
  └── {user_id}/
      └── {conversation_id}/
          └── {timestamp}_{filename}.{ext}
```

---

## 🛠️ Troubleshooting

### Issue: "new row violates row-level security policy"

**Solution:** Make sure:
1. RLS is enabled on `storage.objects`
2. Policies are created correctly
3. User is authenticated (check `auth.uid()`)

### Issue: "Policy check violation"

**Solution:**
1. Check file path matches policy (e.g., `{user_id}/filename`)
2. Verify user has correct role
3. Check bucket name is correct

### Issue: Files not loading

**Solution:**
1. For public buckets: Check bucket is marked as public
2. For private buckets: Use signed URLs
3. Verify CORS settings if accessing from browser

---

## 📚 Next Steps

After setting up storage:

1. ✅ Test file upload in onboarding form
2. ✅ Test avatar upload in settings
3. ✅ Implement image preview components
4. ✅ Add file size validation
5. ✅ Add file type validation
6. ✅ Implement image optimization

---

**Last Updated:** October 18, 2025  
**Status:** Ready for implementation
