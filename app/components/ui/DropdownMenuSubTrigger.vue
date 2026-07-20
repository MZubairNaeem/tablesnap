<script setup lang="ts">
import { DropdownMenuSubTrigger as DropdownMenuSubTriggerPrimitive, type DropdownMenuSubTriggerProps } from 'reka-ui'
import { ChevronRightIcon } from '@lucide/vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<DropdownMenuSubTriggerProps & { class?: HTMLAttributes['class']; inset?: boolean }>()
</script>

<template>
  <DropdownMenuSubTriggerPrimitive
    v-bind="props"
    data-slot="dropdown-menu-sub-trigger"
    :data-inset="inset"
    :class="
      cn(
        'flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[inset]:pl-7 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
        props.class,
      )
    "
  >
    <slot />
    <ChevronRightIcon class="ml-auto" />
  </DropdownMenuSubTriggerPrimitive>
</template>
