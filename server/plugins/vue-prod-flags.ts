// Vue's build-time feature flags (__VUE_PROD_DEVTOOLS__ etc.) are meant to be
// dead-code-eliminated by a bundler define, but Pinia ships as an external
// dependency on Vercel (copied raw into node_modules rather than bundled by
// Nitro), so it still references the bare, undefined identifier at runtime —
// throwing "__VUE_PROD_DEVTOOLS__ is not defined" on every SSR request that
// touches a store. Setting it on globalThis before any request is handled
// makes the bare reference resolve instead of throwing, regardless of how
// any given dependency was bundled.
// Built as runtime strings (not literal identifiers) so Nuxt/Nitro's own
// build-time text substitution for these exact flag names — which runs
// regardless of user config and corrupts any literal occurrence, including
// as an object key — can't rewrite this into `{ false: false }`.
const flag = (...parts: string[]) => parts.join('')

export default defineNitroPlugin(() => {
  Object.assign(globalThis, {
    [flag('__VUE_PROD', '_DEVTOOLS__')]: false,
    [flag('__VUE_PROD_HYDRATION', '_MISMATCH_DETAILS__')]: false,
    [flag('__VUE_OPTIONS', '_API__')]: true,
  })
})
