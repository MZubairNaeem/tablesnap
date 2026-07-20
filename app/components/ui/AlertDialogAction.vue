<script setup lang="ts">
import { AlertDialogAction as AlertDialogActionPrimitive, type AlertDialogActionProps } from 'reka-ui'
import type { ButtonVariants } from './Button.vue'
import type { HTMLAttributes } from 'vue'
import Button from './Button.vue'

const props = defineProps<
  AlertDialogActionProps & { class?: HTMLAttributes['class']; variant?: ButtonVariants['variant']; size?: ButtonVariants['size'] }
>()
</script>

<template>
  <AlertDialogActionPrimitive data-slot="alert-dialog-action" as-child>
    <Button :variant="variant" :size="size" :class="props.class">
      <slot />
    </Button>
  </AlertDialogActionPrimitive>
</template>
