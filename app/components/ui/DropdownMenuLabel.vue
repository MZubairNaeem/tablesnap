<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class']; inset?: boolean }>()
</script>

<template>
  <div
    data-slot="dropdown-menu-label"
    :data-inset="inset"
    :class="cn('px-1.5 py-1 text-xs font-medium text-muted-foreground data-[inset]:pl-7', props.class)"
  >
    <slot />
  </div>
</template>
