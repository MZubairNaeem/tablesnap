<script setup lang="ts">
import { DialogPortal as DialogPortalPrimitive, type DialogPortalProps } from 'reka-ui'

const props = defineProps<DialogPortalProps>()
</script>

<template>
  <DialogPortalPrimitive data-slot="dialog-portal" v-bind="props">
    <slot />
  </DialogPortalPrimitive>
</template>
