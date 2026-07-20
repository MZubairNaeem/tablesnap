<script setup lang="ts">
import { TabsContent as TabsContentPrimitive, type TabsContentProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<TabsContentProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <TabsContentPrimitive v-bind="props" data-slot="tabs-content" :class="cn('flex-1 text-sm outline-none', props.class)">
    <slot />
  </TabsContentPrimitive>
</template>
