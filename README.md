This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Supabase Setup

The site relies on Supabase for authentication, member profiles, and the GitHub activity cache that powers the landing-page heatmap. Provision the following tables and policies (SQL assumes the `auth.users` table already exists):

```sql
-- Drop dependent objects in the right order so re-running stays idempotent
drop view if exists public.public_profiles;
drop table if exists public.github_activity;
drop table if exists public.profiles;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  role text not null default 'member' check (role in ('executive','mentor','member')),
  headline text,
  grad_year text,
  github_username text,
  github_url text,
  linkedin_url text not null,
  last_activity_sync timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.github_activity (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references public.profiles (id) on delete cascade,
  activity_date date not null,
  contribution_count int not null,
  created_at timestamptz default now(),
  unique (member_id, activity_date)
);

create view public.public_profiles as
select
  id,
  display_name,
  role,
  headline,
  grad_year,
  avatar_url,
  github_username,
  github_url,
  linkedin_url
from public.profiles;
```

Recommended RLS policies:

- `profiles`: owners can `insert`/`update` their row; everyone can `select` the subset of safe columns via the `public_profiles` view.
- `github_activity`: `select` for everyone and `insert`/`upsert` restricted to service-role (used by the sync API route).

## Environment Variables

Add the following variables to `.env.local` and your hosting provider.

| Variable                                       | Purpose                                                         |
| ---------------------------------------------- | --------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`                     | Supabase project URL (public)                                   |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Supabase anon key for client + SSR usage                        |
| `SUPABASE_SERVICE_ROLE_KEY`                    | **Server-only** key used by the GitHub sync route               |
| `GITHUB_TOKEN`                                 | Personal access token with `read:user` scope for GitHub GraphQL |
| `GITHUB_ACTIVITY_SYNC_SECRET`                  | Arbitrary string required to call `/api/git-activity/sync`      |

## GitHub Activity Sync

Run the sync endpoint on a schedule (GitHub Action, Supabase cron, etc.) to keep the heatmap fresh:

```bash
curl -X POST \
  -H "Authorization: Bearer $GITHUB_ACTIVITY_SYNC_SECRET" \
  https://your-domain.tld/api/git-activity/sync
```

The route fetches contributions for every profile that has a GitHub username, stores daily totals in `github_activity`, and updates the `last_activity_sync` timestamp on each profile. The public `/api/git-activity` endpoint—and the landing page—read directly from those cached rows to avoid hitting GitHub on every request.
