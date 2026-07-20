<script setup lang="ts">
import type { ResponseStatus } from '@/lib/supabase/types'
import type { BadgeVariants } from '@/components/ui/Badge.vue'

/**
 * The status stamp. Reuses the ink-stamp Badge variants. Copy follows the
 * publish/hide language of the dashboard, not the raw DB enum:
 *   pending -> "Pending", approved -> "Published", rejected -> "Hidden".
 */
const STATUS: Record<ResponseStatus, { label: string; variant: BadgeVariants['variant'] }> = {
  approved: { label: 'Published', variant: 'default' },
  pending: { label: 'Pending', variant: 'secondary' },
  rejected: { label: 'Hidden', variant: 'destructive' },
}

const props = defineProps<{ status: ResponseStatus }>()
const meta = computed(() => STATUS[props.status])
</script>

<template>
  <Badge :variant="meta.variant">{{ meta.label }}</Badge>
</template>
