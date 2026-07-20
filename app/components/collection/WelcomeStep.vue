<script setup lang="ts">
import type { Business } from '@/lib/supabase/types'

defineProps<{ business: Business }>()
defineEmits<{ start: [] }>()
</script>

<template>
  <Ticket edge="bottom" class="pb-3">
    <TicketHeader :business="business.name" meta="For you" />
    <TicketPerforation />

    <div class="flex flex-col items-center gap-5 px-6 pt-6 pb-4 text-center">
      <img
        v-if="business.logo_url"
        :src="business.logo_url"
        :alt="business.name"
        class="size-14 rounded-full object-cover"
      >
      <div
        v-else
        class="flex size-14 items-center justify-center rounded-full text-lg font-semibold text-primary-foreground"
        :style="{ backgroundColor: business.brand_color }"
      >
        {{ business.name.charAt(0).toUpperCase() }}
      </div>

      <h1 class="font-display text-3xl leading-tight font-semibold tracking-tight text-balance">
        Tell {{ business.name }} how it went
      </h1>

      <p class="text-[0.95rem] leading-relaxed text-muted-foreground text-balance">
        Three or four quick questions, on camera. It takes about a minute — and there's something
        in it for you.
      </p>

      <div v-if="business.reward_text" class="w-full rounded-md border border-dashed border-line bg-muted/40 px-4 py-3">
        <p class="ticket-meta text-muted-foreground">Your voucher</p>
        <p class="mt-1 font-display text-lg font-semibold text-balance">{{ business.reward_text }}</p>
      </div>

      <Button size="xl" class="mt-1 w-full" @click="$emit('start')">Start</Button>
    </div>
  </Ticket>
</template>
