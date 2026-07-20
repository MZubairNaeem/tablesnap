<script setup lang="ts">
import { DropdownMenuRoot, type DropdownMenuRootEmits, type DropdownMenuRootProps } from 'reka-ui'

const props = defineProps<DropdownMenuRootProps>()
const emits = defineEmits<DropdownMenuRootEmits>()
</script>

<template>
  <DropdownMenuRoot data-slot="dropdown-menu" v-bind="props" v-on="emits">
    <slot />
  </DropdownMenuRoot>
</template>
