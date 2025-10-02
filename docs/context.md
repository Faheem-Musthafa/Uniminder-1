# UniMinder – Full Project Context for Copilot

This document provides Copilot with the **complete context** for building UniMinder, including features for Students, Alumni, Aspirants, and Admin. It covers project vision, architecture, tech stack, schema, and development rules.

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

* **Frontend:** Next.js (App Router), TailwindCSS, shadcn/ui, Lucide-react
* **Backend/DB:** Supabase (Postgres, Realtime, Edge Functions)
* **Auth:** Clerk (Google/Email sign-in, JWT, session handling)
* **Notifications:** Resend (emails), Twilio (WhatsApp)
* **Deployment:** Vercel (frontend + API routes), Supabase Cloud

---

## 🗄️ Database Schema (Supabase)

```sql
create type public.user_role as enum ('student','alumni','aspirant','admin');

create table public.profiles (
  id text primary key, -- Clerk userId
  role user_role not null,
  full_name text not null,
  college text,
  branch text,
  passing_year int,
  skills text[],
  linkedin text,
  company text,
  designation text,
  entrance_exam text,
  target_college text,
  created_at timestamptz default now()
);

create table public.posts (
  id bigserial primary key,
  author_id text references public.profiles(id) on delete cascade,
  kind text check (kind in ('job','referral','update')) not null,
  title text not null,
  content text,
  url text,
  tags text[],
  created_at timestamptz default now()
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  created_by text references public.profiles(id) on delete cascade,
  created_at timestamptz default now()
);

create table public.conversation_participants (
  conversation_id uuid references public.conversations(id) on delete cascade,
  user_id text references public.profiles(id) on delete cascade,
  added_at timestamptz default now(),
  primary key (conversation_id, user_id)
);

create table public.messages (
  id bigserial primary key,
  conversation_id uuid references public.conversations(id) on delete cascade,
  sender_id text references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz default now()
);

create table public.notifications (
  id bigserial primary key,
  user_id text references public.profiles(id) on delete cascade,
  channel text check (channel in ('email','whatsapp')) not null,
  template text not null,
  payload jsonb default '{}'::jsonb,
  status text check (status in ('queued','sent','failed')) default 'queued',
  created_at timestamptz default now()
);
```

---

## 🔑 Authentication Flow

1. User signs up with Clerk → `userId` created.
2. Clerk webhook inserts user into Supabase `profiles` table.
3. Middleware ensures users must complete onboarding before `/dashboard`.
4. Role-based dashboards (Student, Alumni, Aspirant, Admin).

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

* Use **TypeScript** for type safety.
* Use **React Server Components** where possible.
* Use **shadcn/ui** for UI elements.
* Keep DB queries in `src/lib/supabase.ts`.
* Use `NEXT_PUBLIC_` prefix for client env vars.
* Protect admin routes with role-based middleware.

---

## 🚀 App Structure

```
src/app/
  (marketing)/page.tsx           # Landing page
  login/page.tsx                 # Clerk sign-in
  onboarding/page.tsx            # Multi-step role-based onboarding
  dashboard/page.tsx             # User dashboard (role-based)
  dashboard/posts/page.tsx       # Browse posts
  dashboard/chat/[id]/page.tsx   # Real-time chat
  admin/page.tsx                 # Admin dashboard
  admin/users/page.tsx           # User management
  admin/posts/page.tsx           # Post moderation
  admin/reports/page.tsx         # Reports & disputes
  api/clerk-webhook/route.ts     # Clerk → Supabase sync
  api/onboarding/route.ts        # Save onboarding data
  api/notifications/route.ts     # Notifications pipeline
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

## 📅 Milestones

1. Auth + Onboarding with Supabase sync.
2. Role-based dashboards (student/alumni/aspirant).
3. Real-time chat integration.
4. Alumni posts module.
5. Notifications pipeline.
6. Admin panel (user & post management).
7. Deployment on Vercel + Supabase.

---

## 🛠️ Future Enhancements

* AI-powered mentor–mentee matching.
* Video mentorship (WebRTC).
* Paid mentorship marketplace.
* University-specific branded portals.
* Advanced analytics for admins.

---

With this context, GitHub Copilot should:

* Suggest **Next.js + Tailwind + shadcn** components.
* Enforce **role-based UI and logic**.
* Generate **Supabase queries** for data.
* Provide helpers for **Admin Panel CRUD and moderation tools**.
