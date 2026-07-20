<script setup lang="ts">
import { SelectItem as SelectItemPrimitive, SelectItemText, SelectItemIndicator, type SelectItemProps } from 'reka-ui'
import { CheckIcon } from '@lucide/vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<SelectItemProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <SelectItemPrimitive
    v-bind="props"
    data-slot="select-item"
    :class="
      cn(
        'relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2',
        props.class,
      )
    "
  >
    <SelectItemText class="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
      <slot />
    </SelectItemText>
    <SelectItemIndicator as-child>
      <span class="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        <CheckIcon class="pointer-events-none" />
      </span>
    </SelectItemIndicator>
  </SelectItemPrimitive>
</template>
