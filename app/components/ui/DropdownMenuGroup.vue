<script setup lang="ts">
import { DropdownMenuGroup as DropdownMenuGroupPrimitive, type DropdownMenuGroupProps } from 'reka-ui'

const props = defineProps<DropdownMenuGroupProps>()
</script>

<template>
  <DropdownMenuGroupPrimitive data-slot="dropdown-menu-group" v-bind="props">
    <slot />
  </DropdownMenuGroupPrimitive>
</template>
