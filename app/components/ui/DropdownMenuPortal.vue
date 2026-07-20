<script setup lang="ts">
import { DropdownMenuPortal as DropdownMenuPortalPrimitive, type DropdownMenuPortalProps } from 'reka-ui'

const props = defineProps<DropdownMenuPortalProps>()
</script>

<template>
  <DropdownMenuPortalPrimitive data-slot="dropdown-menu-portal" v-bind="props">
    <slot />
  </DropdownMenuPortalPrimitive>
</template>
