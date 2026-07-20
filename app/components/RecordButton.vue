<script setup lang="ts">
import { Loader2, Check } from '@lucide/vue'
import { cn } from '@/lib/utils'

export type RecordState = 'idle' | 'arming' | 'recording' | 'processing' | 'done'

/**
 * The primary action of the entire product — the moment before the diner
 * hits record. One button carries every state, and the 60s countdown lives
 * inside it (a draining bar), so there is never a separate timer to track.
 */
const props = defineProps<{
  state: RecordState
  secondsLeft: number
  maxSeconds: number
}>()

const emit = defineEmits<{ start: []; stop: [] }>()

const base =
  'relative flex h-14 w-full items-center justify-center gap-2.5 overflow-hidden rounded-md text-base font-medium transition-all outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px disabled:pointer-events-none disabled:opacity-60'

const pct = computed(() => (props.secondsLeft / props.maxSeconds) * 100)
const paddedSeconds = computed(() => props.secondsLeft.toString().padStart(2, '0'))
</script>

<template>
  <button
    v-if="state === 'recording'"
    type="button"
    :class="cn(base, 'border-2 border-primary bg-transparent text-foreground')"
    :aria-label="`Stop recording, ${secondsLeft} seconds left`"
    @click="emit('stop')"
  >
    <!-- the countdown, draining left-to-right, is the button -->
    <span
      aria-hidden="true"
      class="absolute inset-y-0 left-0 bg-primary/12 transition-[width] duration-1000 ease-linear motion-reduce:transition-none"
      :style="{ width: `${pct}%` }"
    />
    <span class="relative z-10 flex items-center gap-2.5">
      <span class="h-3 w-3 rounded-[2px] bg-primary" />
      <span>Stop</span>
      <span class="font-mono tabular-nums tracking-wide text-muted-foreground">0:{{ paddedSeconds }}</span>
    </span>
  </button>

  <button
    v-else-if="state === 'arming' || state === 'processing'"
    type="button"
    disabled
    :class="cn(base, 'bg-primary text-primary-foreground')"
  >
    <Loader2 class="size-5 animate-spin motion-reduce:animate-none" />
    {{ state === 'arming' ? 'Starting camera' : 'Saving' }}
  </button>

  <button v-else-if="state === 'done'" type="button" disabled :class="cn(base, 'bg-primary text-primary-foreground')">
    <Check class="size-5" />
    Saved
  </button>

  <button
    v-else
    type="button"
    :class="cn(base, 'bg-primary text-primary-foreground hover:opacity-90')"
    @click="emit('start')"
  >
    <span class="size-3 rounded-full bg-current opacity-90" />
    Start recording
  </button>
</template>
