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
    </template>
    <NuxtLink to="/" class="mt-2 text-sm font-medium underline underline-offset-4" @click.prevent="clearError({ redirect: '/' })">
      Go to Vouch
    </NuxtLink>
  </div>
</template>
