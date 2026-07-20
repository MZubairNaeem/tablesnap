<script setup lang="ts">
import { DropdownMenuRadioGroup as DropdownMenuRadioGroupPrimitive, type DropdownMenuRadioGroupEmits, type DropdownMenuRadioGroupProps } from 'reka-ui'

const props = defineProps<DropdownMenuRadioGroupProps>()
const emits = defineEmits<DropdownMenuRadioGroupEmits>()
</script>

<template>
  <DropdownMenuRadioGroupPrimitive data-slot="dropdown-menu-radio-group" v-bind="props" v-on="emits">
    <slot />
  </DropdownMenuRadioGroupPrimitive>
</template>
