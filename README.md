# Simply Wholeness

A clean, mobile-first Next.js application for a faith-rooted holistic coaching program. It supports client and coach roles, Supabase authentication, daily check-ins, habits, weekly reflections, goals, journaling, progress dashboards, and coach encouragement comments.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth, Postgres, and Row Level Security
- Responsive mobile-first UI

## Features

### Client

- Secure email/password login
- Daily check-in for Mind, Body, Spirit, and Integration
- Habit tracker with daily completion
- Morning routine checklist
- Weekly reflection form for wins, challenges, energy, stress, lessons learned, and next-week focus
- Goal tracking
- Progress dashboard
- Journal entries
- Coach encouragement feed

### Coach

- View all client profiles
- Review client check-ins
- View weekly habit completion percentages
- Read weekly reflections
- Leave encouragement comments

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

3. Add your Supabase values:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. In Supabase, open the SQL editor and run:

```text
supabase/schema.sql
```

5. Start the app:

```bash
npm run dev
```

6. Open:

```text
http://localhost:3000
```

## Supabase Auth Settings

In Supabase Authentication settings:

- Enable email/password auth.
- Add `http://localhost:3000/auth/callback` to local redirect URLs.
- Add your production Vercel callback URL after deployment, for example `https://your-app.vercel.app/auth/callback`.

New users can choose `Client` or `Coach` when creating an account. The database trigger creates the matching profile automatically from auth metadata.

## Deployment

### Vercel

1. Push the project to GitHub.
2. Import the repository in Vercel.
3. Add environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

4. Deploy.
5. Add the deployed callback URL in Supabase:

```text
https://your-app.vercel.app/auth/callback
```

## Notes For Production

- Replace broad coach visibility policies with coach-to-client assignment policies if each coach should only see assigned clients.
- Add password reset and invited-account flows for a polished program launch.
- Add server-side validation with a schema library if forms need stricter coaching program requirements.
