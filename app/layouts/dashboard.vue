<script setup lang="ts">
// export const dynamic = "force-dynamic" has no Nuxt equivalent needed --
// SSR is the default. redirect("/login") is now a belt-and-braces check:
// @nuxtjs/supabase's redirectOptions.include already guards /dashboard/**,
// this only covers the edge case of an authenticated user with no business
// row.
const businessStore = useBusinessStore()

if (!businessStore.loaded) {
  await businessStore.fetch()
}

if (!businessStore.business) {
  await navigateTo('/login')
}
</script>

<template>
  <div v-if="businessStore.business" class="flex h-svh">
    <DashboardSidebar :business="businessStore.business" />
    <main class="min-h-0 min-w-0 flex-1 overflow-y-auto">
      <slot />
    </main>
  </div>
</template>
