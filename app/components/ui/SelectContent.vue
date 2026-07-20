<script setup lang="ts">
import { SelectContent as SelectContentPrimitive, SelectPortal, SelectViewport, type SelectContentProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import SelectScrollUpButton from './SelectScrollUpButton.vue'
import SelectScrollDownButton from './SelectScrollDownButton.vue'

const props = withDefaults(
  defineProps<SelectContentProps & { class?: HTMLAttributes['class'] }>(),
  { side: 'bottom', sideOffset: 4, align: 'center', alignOffset: 0 },
)
</script>

<template>
  <SelectPortal>
    <SelectContentPrimitive
      v-bind="props"
      data-slot="select-content"
      :class="
        cn(
          'relative isolate z-50 max-h-(--reka-select-content-available-height) w-(--reka-select-trigger-width) min-w-36 origin-(--reka-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          props.class,
        )
      "
    >
      <SelectScrollUpButton />
      <SelectViewport>
        <slot />
      </SelectViewport>
      <SelectScrollDownButton />
    </SelectContentPrimitive>
  </SelectPortal>
</template>
