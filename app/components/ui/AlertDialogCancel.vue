<script setup lang="ts">
import { AlertDialogCancel as AlertDialogCancelPrimitive, type AlertDialogCancelProps } from 'reka-ui'
import type { ButtonVariants } from './Button.vue'
import type { HTMLAttributes } from 'vue'
import Button from './Button.vue'

const props = withDefaults(
  defineProps<
    AlertDialogCancelProps & { class?: HTMLAttributes['class']; variant?: ButtonVariants['variant']; size?: ButtonVariants['size'] }
  >(),
  { variant: 'outline', size: 'default' },
)
</script>

<template>
  <AlertDialogCancelPrimitive data-slot="alert-dialog-cancel" as-child>
    <Button :variant="variant" :size="size" :class="props.class">
      <slot />
    </Button>
  </AlertDialogCancelPrimitive>
</template>
