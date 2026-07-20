<script setup lang="ts">
import { DropdownMenuCheckboxItem as DropdownMenuCheckboxItemPrimitive, DropdownMenuItemIndicator, type DropdownMenuCheckboxItemEmits, type DropdownMenuCheckboxItemProps } from 'reka-ui'
import { CheckIcon } from '@lucide/vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<DropdownMenuCheckboxItemProps & { class?: HTMLAttributes['class']; inset?: boolean }>()
const emits = defineEmits<DropdownMenuCheckboxItemEmits>()
</script>

<template>
  <DropdownMenuCheckboxItemPrimitive
    v-bind="props"
    data-slot="dropdown-menu-checkbox-item"
    :data-inset="inset"
    :class="
      cn(
        'relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[inset]:pl-7 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
        props.class,
      )
    "
    v-on="emits"
  >
    <span class="pointer-events-none absolute right-2 flex items-center justify-center" data-slot="dropdown-menu-checkbox-item-indicator">
      <DropdownMenuItemIndicator>
        <CheckIcon />
      </DropdownMenuItemIndicator>
    </span>
    <slot />
  </DropdownMenuCheckboxItemPrimitive>
</template>
