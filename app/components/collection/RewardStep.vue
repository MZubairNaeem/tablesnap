<script setup lang="ts">
import { Check } from '@lucide/vue'
import type { Business } from '@/lib/supabase/types'

const props = defineProps<{
  business: Business
  customerName: string
  customerEmail: string
  customerPhone: string
}>()

const hasContactInfo = computed(() => Boolean(props.customerEmail || props.customerPhone))
</script>

<template>
  <Ticket edge="bottom" class="pb-4">
    <TicketHeader :business="business.name" meta="✓ done" />
    <TicketPerforation />

    <div class="flex flex-col items-center gap-3 px-6 pt-6 text-center">
      <div class="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Check class="size-6" />
      </div>
      <h1 class="font-display text-3xl leading-tight font-semibold tracking-tight text-balance">
        That's a wrap — thank you, {{ customerName || 'friend' }}!
      </h1>
      <p class="max-w-xs text-sm text-muted-foreground text-balance">
        Video or written, every answer helps {{ business.name }} — and helps the next diner decide
        where to eat.
      </p>
    </div>

    <div class="px-3 pt-5">
      <RewardReveal
        :business-name="business.name"
        :reward-text="business.reward_text"
        :reward-code="business.reward_code"
        :reward-terms="business.reward_terms"
        :has-contact-info="hasContactInfo"
      />
    </div>

    <p class="px-6 pt-5 text-center text-[0.7rem] leading-relaxed text-muted-foreground/70">
      This review was submitted in exchange for a discount.
    </p>
  </Ticket>
</template>
