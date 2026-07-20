<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const businessStore = useBusinessStore()
const responsesStore = useResponsesStore()

await useAsyncData('dashboard-responses', () => responsesStore.load(businessStore.businessId!))
</script>

<template>
  <div class="mx-auto max-w-5xl px-6 py-8">
    <h1 class="text-2xl font-semibold tracking-tight">Testimonials</h1>
    <p class="mt-1 text-sm text-muted-foreground">Video answers your customers have recorded.</p>
    <div class="mt-6">
      <AnswerGallery variant="video" />
    </div>
  </div>
</template>
