<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const businessStore = useBusinessStore()
</script>

<template>
  <div class="mx-auto max-w-5xl px-6 py-8">
    <h1 class="text-2xl font-semibold tracking-tight">Settings</h1>
    <p class="mt-1 text-sm text-muted-foreground">Update your business profile, branding, and reward.</p>
    <div class="mt-6">
      <SettingsForm v-if="businessStore.business" :business="businessStore.business" />
    </div>
  </div>
</template>
