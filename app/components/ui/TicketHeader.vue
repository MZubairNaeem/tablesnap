<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

/** Mono print header — business name left, meta (progress / stamp) right. */
defineProps<{ class?: HTMLAttributes['class']; business: string }>()
</script>

<template>
  <div data-slot="ticket-header" :class="cn('flex items-center justify-between gap-3 px-5 pt-4 pb-3', $props.class)">
    <span class="ticket-meta truncate text-ink">{{ business }}</span>
    <span v-if="$slots.meta" class="ticket-meta shrink-0"><slot name="meta" /></span>
  </div>
</template>
