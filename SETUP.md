# UniMinder Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ installed
- npm or yarn package manager
- Clerk account (for authentication)
- Supabase account (for database)

---

## 📦 Installation

1. **Clone and Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   ```bash
   cp .env.example .env.local
   ```

3. **Configure Your `.env.local`** file with actual values:

---

## 🔐 Clerk Setup (Authentication)

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Copy your API keys:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

4. **Configure Webhook** (for syncing user data):
   - Go to Webhooks in Clerk dashboard
   - Add endpoint: `https://your-domain.com/api/clerk-webhook`
   - Subscribe to: `user.created`, `user.updated`
   - Copy webhook secret to `CLERK_WEBHOOK_SECRET`

---

## 🗄️ Supabase Setup (Database)

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Create a new project
3. Get your API credentials from Settings → API:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ```

4. **Run Database Migrations** (in SQL Editor):

   Run these files in order:
   
   **First:** `db/update_profiles.sql`
   ```sql
   -- Creates the main profiles table with all fields
   ```

   **Second:** `db/2025-09-28_add_onboarding_fields.sql`
   ```sql
   -- Adds additional fields for interests, preferences
   ```

5. **Verify Table Structure:**
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'profiles';
   ```

   Expected columns:
   - id (text, primary key)
   - user_id (text, unique)
   - email, role, full_name
   - location, college, degree, branch, passing_year
   - company, designation, entrance_exam, target_college
   - linkedin, skills, bio
   - years_of_experience (integer)
   - interests, looking_for (text[])
   - preferences, social (jsonb)
   - onboarded (boolean)
   - created_at, updated_at (timestamptz)

---

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

---

## 🎯 User Flow

1. **Landing Page** → `/`
   - Hero section with CTA buttons
   - Features, FAQs, Footer

2. **Sign Up** → `/sign-up`
   - Clerk authentication
   - User creates account

3. **Onboarding** → `/onboarding`
   - Multi-step form (auto-redirected here)
   - Collects role and profile information
   - Auto-saves progress
   - Sets `onboarded = true` on completion

4. **Dashboard** → `/dashboard`
   - Redirects to role-specific dashboard:
     - `/dashboard/student` - for students
     - `/dashboard/alumni` - for alumni  
     - `/dashboard/aspirant` - for aspirants

---

## 🔒 Middleware Protection

The middleware (`src/middleware.ts`) automatically:
- Protects `/dashboard/*` and `/onboarding` routes
- Checks authentication via Clerk
- Redirects unboarded users to `/onboarding`
- Redirects onboarded users away from `/onboarding`

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (marketing)/          # Landing page
│   ├── api/                  # API routes
│   │   ├── onboarding/       # Onboarding endpoints
│   │   ├── clerk-webhook/    # Clerk sync
│   │   └── ...
│   ├── dashboard/            # Role-based dashboards
│   ├── onboarding/           # Multi-step form
│   └── sign-in|sign-up/      # Auth pages
├── components/
│   ├── onboarding/
│   │   └── multi-step-form.tsx  # ✨ Main onboarding wizard
│   ├── dashboard/            # Dashboard components
│   ├── ui/                   # Reusable UI components
│   └── ...
├── lib/
│   ├── supabase.ts          # Supabase client (server)
│   ├── supabase-edge.ts     # Edge runtime client
│   └── utils.ts
└── types/
    └── index.ts              # TypeScript types
```

---

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Database Connection Issues
- Verify Supabase URL and keys
- Check if database is active
- Verify table exists and has correct schema

### Authentication Issues
- Verify Clerk keys are correct
- Check webhook is configured
- Ensure domains are whitelisted in Clerk

### Middleware Redirects
- Check `profiles.onboarded` status in database
- Verify middleware is running (check terminal logs)
- Clear cookies and try again

---

## 🚢 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Environment Variables in Production
Make sure to add all variables from `.env.local` to your hosting platform:
- Clerk keys
- Supabase credentials
- Webhook secrets

---

## 📚 API Documentation

### Onboarding Endpoints

**Check Status**
```typescript
GET /api/onboarding/status
Response: { exists: boolean, onboarded: boolean, role: string }
```

**Save Progress** (partial update)
```typescript
PATCH /api/onboarding/save
Body: Partial<OnboardingFormData>
Response: { success: boolean, data: Profile }
```

**Complete Onboarding** (final submit)
```typescript
POST /api/onboarding
Body: OnboardingFormData
Response: { success: boolean, message: string, data: Profile }
```

---

## 🎨 Customization

### Theme
Edit `src/app/globals.css` for custom colors and styles

### Components
All UI components use shadcn/ui and can be customized in `src/components/ui/`

### Dashboard
Each role has its own dashboard in `src/components/dashboard/`:
- `student.tsx`
- `alumni.tsx`
- `aspirant.tsx`

---

## 📝 Next Steps

- [ ] Set up email notifications
- [ ] Add profile editing
- [ ] Implement mentorship matching
- [ ] Add messaging system
- [ ] Create admin dashboard
- [ ] Add analytics

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

This project is private and proprietary.

---

## 💡 Support

For issues or questions:
- Check existing GitHub issues
- Create a new issue with details
- Contact the development team

---

**Built with ❤️ using Next.js 15, React 19, Clerk, and Supabase**
