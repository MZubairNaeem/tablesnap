<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Monitor, Moon, Sun } from '@lucide/vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { useThemeStore } from '@/stores/theme'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()

const theme = useThemeStore()
onMounted(() => theme.hydrate())

const ICONS = { monitor: Monitor, sun: Sun, moon: Moon } as const
const icon = computed(() => ICONS[theme.meta.icon])
</script>

<template>
  <button
    type="button"
    :aria-label="`Theme: ${theme.meta.label}. Tap to change.`"
    :title="theme.meta.label"
    :class="
      cn(
        'flex size-8 shrink-0 items-center justify-center rounded-sm border border-line bg-transparent text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50',
        props.class,
      )
    "
    @click="theme.cycle()"
  >
    <component :is="icon" class="size-4" />
  </button>
</template>
