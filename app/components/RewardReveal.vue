<script setup lang="ts">
import confetti from 'canvas-confetti'
import { Check, Copy, Scissors } from '@lucide/vue'

/**
 * The payoff. This is the ONLY component in the product that uses --reward
 * (marigold), so its appearance means something. Styled explicitly as a
 * voucher — a labeled stub with a barcode strip — that tears off along a
 * perforation to reveal the code. Motion and confetti respect
 * prefers-reduced-motion.
 */
const props = defineProps<{
  businessName: string
  rewardText: string | null
  rewardCode: string | null
  rewardTerms: string | null
  /** Shown only if the diner left contact info — an honest capability, not a promise it's already sent. */
  hasContactInfo: boolean
}>()

const copied = ref(false)

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return
  confetti({ particleCount: 70, spread: 68, startVelocity: 34, origin: { y: 0.65 } })
})

async function copyCode() {
  if (!props.rewardCode) return
  await navigator.clipboard.writeText(props.rewardCode)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<template>
  <div v-if="rewardText || rewardCode" class="w-full">
    <!-- the tear line -->
    <div class="relative flex items-center justify-center py-1" aria-hidden="true">
      <hr class="perf-rule w-full">
      <Scissors class="absolute size-4 rotate-90 bg-background px-0.5 text-muted-foreground" />
    </div>

    <!-- the stub that tears away — marigold, torn both edges, styled as a voucher -->
    <div class="edge-torn-y animate-tear-away bg-reward px-6 py-6 text-center text-reward-foreground">
      <p class="ticket-meta text-reward-foreground/70">Voucher</p>

      <p v-if="rewardText" class="mt-1.5 font-display text-lg leading-tight font-semibold text-balance">
        {{ rewardText }}
      </p>

      <button
        v-if="rewardCode"
        type="button"
        class="group mt-4 inline-flex items-center gap-3 rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-reward-foreground/30"
        :aria-label="copied ? 'Code copied' : `Copy code ${rewardCode}`"
        @click="copyCode"
      >
        <span class="animate-code-stamp font-mono text-2xl font-bold tracking-[0.12em]">{{ rewardCode }}</span>
        <Check v-if="copied" class="size-5 shrink-0" />
        <Copy v-else class="size-5 shrink-0 opacity-70" />
      </button>
      <p v-if="rewardCode" class="mt-1.5 font-mono text-[0.7rem] tracking-wider uppercase opacity-70">
        {{ copied ? 'Copied' : 'Tap to copy' }}
      </p>

      <div aria-hidden="true" class="voucher-barcode mx-auto mt-4 max-w-56 text-reward-foreground/50" />

      <p v-if="rewardTerms" class="mx-auto mt-4 max-w-xs text-xs text-reward-foreground/75">{{ rewardTerms }}</p>

      <p class="mx-auto mt-3 max-w-xs text-[0.7rem] leading-relaxed text-reward-foreground/70">
        {{
          hasContactInfo
            ? `Copy this now — it's yours. If you ever lose it, ${businessName} can look it up with the details you gave them.`
            : "Copy this now — it's yours to keep, and it won't show again after you close this page."
        }}
      </p>
    </div>
  </div>
</template>
