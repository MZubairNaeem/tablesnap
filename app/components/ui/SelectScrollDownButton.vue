<script setup lang="ts">
import { SelectScrollDownButton as SelectScrollDownButtonPrimitive } from 'reka-ui'
import { ChevronDownIcon } from '@lucide/vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <SelectScrollDownButtonPrimitive
    data-slot="select-scroll-down-button"
    :class="cn('bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*=\'size-\'])]:size-4', props.class)"
  >
    <ChevronDownIcon />
  </SelectScrollDownButtonPrimitive>
</template>
