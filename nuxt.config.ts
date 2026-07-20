import tailwindcss from '@tailwindcss/vite'

// Applied before paint so a saved light/dark choice never flashes the wrong
// theme. Absence of both classes falls back to the OS preference (handled in
// app/assets/css/globals.css), which is why "system" is simply the no-class
// state. Ported verbatim from the old app/layout.tsx THEME_INIT_SCRIPT.
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("vouch-theme");if(t==="light"||t==="dark"){document.documentElement.classList.add(t)}}catch(e){}})();`

export default defineNuxtConfig({
  compatibilityDate: '2026-07-01',
  future: { compatibilityVersion: 4 },
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/fonts',
    '@nuxt/eslint',
  ],

  css: ['~/assets/css/globals.css'],
  vite: { plugins: [tailwindcss()] },

  // Flat component names: <Button/>, not <UiButton/> — matches every
  // existing call site so the port stays mechanical. Recursive by default,
  // so this also picks up everything under components/ui/.
  components: [{ path: '~/components', pathPrefix: false }],

  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      include: ['/dashboard(/*)?'], // exactly proxy.ts's old matcher
      exclude: [], // /c/:slug stays anonymous by omission
      saveRedirectToCookie: false,
    },
    cookieOptions: {
      sameSite: 'lax',
      secure: true,
    },
    clientOptions: {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
      },
    },
  },

  fonts: {
    families: [
      { name: 'Geist', provider: 'google', weights: [400, 500, 600, 700] },
      { name: 'Geist Mono', provider: 'google', weights: [400, 500] },
      { name: 'Bricolage Grotesque', provider: 'google', weights: [500, 600, 700] },
    ],
    defaults: { subsets: ['latin'] },
  },

  runtimeConfig: {
    public: {
      siteUrl: '',
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en', class: 'h-full antialiased' },
      bodyAttrs: { class: 'min-h-full flex flex-col' },
      title: 'Vouch — Video testimonials for local businesses',
      meta: [
        { name: 'description', content: 'Collect and showcase video testimonials from your customers.' },
      ],
      script: [{ innerHTML: THEME_INIT_SCRIPT, tagPosition: 'head' }],
    },
  },

  // No explicit preset: Nitro auto-detects the deploy target (Vercel sets
  // the VERCEL env var at build time, which picks the `vercel` preset and
  // emits .vercel/output/* instead of a plain node-server .output/).
  routeRules: {
    // Public collection funnel — per-slug data, never statically cached.
    '/c/**': { ssr: true, cache: false },
  },
})
