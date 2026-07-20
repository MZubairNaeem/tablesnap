<script setup lang="ts">
import { SelectValue as SelectValuePrimitive, type SelectValueProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<SelectValueProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <SelectValuePrimitive v-bind="props" data-slot="select-value" :class="cn('flex flex-1 text-left', props.class)" />
</template>
