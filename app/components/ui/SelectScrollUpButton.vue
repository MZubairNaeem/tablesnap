<script setup lang="ts">
import { SelectScrollUpButton as SelectScrollUpButtonPrimitive } from 'reka-ui'
import { ChevronUpIcon } from '@lucide/vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <SelectScrollUpButtonPrimitive
    data-slot="select-scroll-up-button"
    :class="cn('top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*=\'size-\'])]:size-4', props.class)"
  >
    <ChevronUpIcon />
  </SelectScrollUpButtonPrimitive>
</template>
