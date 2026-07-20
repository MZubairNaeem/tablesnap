<script setup lang="ts">
import { DropdownMenuSub as DropdownMenuSubPrimitive, type DropdownMenuSubEmits, type DropdownMenuSubProps } from 'reka-ui'

const props = defineProps<DropdownMenuSubProps>()
const emits = defineEmits<DropdownMenuSubEmits>()
</script>

<template>
  <DropdownMenuSubPrimitive data-slot="dropdown-menu-sub" v-bind="props" v-on="emits">
    <slot />
  </DropdownMenuSubPrimitive>
</template>
