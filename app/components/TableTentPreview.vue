<script setup lang="ts">
import type { Business } from '@/lib/supabase/types'

/**
 * The printable table-tent artifact — the ticket in the physical world. Rendered
 * as a real ticket so what sits on the table matches what the diner sees on their
 * phone. Uses accent, never the reward color (the reward only appears at payoff).
 */
defineProps<{ business: Business; qrDataUrl: string | null }>()
</script>

<template>
  <Ticket edge="bottom" class="mx-auto w-full max-w-xs pb-3">
    <TicketHeader :business="business.name" meta="Scan me" />
    <TicketPerforation />
    <div class="flex flex-col items-center gap-4 px-6 pt-5 pb-6 text-center">
      <p class="font-display text-xl leading-tight font-semibold text-balance">Tell us how it went</p>
      <p class="text-sm text-muted-foreground text-balance">
        Scan the code, answer three quick questions on camera{{
          business.reward_text ? `, and get ${business.reward_text}` : ''
        }}.
      </p>
      <img v-if="qrDataUrl" :src="qrDataUrl" alt="QR code" class="size-40 rounded-sm border border-line">
      <div v-else class="size-40 animate-pulse rounded-sm bg-muted" />
      <p class="ticket-meta">About 90 seconds</p>
    </div>
  </Ticket>
</template>
