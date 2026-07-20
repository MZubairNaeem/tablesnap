<script setup lang="ts">
import { AlertDialogTitle as AlertDialogTitlePrimitive, type AlertDialogTitleProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<AlertDialogTitleProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <AlertDialogTitlePrimitive
    v-bind="props"
    data-slot="alert-dialog-title"
    :class="
      cn(
        'font-heading text-base font-medium sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2',
        props.class,
      )
    "
  >
    <slot />
  </AlertDialogTitlePrimitive>
</template>
