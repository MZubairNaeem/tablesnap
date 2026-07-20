<script setup lang="ts">
import { DialogTrigger as DialogTriggerPrimitive, type DialogTriggerProps } from 'reka-ui'

const props = defineProps<DialogTriggerProps>()
</script>

<template>
  <DialogTriggerPrimitive data-slot="dialog-trigger" v-bind="props">
    <slot />
  </DialogTriggerPrimitive>
</template>
