<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const businessStore = useBusinessStore()
const responsesStore = useResponsesStore()

await useAsyncData('dashboard-responses', () => responsesStore.load(businessStore.businessId!))
</script>

<template>
  <div class="mx-auto max-w-5xl px-6 py-8">
    <h1 class="text-2xl font-semibold tracking-tight">Written Responses</h1>
    <p class="mt-1 text-sm text-muted-foreground">Text answers your customers have submitted.</p>
    <div class="mt-6">
      <AnswerGallery variant="text" />
    </div>
  </div>
</template>
