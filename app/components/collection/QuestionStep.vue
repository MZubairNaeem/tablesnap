<script setup lang="ts">
import type { AnswerMode, Business, Question } from '@/lib/supabase/types'

defineProps<{
  business: Business
  question: Question
  responseId: string
  questionNumber: number
  totalQuestions: number
  preferredMode: AnswerMode
}>()

defineEmits<{
  modeChange: [mode: AnswerMode]
  answered: []
}>()
</script>

<template>
  <Ticket edge="bottom" class="pb-3">
    <TicketHeader :business="business.name" :meta="`${questionNumber} / ${totalQuestions}`" />
    <TicketPerforation />

    <div class="flex flex-col gap-5 px-6 pt-5 pb-4">
      <h2 class="font-display text-2xl leading-tight font-semibold tracking-tight text-balance">
        {{ question.text }}
      </h2>

      <AnswerQuestion
        :business="business"
        :question="question"
        :response-id="responseId"
        :initial-mode="preferredMode"
        @mode-change="$emit('modeChange', $event)"
        @answered="$emit('answered')"
      />
    </div>
  </Ticket>
</template>
