# UniMinder – Full Project Context for Copilot

This document provides Copilot with the **complete context** for building UniMinder, including features for Students, Alumni, Aspirants, and Admin. It covers project vision, architecture, tech stack, schema, and development rules.

**Last Updated:** October 15, 2025  
**Version:** 1.1.0  
**Status:** Active Development

---

## 📌 Project Vision

UniMinder is a mentorship and career guidance platform designed for Indian colleges. It connects **Students**, **Alumni**, and **Aspirants** for authentic networking, real-time chat, posts, and mentorship. It also includes an **Admin Panel** for moderation, analytics, and governance.

Goals:

* Empower students with verified alumni mentorship.
* Provide alumni a way to give back (referrals, career guidance).
* Help aspirants explore colleges and career paths.
* Ensure authenticity and safety through admin moderation.

---

## ⚙️ Tech Stack

* **Frontend:** Next.js 15.5.2 (App Router), React 19, TailwindCSS 4, shadcn/ui, Lucide-react
* **Backend/DB:** Supabase (Postgres, Realtime, Row Level Security, Edge Functions)
* **Auth:** Clerk (Google/Email sign-in, JWT, session handling, webhooks)
* **Notifications:** Resend (emails), Twilio (WhatsApp)
* **Deployment:** Vercel (frontend + API routes),UniMinder is a mentorship and career guidance platform designed for Indian colleges. It connects **Students**, **Alumni**, and **Aspirants** for authentic networking, real-time chat, posts, and mentorship. It also includes an **Admin Panel** for moderation, analytics, and governance.

Goals:

* Empower students with verified alumni mentorship.
* Provide alumni a way to give back (referrals, career guidance).
* Help aspirants explore colleges and career paths.
* Ensure authenticity and safety through admin moderation. Supabase Cloud
* **Type Safety:** TypeScript 5, Zod validation
* **State Management:** React Hook Form, Server Components
* **UI Components:** Radix UI primitives with shadcn/ui

---

## 🗄️ Database Schema (Supabase)

The complete schema is in `/db/complete_schema.sql`. Key tables include:

### Core Tables

**profiles** - User profiles with role-based fields
```sql
- id (text, PK) - Clerk userId
- user_id (text) - Clerk userId reference
- role (user_role enum: student/alumni/aspirant/admin)
- full_name, email, avatar_url, location
- college, degree, branch, passing_year
- company, designation, years_of_experience
- skills[], interests[], looking_for[]
- linkedin, bio, preferences (jsonb)
- onboarded (boolean) - tracks onboarding completion
- is_active, is_verified, last_seen
- created_at, updated_at
```

**posts** - Job postings, referrals, updates
```sql
- id (bigserial, PK)
- author_id (references profiles)
- type (job/referral/update/question/resource)
- title, content, external_url
- company_name, location, salary_range
- experience_required, skills_required[], job_type
- tags[], is_featured, is_active
- views_count, likes_count, comments_count, applications_count
- created_at, updated_at, expires_at
```

**post_interactions** - Likes, bookmarks, applications
```sql
- id, post_id, user_id
- interaction_type (like/bookmark/apply/view)
- Unique constraint on (post_id, user_id, interaction_type)
```

**post_comments** - Comments with threading support
```sql
- id, post_id, author_id, content
- parent_comment_id (for nested replies)
- is_edited, created_at, updated_at
```

### Messaging Tables

**conversations** - Chat conversations
```sql
- id (uuid, PK)
- type (direct/group), title
- created_by, is_active
- created_at, updated_at
```

**conversation_participants** - Who's in each conversation
```sql
- conversation_id, user_id (composite PK)
- role (admin/member), joined_at, left_at
- is_muted, last_read_at
```

**messages** - Chat messages
```sql
- id, conversation_id, sender_id
- content, message_type (text/image/file/system)
- attachment_url, reply_to_id
- is_edited, is_deleted
- created_at, updated_at
```

**message_reads** - Read receipts
```sql
- message_id, user_id (composite PK)
- read_at
```

### Mentorship & Admin Tables

**mentorship_connections** - Mentor-mentee relationships
```sql
- id (uuid), mentor_id, mentee_id
- status (pending/accepted/declined/completed/cancelled)
- requested_at, accepted_at, completed_at
- notes, rating (1-5), feedback
```

**notifications** - Notification queue
```sql
- id, user_id, type, title, content
- data (jsonb), is_read
- channel (in_app/email/whatsapp)
- status (queued/sent/failed/delivered)
- created_at, sent_at
```

**user_preferences** - User settings
```sql
- user_id (PK), email_notifications, push_notifications
- notification_frequency (instant/daily/weekly/never)
- privacy_level (public/connections/private)
- show_email, show_phone
```

**reports** - Content moderation
```sql
- id, reporter_id, reported_user_id, reported_post_id
- reason (spam/harassment/inappropriate_content/fake_profile/other)
- status (pending/under_review/resolved/dismissed)
- resolved_by, resolved_at, resolution_notes
```

### Security Features

* **Row Level Security (RLS)** enabled on all tables
* **Policies** enforce user can only access/modify their own data
* **Real-time subscriptions** enabled for messages, notifications, conversations
* **Indexes** optimized for common queries
* **Triggers** auto-update post stats (likes, comments counts)
* **Functions** for common operations (increment_post_views, update_post_stats)

---

## 🔑 Authentication Flow

### User Registration & Onboarding

1. **Sign Up**: User signs up with Clerk (Google/Email) → `userId` created
2. **Webhook Sync**: Clerk webhook (`/api/clerk-webhook/route.ts`) receives event
   - Validates webhook signature using Svix
   - Inserts basic profile into Supabase `profiles` table
   - Sets `onboarded = false` initially
3. **Onboarding Redirect**: Middleware checks if user has completed onboarding
   - If `onboarded = false`, redirects to `/onboarding`
   - Multi-step form collects role-specific data
4. **Role Selection**: User selects role (student/alumni/aspirant)
   - Dynamic form fields based on role
   - Validates and saves to Supabase via `/api/onboarding/save`
   - Sets `onboarded = true` on completion
5. **Dashboard Access**: User redirected to role-specific dashboard
   - `/dashboard/student`, `/dashboard/alumni`, or `/dashboard/aspirant`
   - Middleware protects all dashboard routes

### Session Management

- **Middleware** (`src/middleware.ts`): Protects routes using Clerk
  - Public routes: `/`, `/sign-in/*`, `/sign-up/*`, `/api/health`, `/api/clerk-webhook`
  - Protected routes: `/dashboard/*`, `/posts/*`, `/messages/*`, `/profile/*`
  - Uses `clerkMiddleware()` with `auth.protect()`
- **Client Components**: Use `useUser()` hook from Clerk
- **Server Components**: Use `auth()` from Clerk for userId
- **API Routes**: Access `auth()` for user authentication

### Security Features

- JWT-based sessions via Clerk
- Service role key for server-side Supabase operations
- Row Level Security policies on all tables
- Webhook signature verification with Svix
- Rate limiting on API routes (planned)

---

## 🧑‍🤝‍🧑 Roles & Features

### 👩‍🎓 Student

* Profile: branch, year, skills.
* Chat with alumni.
* Browse alumni posts (jobs, referrals, updates).
* Apply/bookmark posts.
* Receive notifications when mentors reply or post.

### 👨‍💼 Alumni

* Verified profile with graduation details.
* Post job openings/referrals.
* Share updates or blogs.
* Offer mentorship sessions (free/paid).
* Chat with students/aspirants.

### 🌱 Aspirant

* Profile: education level, entrance exams, goals.
* Ask questions about college life/admissions.
* Follow discussions and alumni/student posts.
* Bookmark useful advice.

### 🛡️ Admin

* Manage **users** (view, approve, suspend, delete).
* Verify alumni authenticity.
* Moderate posts, chats, and flagged content.
* Manage **notifications** and announcements.
* Analytics dashboard (active users, posts, chat activity).
* Manage forums/categories.
* Handle disputes and reports.
* View financial transactions (future paid mentorship).

---

## 📝 Development Standards

### Code Quality

* **TypeScript First**: All files must use TypeScript with strict mode enabled
* **Type Definitions**: Use types from `src/types/index.ts` - includes Profile, Post, Message, etc.
* **No `any` types**: Use proper TypeScript types or `unknown` with type guards
* **Zod Validation**: Validate all form inputs and API payloads using Zod schemas

### Component Architecture

* **Server Components by Default**: Use React Server Components unless interactivity needed
* **Client Components**: Mark with `"use client"` only when necessary (forms, hooks, interactivity)
* **shadcn/ui**: Use shadcn/ui components from `src/components/ui/`
* **Lucide Icons**: Use Lucide-react for all icons (optimized with tree-shaking)
* **Component Structure**:
  ```
  src/components/
    ui/ - shadcn/ui primitives
    dashboard/ - role-specific dashboard components
    onboarding/ - onboarding flow components
    providers/ - context providers (theme, user)
  ```

### Database & API

* **Supabase Helpers**: Use helper functions from `src/lib/supabase.ts`
  - `db.profiles.findById()`, `db.profiles.findByUserId()`, `db.profiles.upsert()`
  - `db.posts.findById()`, `db.posts.findByAuthor()`
* **Singleton Pattern**: Supabase client is singleton - use `getSupabase()`
* **Error Handling**: Always try-catch database operations, log errors with context
* **Service Role Key**: Use for server-side operations (API routes, webhooks)
* **Anon Key**: Use for client-side operations with RLS

### Environment Variables

**Required Variables** (create `.env.local`):
```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...  # Server-side only
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...  # Client-safe

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Optional (Future)
RESEND_API_KEY=re_...  # Email notifications
TWILIO_ACCOUNT_SID=AC...  # WhatsApp notifications
TWILIO_AUTH_TOKEN=...
```

### File Naming

* **Components**: PascalCase (`UserProfile.tsx`, `DashboardCard.tsx`)
* **Utilities**: kebab-case (`supabase.ts`, `rate-limit.ts`)
* **Types**: camelCase exports (`export interface Profile`)
* **API Routes**: kebab-case folders (`/api/clerk-webhook/route.ts`)

### Security Best Practices

* **Never expose service role key** to client
* **Use RLS policies** for all database access
* **Validate webhook signatures** (Clerk, payment providers)
* **Sanitize user input** before database operations
* **Rate limit API endpoints** (use `src/lib/rate-limit.ts`)
* **Admin-only routes**: Check user role in middleware/page
* **XSS Prevention**: React handles by default, but be careful with `dangerouslySetInnerHTML`

### Performance Optimization

* **Code Splitting**: Dynamic imports for heavy components
* **Image Optimization**: Use Next.js `<Image>` component
* **Bundle Optimization**: Tree-shaking enabled in `next.config.ts`
* **Remove console.log**: Automatically removed in production builds
* **Database Indexes**: Already created in schema for common queries
* **Real-time**: Use sparingly, only for chat and notifications

---

## 🚀 App Structure

### Current Implementation

```
src/
├── app/
│   ├── (marketing)/
│   │   └── page.tsx              # Landing page with hero, features, CTAs
│   ├── sign-in/[[...rest]]/
│   │   └── page.tsx              # Clerk sign-in page
│   ├── sign-up/[[...rest]]/
│   │   └── page.tsx              # Clerk sign-up page
│   ├── onboarding/
│   │   └── page.tsx              # Multi-step onboarding form
│   ├── dashboard/
│   │   ├── page.tsx              # Dashboard router (redirects by role)
│   │   ├── student/page.tsx      # Student dashboard
│   │   ├── alumni/page.tsx       # Alumni dashboard
│   │   └── aspirant/page.tsx     # Aspirant dashboard
│   ├── api/
│   │   ├── clerk-webhook/
│   │   │   └── route.ts          # Clerk → Supabase sync
│   │   ├── onboarding/
│   │   │   ├── route.ts          # Get onboarding data
│   │   │   ├── save/route.ts     # Save onboarding data
│   │   │   └── status/route.ts   # Check onboarding status
│   │   ├── roles/route.ts        # Get/update user role
│   │   ├── health/route.ts       # Health check endpoint
│   │   └── debug/profile/route.ts # Debug profile data
│   ├── globals.css               # Global styles & Tailwind
│   ├── layout.tsx                # Root layout with providers
│   └── middleware.ts             # Auth & route protection
│
├── components/
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx, card.tsx, input.tsx, etc.
│   │   ├── form.tsx, select.tsx, progress.tsx
│   │   └── sidebar.tsx           # Sidebar primitives
│   ├── dashboard/                # Dashboard components
│   │   ├── student.tsx           # Student dashboard UI
│   │   ├── alumni.tsx            # Alumni dashboard UI
│   │   ├── aspirant.tsx          # Aspirant dashboard UI
│   │   └── overview/             # Dashboard overview cards
│   ├── onboarding/
│   │   └── multi-step-form.tsx   # Onboarding wizard
│   ├── providers/
│   │   └── user-provider.tsx     # User context provider
│   ├── navbar.tsx                # Marketing navbar
│   ├── footer.tsx                # Marketing footer
│   ├── hero.tsx, features-8.tsx  # Landing page sections
│   ├── sidebar.tsx               # Dashboard sidebar
│   ├── app-sidebar.tsx           # App-wide sidebar
│   └── theme-provider.tsx        # Dark mode provider
│
├── lib/
│   ├── supabase.ts               # Supabase client & helpers
│   ├── supabase-edge.ts          # Edge-compatible client
│   ├── utils.ts                  # Utility functions (cn, etc.)
│   ├── errors.ts                 # Error handling utilities
│   └── rate-limit.ts             # Rate limiting (future)
│
├── types/
│   └── index.ts                  # TypeScript type definitions
│
└── hooks/
    └── use-mobile.ts             # Mobile detection hook

db/
├── complete_schema.sql           # Full database schema
├── create_profiles.sql           # Legacy profile creation
├── sample_data.sql               # Sample data for testing
└── update_profiles.sql           # Profile migration scripts
```

### Planned Structure (To Be Implemented)

```
src/app/
├── posts/                        # Posts module
│   ├── page.tsx                  # Browse all posts
│   ├── create/page.tsx           # Create post (alumni only)
│   ├── [id]/page.tsx             # View post details
│   └── [id]/edit/page.tsx        # Edit post
│
├── messages/                     # Messaging module
│   ├── page.tsx                  # Conversation list
│   └── [id]/page.tsx             # Chat thread with real-time
│
├── profile/                      # Profile management
│   ├── page.tsx                  # View own profile
│   ├── edit/page.tsx             # Edit profile
│   └── [userId]/page.tsx         # View other user's profile
│
├── mentorship/                   # Mentorship module
│   ├── page.tsx                  # Browse mentors
│   ├── requests/page.tsx         # Manage requests
│   └── [id]/page.tsx             # Mentorship details
│
├── admin/                        # Admin panel
│   ├── page.tsx                  # Admin dashboard
│   ├── users/page.tsx            # User management
│   ├── posts/page.tsx            # Post moderation
│   ├── reports/page.tsx          # Handle reports
│   └── analytics/page.tsx        # Analytics dashboard
│
└── api/
    ├── posts/                    # Posts API
    ├── messages/                 # Messaging API
    ├── notifications/            # Notifications queue
    └── admin/                    # Admin operations
```

---

## 🔔 Notifications Flow

1. Insert into `notifications` when event occurs (new post, message, reply).
2. Supabase Edge Function processes queue.

   * `channel=email` → Resend.
   * `channel=whatsapp` → Twilio.
3. Status updated in DB.

---

## 📊 Admin Panel Features

* Role-based access: only `role=admin` can view `/admin` routes.
* User Management: approve/ban users, reset roles.
* Post Moderation: flag, edit, or delete inappropriate posts.
* Reports: see user reports, resolve disputes.
* Analytics: charts for active users, posts created, mentorship activity.
* Communication: send announcements to all users.
* Optional: payment/transaction tracking for future mentorship marketplace.

---

## 📅 Development Roadmap & Milestones

### ✅ Phase 1: Foundation (Completed)
- [x] Project setup with Next.js 15 + TypeScript
- [x] Clerk authentication integration
- [x] Supabase database setup with complete schema
- [x] Clerk → Supabase webhook sync
- [x] Multi-step onboarding flow with role selection
- [x] Role-based dashboard routing
- [x] Student, Alumni, and Aspirant dashboard UI
- [x] Dark mode support with next-themes
- [x] shadcn/ui component library setup
- [x] Database-integrated dashboards with real stats
- [x] Middleware for route protection
- [x] Type-safe database helpers

### 🚧 Phase 2: Core Features (In Progress)
- [ ] **Posts Module**
  - [ ] Browse posts feed (all users)
  - [ ] Create/edit posts (alumni only)
  - [ ] Post interactions (like, bookmark, apply)
  - [ ] Comments with threading
  - [ ] Post search and filtering
  - [ ] Tag-based navigation
- [ ] **Profile Management**
  - [ ] View/edit own profile
  - [ ] View other users' profiles
  - [ ] Avatar upload
  - [ ] Skills and interests management
  - [ ] Privacy settings
- [ ] **Search & Discovery**
  - [ ] Search users by role, college, skills
  - [ ] Search posts by tags, company
  - [ ] Filter and sort functionality

### 📋 Phase 3: Communication (Planned)
- [ ] **Real-time Messaging**
  - [ ] Direct messaging between users
  - [ ] Group conversations
  - [ ] Message read receipts
  - [ ] Real-time updates with Supabase subscriptions
  - [ ] Image/file attachments
- [ ] **Notifications**
  - [ ] In-app notifications
  - [ ] Email notifications (Resend)
  - [ ] WhatsApp notifications (Twilio)
  - [ ] Notification preferences

### 🎓 Phase 4: Mentorship (Planned)
- [ ] **Mentorship Connections**
  - [ ] Request mentorship from alumni
  - [ ] Accept/decline requests
  - [ ] Active mentorship tracking
  - [ ] Mentorship goals and progress
  - [ ] Rating and feedback system
- [ ] **Mentorship Discovery**
  - [ ] Browse available mentors
  - [ ] Filter by expertise, company, college
  - [ ] Mentor profiles with availability

### 🛡️ Phase 5: Admin & Moderation (Planned)
- [ ] **Admin Dashboard**
  - [ ] User analytics and metrics
  - [ ] Active users, posts, messages stats
  - [ ] Growth charts and trends
- [ ] **User Management**
  - [ ] View all users by role
  - [ ] Verify alumni profiles
  - [ ] Suspend/ban users
  - [ ] Reset passwords
- [ ] **Content Moderation**
  - [ ] Review reported posts
  - [ ] Review reported users
  - [ ] Edit/delete inappropriate content
  - [ ] Moderation history
- [ ] **Communications**
  - [ ] Send announcements to all users
  - [ ] Targeted notifications by role

### 🚀 Phase 6: Advanced Features (Future)
- [ ] AI-powered mentor matching
- [ ] Video mentorship (WebRTC integration)
- [ ] Paid mentorship marketplace with Stripe
- [ ] Advanced analytics for admins
- [ ] Mobile app (React Native)
- [ ] University-specific branded portals
- [ ] Events and webinar management
- [ ] Resource library with categories
- [ ] Career path recommendations

### 🏁 Phase 7: Launch & Scale
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Load testing
- [ ] Security audit
- [ ] Production deployment
- [ ] Monitoring and logging
- [ ] User feedback collection
- [ ] Marketing website

---

## 🧪 Testing Strategy

### Current Testing Approach
- **Mock Data**: Dashboard pages support mock profiles for development
- **Sample Data**: Use `/db/sample_data.sql` for realistic test data
- **Manual Testing**: Each feature tested across all roles
- **Type Safety**: TypeScript catches errors at compile time

### Future Testing (To Implement)
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Test API routes and database operations
- **E2E Tests**: Playwright for user flows
- **Load Testing**: k6 for performance
- **Security Testing**: OWASP guidelines

---

## 🐛 Common Issues & Solutions

### Issue: Dashboard shows 0 stats
**Solution**: Run sample data script or wait for user-generated content

### Issue: Onboarding redirect loop
**Solution**: Check `onboarded` field in profiles table is `true`

### Issue: Supabase connection error
**Solution**: Verify environment variables and RLS policies

### Issue: Build fails with TypeScript errors
**Solution**: Clear `.next` cache and rebuild

### Issue: Clerk webhook not syncing
**Solution**: Check webhook secret and Svix signature validation

---

## 📚 Key Documentation Files

- **`QUICK_START_GUIDE.md`** - Setup instructions and testing guide
- **`docs/context.md`** - This file, complete project context
- **`db/complete_schema.sql`** - Full database schema with RLS
- **`db/sample_data.sql`** - Sample data for testing
- **`src/types/index.ts`** - TypeScript type definitions
- **`src/lib/supabase.ts`** - Database helper functions

---

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Verify database schema
npm run db:verify

# Generate Supabase types (update YOUR_PROJECT_ID first)
npm run db:types
```

---

## 🌐 API Endpoints

### Public Endpoints
- `GET /api/health` - Health check
- `POST /api/clerk-webhook` - Clerk user sync webhook

### Protected Endpoints
- `GET /api/onboarding` - Get onboarding data
- `POST /api/onboarding/save` - Save onboarding data
- `GET /api/onboarding/status` - Check if user completed onboarding
- `GET /api/roles` - Get user role
- `GET /api/debug/profile` - Debug profile data (dev only)

### Planned Endpoints
- `/api/posts` - CRUD for posts
- `/api/messages` - CRUD for messages
- `/api/notifications` - Notification queue
- `/api/mentorship` - Mentorship requests
- `/api/admin/*` - Admin operations

---

## 🎨 Design System

### Colors
- Primary: Follows system theme (light/dark mode)
- Background: `bg-background`
- Foreground: `text-foreground`
- Muted: `text-muted-foreground`
- Accent: `bg-accent`

### Typography
- Headings: `font-bold` with size variants
- Body: `text-base` or `text-sm`
- Muted: `text-muted-foreground`

### Components
- Use shadcn/ui components from `src/components/ui/`
- Customize in `components.json`
- Follow Radix UI accessibility guidelines

### Spacing
- Use Tailwind spacing scale (4, 8, 12, 16, 24, 32, 48, 64)
- Consistent padding and margins

---

## 🛠️ Developer Tools

### VS Code Extensions (Recommended)
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- PostCSS Language Support
- TypeScript Hero
- GitHub Copilot

### Browser Extensions
- React Developer Tools
- Redux DevTools (if state management added)
- Lighthouse (performance auditing)

---

## 🚀 Deployment

### Vercel (Frontend)
1. Connect GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to `main`

### Supabase (Database)
1. Database already hosted on Supabase Cloud
2. Use migrations for schema changes
3. Enable real-time for messages and notifications

### Environment Variables
Ensure all required variables are set in Vercel:
- Supabase credentials
- Clerk credentials
- Third-party API keys (Resend, Twilio)

---

## 📞 Support & Resources

### Documentation
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Clerk: https://clerk.com/docs
- shadcn/ui: https://ui.shadcn.com
- Tailwind CSS: https://tailwindcss.com/docs

### Community
- GitHub Issues for bug reports
- GitHub Discussions for questions
- Project wiki for additional docs

---

## 🎯 Success Metrics

### Technical Metrics
- Page load time < 2 seconds
- API response time < 200ms
- Build time < 3 minutes
- TypeScript coverage 100%
- Zero production errors

### User Metrics (Future)
- User registration rate
- Onboarding completion rate
- Daily/monthly active users
- Posts created per day
- Messages sent per day
- Mentorship connections made
- User retention rate

---

## ✨ What GitHub Copilot Should Know

With this context, GitHub Copilot should:

1. **Suggest Next.js 15 + React 19 patterns** (App Router, Server Components)
2. **Use shadcn/ui components** from `src/components/ui/`
3. **Follow TypeScript types** from `src/types/index.ts`
4. **Use Supabase helpers** from `src/lib/supabase.ts`
5. **Enforce role-based logic** (student/alumni/aspirant/admin)
6. **Generate database queries** with proper error handling
7. **Use Clerk authentication** patterns (`auth()`, `useUser()`)
8. **Apply Tailwind CSS** utility classes
9. **Follow security best practices** (RLS, input validation)
10. **Maintain code consistency** with existing patterns

---

**Last Updated:** October 15, 2025  
**Maintainer:** UniMinder Development Team  
**Version:** 1.1.0
