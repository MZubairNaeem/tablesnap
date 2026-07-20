<script setup lang="ts">
import { AlertDialogRoot, type AlertDialogEmits, type AlertDialogProps } from 'reka-ui'

const props = defineProps<AlertDialogProps>()
const emits = defineEmits<AlertDialogEmits>()
</script>

<template>
  <AlertDialogRoot data-slot="alert-dialog" v-bind="props" v-on="emits">
    <slot />
  </AlertDialogRoot>
</template>
