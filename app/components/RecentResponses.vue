<script setup lang="ts">
import { Inbox } from '@lucide/vue'

const store = useResponsesStore()
</script>

<template>
  <EmptyState
    v-if="store.recent.length === 0"
    :icon="Inbox"
    title="No testimonials yet"
    description="Print your QR code and put it on the table. The first ticket will land right here."
    action-label="Get your QR code"
    action-href="/dashboard/qr"
  />

  <template v-else>
    <div class="divide-y divide-line overflow-hidden rounded-md border border-line bg-card">
      <button
        v-for="response in store.recent"
        :key="response.id"
        class="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-muted/50"
        @click="store.select(response.id)"
      >
        <div>
          <p class="text-sm font-medium text-ink">{{ response.customer_name || 'Anonymous' }}</p>
          <p class="ticket-meta mt-0.5 text-muted-foreground/80">
            {{ new Date(response.created_at).toLocaleDateString() }} · {{ response.answers.length }}
            answer{{ response.answers.length === 1 ? '' : 's' }}
          </p>
        </div>
        <StatusBadge :status="response.status" />
      </button>
    </div>

    <ResponseDetailModal />
  </template>
</template>
