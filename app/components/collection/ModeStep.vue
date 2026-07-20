<script setup lang="ts">
import { Video, PenLine } from '@lucide/vue'
import type { AnswerMode, Business } from '@/lib/supabase/types'

defineProps<{ business: Business }>()
defineEmits<{ choose: [mode: AnswerMode] }>()
</script>

<template>
  <Ticket edge="bottom" class="pb-3">
    <TicketHeader :business="business.name" meta="2 of 2" />
    <TicketPerforation />

    <div class="flex flex-col gap-5 px-6 pt-5 pb-4">
      <div>
        <h1 class="font-display text-2xl font-semibold tracking-tight text-balance">
          How would you like to answer?
        </h1>
        <p class="mt-1 text-sm text-muted-foreground">Either way works — you can switch on any question.</p>
      </div>

      <div class="flex flex-col gap-3">
        <button
          type="button"
          class="group flex items-center gap-4 rounded-md border-2 border-primary bg-primary/5 px-5 py-4 text-left transition-colors hover:bg-primary/10"
          @click="$emit('choose', 'video')"
        >
          <span class="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Video class="size-5" />
          </span>
          <span>
            <span class="block font-display text-lg leading-tight font-semibold">Record video answers</span>
            <span class="block text-sm text-muted-foreground">Just talk to the camera — about a minute total</span>
          </span>
        </button>

        <button
          type="button"
          class="group flex items-center gap-4 rounded-md border border-line bg-card px-5 py-4 text-left transition-colors hover:bg-muted/50"
          @click="$emit('choose', 'text')"
        >
          <span class="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <PenLine class="size-5" />
          </span>
          <span>
            <span class="block font-display text-lg leading-tight font-semibold">Type my answers</span>
            <span class="block text-sm text-muted-foreground">Quick to read, quick to write</span>
          </span>
        </button>
      </div>
    </div>
  </Ticket>
</template>
