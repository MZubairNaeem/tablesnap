<script setup lang="ts">
import { AlertDialogDescription as AlertDialogDescriptionPrimitive, type AlertDialogDescriptionProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<AlertDialogDescriptionProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <AlertDialogDescriptionPrimitive
    v-bind="props"
    data-slot="alert-dialog-description"
    :class="cn('text-sm text-balance text-muted-foreground md:text-pretty *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground', props.class)"
  >
    <slot />
  </AlertDialogDescriptionPrimitive>
</template>
