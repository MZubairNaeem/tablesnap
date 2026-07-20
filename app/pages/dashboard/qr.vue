<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const businessStore = useBusinessStore()
</script>

<template>
  <div class="mx-auto max-w-5xl px-6 py-8">
    <h1 class="text-2xl font-semibold tracking-tight">QR & Link</h1>
    <p class="mt-1 text-sm text-muted-foreground">Print this at your counter or share the link directly.</p>
    <div class="mt-6">
      <QrPanel v-if="businessStore.business" :business="businessStore.business" />
    </div>
  </div>
</template>
