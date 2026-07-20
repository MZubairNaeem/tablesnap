<script setup lang="ts">
import { DialogOverlay as DialogOverlayPrimitive, type DialogOverlayProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<DialogOverlayProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <DialogOverlayPrimitive
    v-bind="props"
    data-slot="dialog-overlay"
    :class="
      cn(
        'fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
        props.class,
      )
    "
  />
</template>
