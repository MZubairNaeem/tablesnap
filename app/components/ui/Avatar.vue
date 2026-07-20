<script setup lang="ts">
import { AvatarRoot, type AvatarRootProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<AvatarRootProps & { class?: HTMLAttributes['class']; size?: 'default' | 'sm' | 'lg' }>(),
  { size: 'default' },
)
</script>

<template>
  <AvatarRoot
    data-slot="avatar"
    :data-size="size"
    :class="
      cn(
        'group/avatar relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten',
        props.class,
      )
    "
  >
    <slot />
  </AvatarRoot>
</template>
