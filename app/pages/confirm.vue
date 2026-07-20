<script setup lang="ts">
// NET-NEW — the old Next app had no /auth/callback route at all. Email
// confirmation worked only via Supabase's own hosted redirect; the app never
// exchanged the PKCE code itself. @nuxtjs/supabase requires a real callback
// page (redirectOptions.callback), so this closes that gap: the client is
// configured with detectSessionInUrl: true, which exchanges the code on
// mount, and we just wait for the resulting session.
const user = useSupabaseUser()
const route = useRoute()
const error = ref<string | null>(null)

onMounted(async () => {
  if (route.query.error_description) {
    error.value = String(route.query.error_description)
    return
  }

  await until(user)
    .not.toBeNull({ timeout: 5000 })
    .catch(() => {})

  if (user.value) {
    await navigateTo('/dashboard')
  } else {
    error.value = 'Could not confirm your email. The link may have expired — try logging in.'
  }
})
</script>

<template>
  <div class="relative mx-auto flex min-h-svh w-full max-w-sm flex-col items-center justify-center gap-4 px-6 py-10 text-center">
    <ThemeToggle class="absolute top-6 right-6" />
    <template v-if="error">
      <h1 class="text-2xl font-semibold tracking-tight">Confirmation failed</h1>
      <p class="text-sm text-muted-foreground">{{ error }}</p>
      <NuxtLink to="/login" class="font-medium text-foreground underline underline-offset-4">Go to login</NuxtLink>
    </template>
    <template v-else>
      <h1 class="text-2xl font-semibold tracking-tight">Confirming your account...</h1>
      <p class="text-sm text-muted-foreground">One moment.</p>
    </template>
  </div>
</template>
