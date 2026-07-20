<script setup lang="ts">
import { SelectSeparator as SelectSeparatorPrimitive, type SelectSeparatorProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<SelectSeparatorProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <SelectSeparatorPrimitive v-bind="props" data-slot="select-separator" :class="cn('pointer-events-none -mx-1 my-1 h-px bg-border', props.class)" />
</template>
