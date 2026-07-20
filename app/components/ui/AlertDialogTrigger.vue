<script setup lang="ts">
import { AlertDialogTrigger as AlertDialogTriggerPrimitive, type AlertDialogTriggerProps } from 'reka-ui'

const props = defineProps<AlertDialogTriggerProps>()
</script>

<template>
  <AlertDialogTriggerPrimitive data-slot="alert-dialog-trigger" v-bind="props">
    <slot />
  </AlertDialogTriggerPrimitive>
</template>
