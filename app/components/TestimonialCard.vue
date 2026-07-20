<script setup lang="ts">
import { Play, Quote } from '@lucide/vue'
import type { ResponseStatus } from '@/lib/supabase/types'

/**
 * A chit on the pass. Torn top edge (the ticket signature in its dense register),
 * mono question meta, a status stamp. The whole card is the click target.
 */
defineProps<{
  variant: 'video' | 'text'
  videoUrl?: string | null
  textAnswer?: string | null
  questionText: string
  customerName: string
  date: string
  status: ResponseStatus
}>()

defineEmits<{ click: [] }>()
</script>

<template>
  <button
    type="button"
    class="group rounded-md text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    @click="$emit('click')"
  >
    <Ticket edge="top" class="rounded-b-md">
      <div v-if="variant === 'video'" class="relative aspect-video bg-ink/90">
        <video :src="videoUrl ?? undefined" preload="metadata" class="h-full w-full object-cover opacity-90" />
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="flex size-11 items-center justify-center rounded-full bg-card/95 transition-transform group-hover:scale-105">
            <Play class="size-4 fill-ink text-ink" />
          </span>
        </div>
      </div>
      <div v-else class="relative flex aspect-video flex-col justify-center gap-2 bg-muted/40 p-4">
        <Quote class="size-4 text-muted-foreground/60" />
        <p class="line-clamp-3 text-sm leading-snug text-ink/90">{{ textAnswer }}</p>
      </div>

      <div class="flex flex-1 flex-col gap-1.5 px-4 pt-3 pb-4">
        <p class="ticket-meta line-clamp-1">{{ questionText }}</p>
        <div class="mt-0.5 flex items-center justify-between gap-2">
          <p class="truncate text-sm font-medium text-ink">{{ customerName || 'Anonymous' }}</p>
          <StatusBadge :status="status" />
        </div>
        <p class="ticket-meta text-muted-foreground/70">{{ date }}</p>
      </div>
    </Ticket>
  </button>
</template>
