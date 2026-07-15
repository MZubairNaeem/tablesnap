# Vouch — Spec

Video testimonial collection for restaurants and local businesses. A business
owner sets up a few questions and a reward, prints a QR code, and customers
record a quick video (or answer in writing) in exchange for the reward.

## Stack

- Next.js 16 (App Router, TypeScript, Turbopack default)
- Tailwind v4 + shadcn/ui
- Supabase: Postgres, Auth, Storage
- Zod + React Hook Form
- `qrcode` for QR generation, `canvas-confetti` for the reward screen,
  `@dnd-kit` for drag-to-reorder questions

## Routes

| Route | Auth | Description |
| --- | --- | --- |
| `/` | public | Marketing/landing page |
| `/login`, `/signup` | public | Email/password auth. Signup collects a business name and auto-provisions a business + 9 seed questions (see below). |
| `/c/[slug]` | public | The public collection page. Welcome → contact info → one screen per active question → reward. Fully dynamic (`export const dynamic = "force-dynamic"`), no caching. |
| `/dashboard` | owner | Stat cards (Total Responses, Video Testimonials, Written Responses, Completion Rate) + recent responses. |
| `/dashboard/questions` | owner | CRUD + drag-to-reorder for questions. |
| `/dashboard/testimonials` | owner | Video answer gallery, filterable by status. |
| `/dashboard/written` | owner | Text answer gallery, filterable by status. |
| `/dashboard/customers` | owner | One row per response: contact info, answer counts, status. Search, sort, CSV export. |
| `/dashboard/qr` | owner | QR code for `/c/[slug]`, downloadable PNG, WhatsApp share, table-tent preview. |
| `/dashboard/settings` | owner | Business name, logo, brand color, reward text/code/terms. |

`/dashboard/*` is protected by `proxy.ts` (Next.js 16 renamed `middleware.ts` →
`proxy.ts`, exported function `proxy`, runtime is always `nodejs`), which
redirects unauthenticated visitors to `/login`. Everything else is
unauthenticated by design — `/c/[slug]` in particular must never require a
session.

## Data model

```
businesses  id, owner_id -> auth.users, name, slug (unique), logo_url,
            brand_color, reward_text, reward_code, reward_terms, created_at
questions   id, business_id -> businesses, text, type ('video'|'text'),
            is_active, sort_order, created_at
responses   id, business_id -> businesses, customer_name, customer_email,
            customer_phone, consent, status ('pending'|'approved'|'rejected'),
            created_at
answers     id, response_id -> responses (cascade), question_id -> questions,
            video_url, text_answer, skipped, created_at
```

Storage buckets: `testimonials` (customer-submitted video answers — public
read, anon insert, capped at 100 MiB, `video/webm`/`video/mp4` only) and
`logos` (business branding assets — public read, authenticated insert/update).

Full definitions, indexes, and RLS policies are in `supabase/schema.sql`. Run
it once against a fresh Supabase project (SQL Editor or `supabase db push`).

## RLS summary

- Owners have full CRUD on their own `businesses`/`questions`/`responses`/
  `answers`, scoped through `auth.uid() = businesses.owner_id` (directly, or
  via a join for the child tables).
- `businesses` and active `questions` are readable `to public` (not just
  `anon`) — a logged-in owner can still preview any business's public page.
- `responses`/`answers` have **no public SELECT policy at all**, only
  `anon` INSERT. This is load-bearing for how the public flow is implemented:
  since `INSERT ... RETURNING` needs a SELECT policy, and there isn't one,
  the client generates `response.id` and every `answer.id` itself with
  `crypto.randomUUID()` and always calls `.insert(...)` **without** a trailing
  `.select()` (supabase-js's default with no `.select()` is
  `Prefer: return=minimal`, which needs no SELECT policy). If you ever add a
  `.select()` after an insert on these tables, it will start failing for
  anonymous users.
- New signups get a business + the 9 seed questions atomically via a
  `security definer` trigger on `auth.users` (`handle_new_user` in
  `schema.sql`), reading the business name out of
  `raw_user_meta_data->>'business_name'`.

## Environment variables

See `.env.example`. Supabase projects created after Nov 2025 issue
publishable/secret keys instead of legacy anon/service_role JWTs — the app
uses that naming (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`),
but either key format works since the client code just treats them as opaque
strings.

## Demo notes

- Supabase projects require email confirmation by default. For a live demo,
  turn off "Confirm email" in the Supabase Auth dashboard settings, or signup
  won't establish a session until the confirmation link is clicked.
- The admin client (`lib/supabase/admin.ts`, secret-key, RLS-bypassing) isn't
  used anywhere yet — every owner mutation goes through the regular
  authenticated server client and relies on RLS for authorization. It's there
  for future backend-only tooling.
- `getUserMedia` (camera recording on `/c/[slug]`) requires a secure context.
  `localhost` counts as secure even over plain HTTP, so same-machine testing
  needs no setup. Testing on a real phone needs either `next dev
  --experimental-https` (cert is valid for the `localhost` hostname only —
  a phone hitting your LAN IP will see a hostname-mismatch warning to click
  through) or a tunnel like `ngrok http 3000` (real cert, no warnings).

## Next.js 16 conventions used throughout

- `params`/`searchParams` are async — always `const { slug } = await
  props.params`, typed with the generated `PageProps<'/route'>` (run `pnpm
  dlx next typegen` after adding new routes, or just `next dev`/`next build`).
- `cookies()` from `next/headers` is async — always `await cookies()`.
- Middleware lives in `proxy.ts` at the project root, exported function is
  `proxy`, runtime is always `nodejs` (no edge runtime option).
- Turbopack is the default bundler — no custom webpack config exists or
  should be added.
- No React Compiler, no Cache Components — caching stays boring: `/c/[slug]`
  and everything under `/dashboard` are fully dynamic.
