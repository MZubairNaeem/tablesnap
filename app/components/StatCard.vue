<script setup lang="ts">
/**
 * One cell of the stat strip — a quiet mono label over a large tabular number.
 * No tinted-icon chrome; the dashboard is a tool, not a toy.
 */
defineProps<{ label: string; value: string }>()
</script>

<template>
  <div class="flex flex-col gap-1.5 px-5 py-4">
    <p class="ticket-meta">{{ label }}</p>
    <p class="font-display text-3xl font-semibold tabular-nums tracking-tight text-ink">{{ value }}</p>
  </div>
</template>
