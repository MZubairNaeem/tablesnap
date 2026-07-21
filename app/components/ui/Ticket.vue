<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

/**
 * The Ticket — TableSnap's signature element.
 *
 * A warm receipt/order-chit rendered with a torn perforated edge (a CSS mask,
 * so it is color-independent and survives any per-tenant brand color). It is
 * the shared DNA of both surfaces: one generous ticket on the collection
 * page, dense chits on the dashboard rail.
 */
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    edge?: 'bottom' | 'top' | 'both' | 'none'
    lift?: boolean
  }>(),
  { edge: 'bottom', lift: true },
)

defineOptions({ inheritAttrs: false })

const edgeClass = computed(() => {
  switch (props.edge) {
    case 'bottom':
      return 'edge-torn-bottom'
    case 'top':
      return 'edge-torn-top'
    case 'both':
      return 'edge-torn-y'
    default:
      return ''
  }
})
</script>

<template>
  <div :class="cn(lift && edge !== 'none' && 'ticket-shadow')">
    <div data-slot="ticket" v-bind="$attrs" :class="cn('flex flex-col bg-card text-card-foreground', edgeClass, props.class)">
      <slot />
    </div>
  </div>
</template>
