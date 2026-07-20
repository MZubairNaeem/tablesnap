<script setup lang="ts">
import { AvatarFallback as AvatarFallbackPrimitive, type AvatarFallbackProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<AvatarFallbackProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <AvatarFallbackPrimitive
    data-slot="avatar-fallback"
    :class="
      cn(
        'flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs',
        props.class,
      )
    "
  >
    <slot />
  </AvatarFallbackPrimitive>
</template>
