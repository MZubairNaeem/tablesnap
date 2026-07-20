<script setup lang="ts">
import { ProgressRoot, ProgressIndicator } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class']; value?: number | null }>()
</script>

<template>
  <ProgressRoot data-slot="progress" :model-value="value" class="flex flex-wrap gap-3">
    <div data-slot="progress-track" :class="cn('relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted', props.class)">
      <ProgressIndicator
        data-slot="progress-indicator"
        class="h-full w-full flex-1 bg-primary transition-all"
        :style="`transform: translateX(-${100 - (value ?? 0)}%)`"
      />
    </div>
  </ProgressRoot>
</template>
