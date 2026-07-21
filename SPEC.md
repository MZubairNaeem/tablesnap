# TableSnap — Spec

Video testimonial collection for restaurants and local businesses. A business
owner sets up a few questions and a reward, prints a QR code, and customers
record a quick video (or answer in writing) in exchange for the reward.

## Stack

- Nuxt 4 (Vue 3, TypeScript), migrated from Next.js 16 App Router
- Pinia for state, `@nuxtjs/supabase` for auth/session, Nitro (`server/api/`)
  for owner mutations
- Tailwind v4 + shadcn-vue (built on Reka UI, not Radix)
- Supabase: Postgres, Auth, Storage — schema/RLS unchanged by the migration
- Zod + vee-validate
- `qrcode` for QR generation, `canvas-confetti` for the reward screen,
  `vuedraggable` for drag-to-reorder questions

## Routes

| Route | Auth | Description |
| --- | --- | --- |
| `/` | public | Marketing/landing page |
| `/login`, `/signup` | public | Email/password auth. Signup collects a business name and auto-provisions a business + 9 seed questions (see below). |
| `/confirm` | public | Email-confirmation / PKCE callback (`@nuxtjs/supabase`'s `redirectOptions.callback`). |
| `/c/[slug]` | public | The public collection page. Welcome → contact info → one screen per active question → reward. Fully dynamic, never cached (`routeRules['/c/**']`). |
| `/dashboard` | owner | Stat cards (Total Responses, Video Testimonials, Written Responses, Completion Rate) + recent responses. |
| `/dashboard/questions` | owner | CRUD + drag-to-reorder for questions. |
| `/dashboard/testimonials` | owner | Video answer gallery, filterable by status. |
| `/dashboard/written` | owner | Text answer gallery, filterable by status. |
| `/dashboard/customers` | owner | One row per response: contact info, answer counts, status. Search, sort, CSV export. |
| `/dashboard/qr` | owner | QR code for `/c/[slug]`, downloadable PNG, WhatsApp share, table-tent preview. |
| `/dashboard/settings` | owner | Business name, logo, brand color, reward text/code/terms. |

`/dashboard/*` is protected by `@nuxtjs/supabase`'s `redirectOptions.include`
(`nuxt.config.ts`), which redirects unauthenticated visitors to `/login` —
this replaces the old Next `proxy.ts` middleware. `app/layouts/dashboard.vue`
adds a belt-and-braces check for the edge case of an authenticated user with
no business row. Everything else is unauthenticated by design — `/c/[slug]`
in particular must never require a session (verify this explicitly after
touching auth config: it's the easiest thing to regress).

## Architecture

- **Pages** (`app/pages/`) fetch their own data via `useAsyncData` +
  `useSupabaseClient()` and write into Pinia stores; components read from the
  stores rather than taking `initialX` props. See `app/stores/`:
  `business.ts`, `responses.ts` (also the mutation path for publish/hide —
  every dashboard view reads the same array, so a status change is visible
  everywhere immediately, no manual cache invalidation), `questions.ts`,
  `theme.ts`.
- **Owner mutations** go through Nitro routes in `server/api/` (`responses/`,
  `questions/`, `business/`), each starting with `requireBusiness(event)`
  (`server/utils/auth.ts`) for authorization on top of RLS.
- **Public writes** (`/c/[slug]` contact form + answers, including video
  upload) stay client-side and anonymous, going straight through
  `useSupabaseClient()` against the `public_insert_*` RLS policies below —
  these intentionally do **not** go through `server/api/`.
- **Video capture** (`app/composables/useVideoCapture.ts`) owns the
  MediaRecorder/camera state machine; `app/components/collection/AnswerQuestion.vue`
  owns mode switching (record/upload/write) and the three `answers` insert
  call sites. Every native browser object (`MediaStream`, `MediaRecorder`,
  `Blob`) is held in a `shallowRef`, never a plain `ref`.

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

Full definitions, indexes, and RLS policies are in `supabase/schema.sql`
(unchanged by the Nuxt migration). Run it once against a fresh Supabase
project (SQL Editor or `supabase db push`). `app/types/database.types.ts` is
a hand-written TypeScript mirror of this schema for `useSupabaseClient<Database>()`
— it is not generated, so keep it in sync manually if the schema changes.

## RLS summary

- Owners have full CRUD on their own `businesses`/`questions`/`responses`/
  `answers`, scoped through `auth.uid() = businesses.owner_id` (directly, or
  via a join for the child tables). Nitro routes additionally scope every
  query with `.eq('business_id', businessId)` on top of RLS.
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
uses that naming (`NUXT_PUBLIC_SUPABASE_KEY`), but either key format works
since the client code just treats it as an opaque string. There is currently
no server-only Supabase secret key in use (the old `admin.ts` service-role
client was dead code in the Next app and wasn't ported).

## Demo notes

- Supabase projects require email confirmation by default. For a live demo,
  turn off "Confirm email" in the Supabase Auth dashboard settings, or signup
  won't establish a session until the confirmation link is clicked (it will
  land on `/confirm`, which exchanges the code and redirects to `/dashboard`).
- `getUserMedia` (camera recording on `/c/[slug]`) requires a secure context.
  `localhost` counts as secure even over plain HTTP, so same-machine testing
  needs no setup. Testing on a real phone needs either a dev server with a
  trusted local cert or a tunnel like `ngrok http 3000` (real cert, no
  warnings).
- The video MIME ladder (`video/mp4;codecs=avc1` → `video/webm;codecs=vp9` →
  `video/webm`, in `useVideoCapture.ts`) and `playsinline`/`muted` handling
  matter most on iOS Safari — test the record flow on a real device, not
  just desktop Chrome, before shipping changes to that composable.
