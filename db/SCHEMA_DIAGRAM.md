# UniMinder Database Schema - Visual Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                        UNIMINDER DATABASE SCHEMA                      │
│                   (24 Tables, 40+ Indexes, 9 Functions)              │
└──────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      👤 USER MANAGEMENT                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────────────────────┐                            │
│  │ profiles (MAIN USER TABLE)          │                            │
│  ├─────────────────────────────────────┤                            │
│  │ • id (PK)                           │                            │
│  │ • user_id (Clerk ID)                │                            │
│  │ • email, role, full_name            │                            │
│  │ • location, bio, avatar_url         │                            │
│  │ • college, degree, branch           │─────┐                      │
│  │ • company, designation              │     │                      │
│  │ • skills[], interests[]             │     │                      │
│  │ • verification_status               │     │                      │
│  │ • onboarded, is_active              │     │                      │
│  └─────────────────────────────────────┘     │                      │
│           │                                   │                      │
│           ├────────────────────────────┐      │                      │
│           │                            │      │                      │
│  ┌────────▼──────────┐    ┌───────────▼──────▼────┐                │
│  │ user_preferences  │    │ verification_requests  │                │
│  ├───────────────────┤    ├────────────────────────┤                │
│  │ • user_id (FK)    │    │ • user_id (FK)         │                │
│  │ • notifications   │    │ • verification_type    │                │
│  │ • privacy_level   │    │ • status, documents    │                │
│  │ • theme, language │    │ • phone_number, code   │                │
│  └───────────────────┘    └────────────────────────┘                │
│                                     │                                │
│                            ┌────────▼───────────┐                   │
│                            │ verification_docs  │                   │
│                            ├────────────────────┤                   │
│                            │ • request_id (FK)  │                   │
│                            │ • document_type    │                   │
│                            │ • file_url, status │                   │
│                            └────────────────────┘                   │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                  📝 CONTENT & ENGAGEMENT                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────┐                               │
│  │ posts                            │                               │
│  ├──────────────────────────────────┤                               │
│  │ • id (PK)                        │                               │
│  │ • author_id (FK → profiles)      │────────┐                      │
│  │ • type (job/referral/question)   │        │                      │
│  │ • title, content                 │        │                      │
│  │ • company_name, location         │        │                      │
│  │ • tags[], is_featured            │        │                      │
│  │ • views, likes, comments count   │        │                      │
│  └──────────────────────────────────┘        │                      │
│           │              │                    │                      │
│           │              │                    │                      │
│  ┌────────▼──────┐  ┌───▼──────────┐  ┌──────▼────────────┐        │
│  │post_comments  │  │post_inter-   │  │ (author profile)  │        │
│  ├───────────────┤  │  actions     │  └───────────────────┘        │
│  │• post_id (FK) │  ├──────────────┤                               │
│  │• author_id    │  │• post_id (FK)│                               │
│  │• content      │  │• user_id (FK)│                               │
│  │• parent_id    │  │• type (like, │                               │
│  │  (threading)  │  │  bookmark,   │                               │
│  └───────────────┘  │  apply)      │                               │
│                     └──────────────┘                               │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    💬 MESSAGING SYSTEM (REALTIME)                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────────────────┐                                │
│  │ conversations                   │                                │
│  ├─────────────────────────────────┤                                │
│  │ • id (PK, UUID)                 │                                │
│  │ • type (direct/group)           │                                │
│  │ • created_by (FK → profiles)    │                                │
│  │ • last_message_at               │                                │
│  └─────────────────────────────────┘                                │
│           │                │                                         │
│           │                │                                         │
│  ┌────────▼──────────┐  ┌─▼──────────────────┐                     │
│  │ conversation_     │  │ messages [REALTIME]│                     │
│  │  participants     │  ├────────────────────┤                     │
│  ├───────────────────┤  │ • id (PK)          │                     │
│  │ • conversation_id │  │ • conversation_id  │                     │
│  │ • user_id (FK)    │  │ • sender_id (FK)   │                     │
│  │ • role, is_muted  │  │ • content          │                     │
│  │ • last_read_at    │  │ • message_type     │                     │
│  └───────────────────┘  │ • attachment_url   │                     │
│                         │ • reply_to_id      │                     │
│                         └────────────────────┘                     │
│                                  │                                  │
│                         ┌────────▼────────┐                        │
│                         │ message_reads   │                        │
│                         ├─────────────────┤                        │
│                         │ • message_id(FK)│                        │
│                         │ • user_id (FK)  │                        │
│                         │ • read_at       │                        │
│                         └─────────────────┘                        │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│               🤝 MENTORSHIP & CONNECTIONS                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────┐                               │
│  │ mentorship_connections           │                               │
│  ├──────────────────────────────────┤                               │
│  │ • id (PK, UUID)                  │                               │
│  │ • mentor_id (FK → profiles)      │                               │
│  │ • mentee_id (FK → profiles)      │                               │
│  │ • status (pending/accepted...)   │                               │
│  │ • message, areas[]               │                               │
│  │ • rating, feedback               │                               │
│  └──────────────────────────────────┘                               │
│                                                                       │
│  ┌──────────────────────────────────┐                               │
│  │ connection_requests              │                               │
│  ├──────────────────────────────────┤                               │
│  │ • requester_id (FK → profiles)   │                               │
│  │ • recipient_id (FK → profiles)   │                               │
│  │ • status (pending/accepted...)   │                               │
│  │ • message                        │                               │
│  └──────────────────────────────────┘                               │
│                    │                                                 │
│           ┌────────▼─────────┐                                      │
│           │ user_connections │                                      │
│           ├──────────────────┤                                      │
│           │ • user_id (FK)   │                                      │
│           │ • connected_id   │                                      │
│           │ • note, tags[]   │                                      │
│           └──────────────────┘                                      │
│                                                                       │
│  ┌──────────────────────────────────┐                               │
│  │ user_blocks                      │                               │
│  ├──────────────────────────────────┤                               │
│  │ • blocker_id (FK → profiles)     │                               │
│  │ • blocked_id (FK → profiles)     │                               │
│  │ • reason, blocked_at             │                               │
│  └──────────────────────────────────┘                               │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                 🔔 NOTIFICATIONS (REALTIME)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────┐                           │
│  │ notifications [REALTIME]             │                           │
│  ├──────────────────────────────────────┤                           │
│  │ • id (PK)                            │                           │
│  │ • user_id (FK → profiles)            │                           │
│  │ • type (message/post_like/...)       │                           │
│  │ • title, content                     │                           │
│  │ • data (jsonb)                       │                           │
│  │ • is_read, channel                   │                           │
│  │ • related_user_id, related_post_id   │                           │
│  └──────────────────────────────────────┘                           │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                  🛡️ MODERATION & SAFETY                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────┐                               │
│  │ reports                          │                               │
│  ├──────────────────────────────────┤                               │
│  │ • reporter_id (FK → profiles)    │                               │
│  │ • reported_user_id (FK)          │                               │
│  │ • reported_post_id (FK)          │                               │
│  │ • reason, description            │                               │
│  │ • status (pending/resolved...)   │                               │
│  │ • resolved_by, action_taken      │                               │
│  └──────────────────────────────────┘                               │
│                                                                       │
│  ┌──────────────────────────────────┐                               │
│  │ moderation_actions               │                               │
│  ├──────────────────────────────────┤                               │
│  │ • moderator_id (FK → profiles)   │                               │
│  │ • target_user_id (FK)            │                               │
│  │ • action_type (warn/suspend...)  │                               │
│  │ • reason, duration               │                               │
│  └──────────────────────────────────┘                               │
│                                                                       │
│  ┌──────────────────────────────────┐                               │
│  │ user_suspensions                 │                               │
│  ├──────────────────────────────────┤                               │
│  │ • user_id (FK → profiles)        │                               │
│  │ • suspended_by (FK)              │                               │
│  │ • expires_at, is_permanent       │                               │
│  └──────────────────────────────────┘                               │
│                                                                       │
│  ┌──────────────────────────────────┐                               │
│  │ audit_logs                       │                               │
│  ├──────────────────────────────────┤                               │
│  │ • user_id (FK → profiles)        │                               │
│  │ • action, resource_type          │                               │
│  │ • old_values, new_values (jsonb) │                               │
│  │ • ip_address, metadata           │                               │
│  └──────────────────────────────────┘                               │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      🔑 SECURITY FEATURES                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ✅ Row Level Security (RLS) enabled on ALL tables                  │
│  ✅ User-based access control via auth.uid()                        │
│  ✅ Blocked user filtering in policies                              │
│  ✅ Admin override policies for moderation                          │
│  ✅ Service role for backend operations                             │
│  ✅ Anon key for client-side requests                               │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    ⚡ PERFORMANCE FEATURES                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  • 40+ Indexes for fast queries                                     │
│  • Composite indexes on common filter combinations                  │
│  • GIN indexes for array columns (tags, skills)                     │
│  • Partial indexes for active records                               │
│  • Auto-updating statistics via triggers                            │
│  • Optimized foreign key indexes                                    │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    🔄 REALTIME SUBSCRIPTIONS                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  📡 Realtime Enabled Tables:                                        │
│     • messages             → Instant chat                           │
│     • conversations        → Conversation updates                   │
│     • notifications        → Live notifications                     │
│     • mentorship_connections → Request updates                      │
│     • connection_requests  → Connection alerts                      │
│     • typing_indicators    → Live typing status                     │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    💾 STORAGE BUCKETS                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  📁 avatars (Public, 2MB)                                           │
│     → User profile pictures                                         │
│                                                                       │
│  📁 verification-documents (Private, 5MB)                           │
│     → ID cards for verification                                     │
│                                                                       │
│  📁 post-attachments (Public, 10MB)                                 │
│     → Images attached to posts                                      │
│                                                                       │
│  📁 message-attachments (Private, 25MB)                             │
│     → Files shared in conversations                                 │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    🛠️ DATABASE FUNCTIONS                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  1. update_updated_at_column()     → Auto-timestamp updates         │
│  2. update_post_stats()            → Engagement count updates       │
│  3. update_comment_count()         → Comment count tracking         │
│  4. increment_post_views()         → Safe view increment            │
│  5. get_unread_message_count()     → Unread message query           │
│  6. mark_notifications_read()      → Bulk notification update       │
│  7. is_user_blocked()              → Block status check             │
│  8. clean_expired_tokens()         → Token cleanup                  │
│  9. record_migration()             → Migration tracking             │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        📊 DATABASE STATS                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Total Tables:      24                                              │
│  Total Indexes:     40+                                             │
│  Total Functions:   9                                               │
│  Total Triggers:    6                                               │
│  RLS Policies:      50+                                             │
│  Custom Types:      5 (ENUMs)                                       │
│  Lines of SQL:      2000+                                           │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘

Legend:
─────────────────────────────
PK  = Primary Key
FK  = Foreign Key
[]  = Array field
()  = Optional/Nullable
→   = References/Points to
═══ = Strong relationship
───  = Weak relationship
```
