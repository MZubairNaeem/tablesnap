<script setup lang="ts">
import { AvatarImage as AvatarImagePrimitive, type AvatarImageProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<AvatarImageProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <AvatarImagePrimitive
    data-slot="avatar-image"
    :src="src"
    :class="cn('aspect-square size-full rounded-full object-cover', props.class)"
  />
</template>
