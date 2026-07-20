<script setup lang="ts">
import { DialogDescription as DialogDescriptionPrimitive, type DialogDescriptionProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<DialogDescriptionProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <DialogDescriptionPrimitive
    v-bind="props"
    data-slot="dialog-description"
    :class="cn('text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground', props.class)"
  >
    <slot />
  </DialogDescriptionPrimitive>
</template>
