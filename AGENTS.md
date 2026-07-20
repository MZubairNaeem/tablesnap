<!-- BEGIN:nuxt-agent-rules -->
# Nuxt 4, not Next.js

This project was migrated from Next.js 16 to Nuxt 4 (see `SPEC.md` for the
full architecture). Conventions worth knowing before changing code:

- `app/` is Nuxt's srcDir — `app/pages/`, `app/components/`, `app/layouts/`,
  `app/composables/`, `app/stores/` (Pinia), `app/lib/` (framework-agnostic
  helpers, moved wholesale from the old root `lib/`). `server/api/` holds
  Nitro routes; `server/utils/` holds auto-imported server helpers.
- Components under `app/components/` (including `components/ui/`) are
  globally auto-imported with **flat names** — `<Button/>`, not `<UiButton/>`
  — see the `components:` config in `nuxt.config.ts`.
- UI primitives in `app/components/ui/` are shadcn-vue-style wrappers around
  **Reka UI** (not Radix, not the old Base UI). `ticket.tsx`'s Vue port
  (`Ticket.vue`/`TicketHeader.vue`/`TicketPerforation.vue`) has no upstream
  equivalent — it's hand-written and is the product's signature visual
  element; don't regress the torn-edge CSS masks in `app/assets/css/globals.css`.
  Icons are `@lucide/vue` (the maintained package — not the deprecated
  `lucide-vue-next`).
- Supabase auth/sessions go through `@nuxtjs/supabase` — `useSupabaseClient()`
  / `useSupabaseUser()` client-side, `serverSupabaseClient(event)` /
  `serverSupabaseUser(event)` (from `#supabase/server`) in `server/api/*`.
  There are no hand-rolled client factories anymore (no `lib/supabase/client.ts`
  or `server.ts`).
- `app/types/database.types.ts` types the Supabase client. Two non-obvious
  requirements if you edit it: every table needs `Relationships: []` (from
  postgrest-js's `GenericTable`), and the top-level `Database` export must be
  a `type`, not an `interface` — interfaces don't get an implicit string
  index signature, which silently collapses `.insert()`'s argument type to
  `never`.
- Dashboard mutations go through Nitro routes in `server/api/`, each starting
  with `requireBusiness(event)` from `server/utils/auth.ts` for authz. The
  public `/c/[slug]` flow (`answers`/`responses` inserts) stays client-side
  and anonymous against RLS — don't move those behind a Nitro route.
- State: four Pinia stores (`business`, `responses`, `questions`, `theme`) in
  `app/stores/`. Everything else (form fields, dialog open state, the video
  capture state machine) is local component/composable state — see
  `app/composables/useVideoCapture.ts` for the camera/recorder machinery
  behind `/c/[slug]`'s video answers.
- Package manager is pnpm; there is no `next`, `react`, or `@base-ui/react`
  dependency left in `package.json` — if you see one, something regressed.
<!-- END:nuxt-agent-rules -->
