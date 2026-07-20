<script setup lang="ts">
import type { Component } from 'vue'

/**
 * An empty state is an invitation, not an apology. Rendered as a blank ticket
 * waiting to be filled — dashed perforation border, mono meta, real next action.
 */
withDefaults(
  defineProps<{
    icon: Component
    title: string
    description: string
    actionLabel?: string
    actionHref?: string
    /** Optional mono line printed at the top, like a blank ticket. */
    meta?: string
  }>(),
  { meta: 'No tickets on the rail' },
)
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-line bg-card/40 px-6 py-16 text-center">
    <p class="ticket-meta">{{ meta }}</p>
    <div class="mt-1 flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
      <component :is="icon" class="size-5" />
    </div>
    <h3 class="font-display text-lg font-semibold">{{ title }}</h3>
    <p class="max-w-sm text-sm text-muted-foreground text-balance">{{ description }}</p>
    <Button v-if="actionLabel && actionHref" as-child size="lg" class="mt-3">
      <NuxtLink :to="actionHref">{{ actionLabel }}</NuxtLink>
    </Button>
  </div>
</template>
