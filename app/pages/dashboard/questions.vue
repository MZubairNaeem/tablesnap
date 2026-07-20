<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const businessStore = useBusinessStore()
const questionsStore = useQuestionsStore()

await useAsyncData('dashboard-questions', () => questionsStore.load(businessStore.businessId!))
</script>

<template>
  <QuestionsManager />
</template>
