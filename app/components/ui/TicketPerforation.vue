<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <hr data-slot="ticket-perforation" :class="cn('perf-rule mx-5', props.class)">
</template>
