<script setup lang="ts">
import { DropdownMenuTrigger as DropdownMenuTriggerPrimitive, type DropdownMenuTriggerProps } from 'reka-ui'

const props = defineProps<DropdownMenuTriggerProps>()
</script>

<template>
  <DropdownMenuTriggerPrimitive data-slot="dropdown-menu-trigger" v-bind="props">
    <slot />
  </DropdownMenuTriggerPrimitive>
</template>
