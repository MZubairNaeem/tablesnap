<script setup lang="ts">
import { DropdownMenuItem as DropdownMenuItemPrimitive, type DropdownMenuItemProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<DropdownMenuItemProps & { class?: HTMLAttributes['class']; inset?: boolean; variant?: 'default' | 'destructive' }>(),
  { variant: 'default' },
)
</script>

<template>
  <DropdownMenuItemPrimitive
    v-bind="props"
    data-slot="dropdown-menu-item"
    :data-inset="inset"
    :data-variant="variant"
    :class="
      cn(
        'group/dropdown-menu-item relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[inset]:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive',
        props.class,
      )
    "
  >
    <slot />
  </DropdownMenuItemPrimitive>
</template>
