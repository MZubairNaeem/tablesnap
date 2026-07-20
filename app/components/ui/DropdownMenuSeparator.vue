<script setup lang="ts">
import { DropdownMenuSeparator as DropdownMenuSeparatorPrimitive, type DropdownMenuSeparatorProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<DropdownMenuSeparatorProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <DropdownMenuSeparatorPrimitive v-bind="props" data-slot="dropdown-menu-separator" :class="cn('-mx-1 my-1 h-px bg-border', props.class)" />
</template>
