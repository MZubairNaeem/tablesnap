<script setup lang="ts">
import { DialogContent as DialogContentPrimitive, DialogClose as DialogClosePrimitive, type DialogContentProps } from 'reka-ui'
import { XIcon } from '@lucide/vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import Button from './Button.vue'
import DialogPortal from './DialogPortal.vue'
import DialogOverlay from './DialogOverlay.vue'

const props = withDefaults(
  defineProps<DialogContentProps & { class?: HTMLAttributes['class']; showCloseButton?: boolean }>(),
  { showCloseButton: true },
)
</script>

<template>
  <DialogPortal>
    <DialogOverlay />
    <DialogContentPrimitive
      v-bind="props"
      data-slot="dialog-content"
      :class="
        cn(
          'fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          props.class,
        )
      "
    >
      <slot />
      <DialogClosePrimitive v-if="showCloseButton" data-slot="dialog-close" as-child>
        <Button variant="ghost" class="absolute top-2 right-2" size="icon-sm">
          <XIcon />
          <span class="sr-only">Close</span>
        </Button>
      </DialogClosePrimitive>
    </DialogContentPrimitive>
  </DialogPortal>
</template>
