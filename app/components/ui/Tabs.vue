<script setup lang="ts">
import { TabsRoot, type TabsRootEmits, type TabsRootProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<TabsRootProps & { class?: HTMLAttributes['class'] }>(),
  { orientation: 'horizontal' },
)
const emits = defineEmits<TabsRootEmits>()
const modelValue = defineModel<string>()
</script>

<template>
  <TabsRoot
    v-bind="props"
    v-model="modelValue"
    data-slot="tabs"
    :class="cn('group/tabs flex gap-2 data-[orientation=horizontal]:flex-col', props.class)"
    v-on="emits"
  >
    <slot />
  </TabsRoot>
</template>
