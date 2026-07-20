<script setup lang="ts">
import { SelectGroup as SelectGroupPrimitive, type SelectGroupProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<SelectGroupProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <SelectGroupPrimitive v-bind="props" data-slot="select-group" :class="cn('scroll-my-1 p-1', props.class)">
    <slot />
  </SelectGroupPrimitive>
</template>
