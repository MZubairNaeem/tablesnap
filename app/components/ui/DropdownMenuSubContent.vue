<script setup lang="ts">
import { DropdownMenuSubContent as DropdownMenuSubContentPrimitive, DropdownMenuPortal, type DropdownMenuSubContentProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<DropdownMenuSubContentProps & { class?: HTMLAttributes['class'] }>(),
  { alignOffset: -3, sideOffset: 0 },
)
</script>

<template>
  <DropdownMenuPortal>
    <DropdownMenuSubContentPrimitive
      v-bind="props"
      data-slot="dropdown-menu-sub-content"
      :class="
        cn(
          'w-auto min-w-[96px] rounded-lg bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          props.class,
        )
      "
    >
      <slot />
    </DropdownMenuSubContentPrimitive>
  </DropdownMenuPortal>
</template>
