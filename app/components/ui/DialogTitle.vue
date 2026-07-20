<script setup lang="ts">
import { DialogTitle as DialogTitlePrimitive, type DialogTitleProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<DialogTitleProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <DialogTitlePrimitive v-bind="props" data-slot="dialog-title" :class="cn('font-heading text-base leading-none font-medium', props.class)">
    <slot />
  </DialogTitlePrimitive>
</template>
