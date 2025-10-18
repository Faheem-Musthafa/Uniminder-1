# 🚀 UniMinder — Full Technical Project Context (v2.0.0)

**Last Updated:** October 15, 2025
**Project Status:** Active Development
**Maintainer:** UniMinder Dev Team

---

## 🧭 1. Vision

**UniMinder** is a mentorship and career guidance platform designed for Indian colleges. It connects **Students**, **Alumni**, and **Aspirants** in an authentic, verified environment for mentorship, networking, and exploration.
An **Admin Panel** governs authenticity, moderation, and analytics.

### 🎯 Goals

* Empower students through verified alumni mentorship.
* Enable alumni to give back (guidance, referrals, opportunities).
* Help aspirants explore colleges and careers.
* Maintain trust via strong identity verification and admin moderation.

---

## ⚙️ 2. Tech Stack

| Layer             | Technology                                            |
| ----------------- | ----------------------------------------------------- |
| **Frontend**      | Next.js 15 (App Router), React 19, TypeScript 5       |
| **UI**            | TailwindCSS 4, shadcn/ui, Framer Motion, Lucide Icons |
| **Backend / DB**  | Supabase (PostgreSQL, Edge Functions, Realtime)       |
| **Auth**          | Clerk (Email, Google, LinkedIn)                       |
| **Storage**       | Supabase Storage (documents, avatars)                 |
| **Messaging**     | Supabase Realtime Channels                            |
| **Notifications** | Resend (email), Twilio (SMS/WhatsApp)                 |
| **Deployment**    | Vercel + Supabase Cloud                               |
| **Monitoring**    | Vercel Analytics + Supabase Logs                      |
| **Testing**       | Jest, Playwright                                      |

---

## 🧩 3. Core Features Overview

| Role              | Core Features                                        | Verification Method      |
| ----------------- | ---------------------------------------------------- | ------------------------ |
| 👩‍🎓 **Student** | Alumni chat, mentorship requests, career discussions | College ID Upload        |
| 👨‍💼 **Alumni**  | Job posts, mentorship, event updates                 | LinkedIn / Degree Upload |
| 🌱 **Aspirant**   | College exploration, Q&A, connection requests        | OTP Verification         |
| 🛡️ **Admin**     | Moderation, analytics, verification management       | Auto-access              |

---

## 🔐 4. Verification & Authentication

### 🔑 Clerk Integration

* Clerk handles authentication (Google, Email, LinkedIn)
* Custom webhooks sync user data to Supabase `profiles`

### ✅ Verification System

Verification occurs during onboarding:

| Step | Student                        | Alumni                         | Aspirant              |
| ---- | ------------------------------ | ------------------------------ | --------------------- |
| 1    | Upload ID Card                 | Upload Degree / LinkedIn OAuth | Verify via OTP        |
| 2    | OCR Validation (Edge Function) | OAuth / Admin Check            | Firebase / Twilio OTP |
| 3    | Status: pending → verified     | pending → verified             | verified instantly    |

Database Fields (Supabase `profiles`):

```sql
ALTER TABLE profiles ADD COLUMN verification_status text DEFAULT 'pending';
ALTER TABLE profiles ADD COLUMN verification_method text;
ALTER TABLE profiles ADD COLUMN document_url text;
ALTER TABLE profiles ADD COLUMN verified_at timestamptz;
```

Verification Status Lifecycle:

* `pending` → user uploaded or requested verification
* `verified` → auto or admin approval
* `rejected` → invalid document or mismatch

---

## 🧠 5. Onboarding Flow

### URL: `/onboarding`

**Steps:**

1. Role Selection → `student | alumni | aspirant`
2. Basic Info → name, email, college, degree, branch
3. Verification → file upload or OTP (auto validation)
4. Role-Specific Info → student: course; alumni: company; aspirant: target college
5. Additional Info → bio, skills, interests, goals
6. Review & Submit → POST `/api/onboarding`

### API Routes

| Endpoint                 | Method | Description                        |
| ------------------------ | ------ | ---------------------------------- |
| `/api/onboarding`        | POST   | Final submission + mark onboarded  |
| `/api/onboarding/save`   | PATCH  | Autosave progress                  |
| `/api/verify/:role`      | POST   | Verification upload/OTP validation |
| `/api/onboarding/status` | GET    | Onboarding status check            |

---

## 🗄️ 6. Database Schema (Supabase)

**profiles**

```sql
id text PRIMARY KEY,
user_id text,
email text,
role text CHECK (role IN ('student','alumni','aspirant','admin')),
full_name text,
college text,
degree text,
branch text,
passing_year int,
company text,
designation text,
verification_status text,
verification_method text,
document_url text,
verified_at timestamptz,
skills text[],
interests text[],
looking_for text[],
bio text,
onboarded boolean DEFAULT false,
created_at timestamptz DEFAULT now()
```

**posts**, **messages**, **connections**, **notifications**, **admin_logs** — standard relational tables linked via `user_id`.

---

## 🧮 7. Admin Panel Overview

### Route: `/admin`

Modules:

* **Verification:** Review and approve documents
* **Users:** Role & activity overview
* **Reports:** Flagged content moderation
* **Analytics:** Active users, verified ratio, engagement trends

Permissions:

* RLS-based: `role = 'admin'` only

APIs:

| Endpoint                | Method | Description                        |
| ----------------------- | ------ | ---------------------------------- |
| `/api/admin/verify/:id` | PATCH  | Approve / Reject user verification |
| `/api/admin/stats`      | GET    | Dashboard metrics                  |
| `/api/admin/users`      | GET    | List users with filters            |

---

## 💬 8. Communication Layer

### 1. Real-time Chat

* Built with Supabase Realtime Channels
* Direct + Group chats
* End-to-end encryption planned

### 2. Mentorship Requests

* Students request sessions from verified alumni
* Approval triggers chat or Google Meet link

### 3. Notifications

* Email (Resend)
* In-app (Supabase channels)
* Optional SMS/WhatsApp (Twilio)

---

## 🧰 9. Architecture

**Frontend:**

```
src/
 ├── app/
 │   ├── onboarding/
 │   ├── dashboard/
 │   ├── admin/
 │   ├── api/
 │   └── layout.tsx
 ├── components/
 │   ├── onboarding/
 │   ├── ui/
 │   ├── forms/
 │   └── dashboard/
 ├── lib/
 │   ├── supabase.ts
 │   ├── clerk.ts
 │   └── validators.ts
 └── types/
```

**Backend (Supabase Edge Functions):**

```
functions/
 ├── verify-id-card.ts
 ├── verify-linkedin.ts
 ├── send-otp.ts
 └── approve-user.ts
```

---

## 🧪 10. Testing & QA

**Unit Tests (Jest):**

* Validation schemas
* API endpoints

**Integration Tests (Playwright):**

* Full onboarding flow
* Verification uploads & redirects

**Manual QA Checklist:**

* Onboarding redirects correctly
* Autosave works for incomplete users
* Admin approval updates profile instantly

---

## 📈 11. Metrics & Monitoring

| Metric                     | Target |
| -------------------------- | ------ |
| Verified profiles          | 100%   |
| Onboarding completion rate | >90%   |
| API response time          | <200ms |
| Page load time             | <2s    |
| Moderation turnaround      | <24h   |

---

## 🔮 12. Future Roadmap

| Phase | Focus                             | Status         |
| ----- | --------------------------------- | -------------- |
| 1     | Authentication + Profiles         | ✅ Done         |
| 2     | Onboarding + Verification         | 🚧 In progress |
| 3     | Posts & Mentorship Chat           | ⏳ Next         |
| 4     | Admin Panel + Analytics           | Planned        |
| 5     | AI Mentor & Recommendation Engine | Planned        |
| 6     | Paid Mentorship & Certificates    | Future         |

---

## 🧾 13. Summary

UniMinder is a secure, mentorship-focused ecosystem connecting students, alumni, and aspirants through verified identity onboarding.
Built on **Next.js + Supabase + Clerk**, it ensures a trusted network, moderated content, and scalable communication tools.

**Motto:** Empower students, connect generations, and build verified mentorship networks across India.
