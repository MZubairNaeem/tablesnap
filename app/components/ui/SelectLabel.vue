<script setup lang="ts">
import { SelectLabel as SelectLabelPrimitive, type SelectLabelProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<SelectLabelProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <SelectLabelPrimitive v-bind="props" data-slot="select-label" :class="cn('px-1.5 py-1 text-xs text-muted-foreground', props.class)">
    <slot />
  </SelectLabelPrimitive>
</template>
