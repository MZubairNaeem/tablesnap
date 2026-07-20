This is a [Nuxt 4](https://nuxt.com) project. It was migrated from a Next.js
16 App Router app — see `SPEC.md` for the full architecture and `AGENTS.md`
for conventions to follow when editing.

## Getting Started

Install dependencies and copy the environment file:

```bash
pnpm install
cp .env.example .env
# fill in NUXT_PUBLIC_SUPABASE_URL / NUXT_PUBLIC_SUPABASE_KEY / NUXT_PUBLIC_SITE_URL
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Other scripts:

```bash
pnpm build      # production build
pnpm preview    # preview the production build locally
pnpm typecheck  # vue-tsc across the project
pnpm lint       # eslint (via @nuxt/eslint)
```

## Learn More

- [Nuxt Documentation](https://nuxt.com/docs)
- [Nuxt Supabase module](https://supabase.nuxtjs.org)
- [Pinia](https://pinia.vuejs.org)
- [Reka UI](https://reka-ui.com) / [shadcn-vue](https://www.shadcn-vue.com)
