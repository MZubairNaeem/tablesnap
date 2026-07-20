<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const is404 = computed(() => props.error.statusCode === 404)
</script>

<template>
  <div class="flex min-h-svh flex-col items-center justify-center gap-3 px-6 text-center">
    <template v-if="is404">
      <h1 class="text-2xl font-semibold tracking-tight">This link doesn't look right</h1>
      <p class="max-w-sm text-muted-foreground">
        We couldn't find a business at this address. Double-check the QR code or link and try
        again.
      </p>
    </template>
    <template v-else>
      <h1 class="text-2xl font-semibold tracking-tight">Something went wrong</h1>
      <p class="max-w-sm text-muted-foreground">{{ error.statusMessage || 'Please try again.' }}</p>
      <p v-if="error.message" class="max-w-sm wrap-break-word text-xs text-muted-foreground/80">
        {{ error.message }}
      </p>
      <details v-if="error.stack" class="mt-2 max-w-sm text-left">
        <summary class="cursor-pointer text-xs text-muted-foreground">Details</summary>
        <pre class="mt-2 max-h-64 overflow-auto whitespace-pre-wrap wrap-break-word text-left text-xs text-muted-foreground/80">{{ error.stack }}</pre>
      </details>
    </template>
    <NuxtLink to="/" class="mt-2 text-sm font-medium underline underline-offset-4" @click.prevent="clearError({ redirect: '/' })">
      Go to Vouch
    </NuxtLink>
  </div>
</template>
