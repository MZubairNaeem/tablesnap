<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const businessStore = useBusinessStore()
const responsesStore = useResponsesStore()

await useAsyncData('dashboard-responses', () => responsesStore.load(businessStore.businessId!))

const pending = computed(() => responsesStore.pendingCount)
</script>

<template>
  <div class="mx-auto max-w-5xl px-6 py-8">
    <h1 class="font-display text-2xl font-semibold tracking-tight">The pass</h1>
    <p class="mt-1 text-sm text-muted-foreground">
      {{
        pending > 0
          ? `${pending} ticket${pending === 1 ? '' : 's'} waiting on the rail.`
          : 'The rail is clear. Nothing waiting to review.'
      }}
    </p>

    <div class="mt-6 grid grid-cols-2 divide-x divide-y divide-line overflow-hidden rounded-md border border-line bg-card sm:grid-cols-4 sm:divide-y-0">
      <StatCard label="Total" :value="String(responsesStore.totalResponses)" />
      <StatCard label="Video" :value="String(responsesStore.videoCount)" />
      <StatCard label="Written" :value="String(responsesStore.writtenCount)" />
      <StatCard label="Completion" :value="`${responsesStore.completionRate}%`" />
    </div>

    <div class="mt-8">
      <h2 class="ticket-meta mb-3">On the rail</h2>
      <RecentResponses />
    </div>
  </div>
</template>
