<script setup lang="ts">
import { AlertDialogPortal as AlertDialogPortalPrimitive, type AlertDialogPortalProps } from 'reka-ui'

const props = defineProps<AlertDialogPortalProps>()
</script>

<template>
  <AlertDialogPortalPrimitive data-slot="alert-dialog-portal" v-bind="props">
    <slot />
  </AlertDialogPortalPrimitive>
</template>
