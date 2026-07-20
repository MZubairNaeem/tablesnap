<script setup lang="ts">
import { AlertDialogContent as AlertDialogContentPrimitive, type AlertDialogContentProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import AlertDialogPortal from './AlertDialogPortal.vue'
import AlertDialogOverlay from './AlertDialogOverlay.vue'

const props = withDefaults(
  defineProps<AlertDialogContentProps & { class?: HTMLAttributes['class']; size?: 'default' | 'sm' }>(),
  { size: 'default' },
)
</script>

<template>
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogContentPrimitive
      v-bind="props"
      data-slot="alert-dialog-content"
      :data-size="size"
      :class="
        cn(
          'group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          props.class,
        )
      "
    >
      <slot />
    </AlertDialogContentPrimitive>
  </AlertDialogPortal>
</template>
