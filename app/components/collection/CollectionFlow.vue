<script setup lang="ts">
import type { AnswerMode, Business, Question } from '@/lib/supabase/types'

type Step =
  | { kind: 'welcome' }
  | { kind: 'contact' }
  | { kind: 'mode' }
  | { kind: 'question'; index: number }
  | { kind: 'reward' }

const props = defineProps<{ business: Business; questions: Question[] }>()

const step = ref<Step>({ kind: 'welcome' })
const responseId = ref<string | null>(null)
const customerName = ref('')
const customerEmail = ref('')
const customerPhone = ref('')
const preferredMode = ref<AnswerMode>('video')

const currentQuestionIndex = computed(() => (step.value.kind === 'question' ? step.value.index : -1))
const currentQuestion = computed(() =>
  currentQuestionIndex.value >= 0 ? props.questions[currentQuestionIndex.value] : null,
)

function advancePastQuestion(currentIndex: number) {
  const next = currentIndex + 1
  step.value = next < props.questions.length ? { kind: 'question', index: next } : { kind: 'reward' }
}

function handleContactSubmitted(id: string, name: string, email: string, phone: string) {
  responseId.value = id
  customerName.value = name
  customerEmail.value = email
  customerPhone.value = phone
  step.value = props.questions.length > 0 ? { kind: 'mode' } : { kind: 'reward' }
}

function handleModeChosen(mode: AnswerMode) {
  preferredMode.value = mode
  step.value = { kind: 'question', index: 0 }
}

function handleQuestionAnswered() {
  advancePastQuestion(currentQuestionIndex.value)
}

// The tenant paints the accent. The signature (the ticket) is structural, so
// it survives any brand color; --reward is never overridden.
const themeStyle = computed(() => ({
  '--primary': props.business.brand_color,
  '--ring': props.business.brand_color,
}))
</script>

<template>
  <div :style="themeStyle" class="flex min-h-svh flex-col bg-background">
    <main class="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-6">
      <WelcomeStep v-if="step.kind === 'welcome'" :business="business" @start="step = { kind: 'contact' }" />

      <ContactStep v-else-if="step.kind === 'contact'" :business="business" @submitted="handleContactSubmitted" />

      <ModeStep v-else-if="step.kind === 'mode'" :business="business" @choose="handleModeChosen" />

      <QuestionStep
        v-else-if="step.kind === 'question' && responseId && currentQuestion"
        :key="currentQuestion.id"
        :business="business"
        :question="currentQuestion"
        :response-id="responseId"
        :question-number="currentQuestionIndex + 1"
        :total-questions="questions.length"
        :preferred-mode="preferredMode"
        @mode-change="(m) => (preferredMode = m)"
        @answered="handleQuestionAnswered"
      />

      <RewardStep
        v-else-if="step.kind === 'reward'"
        :business="business"
        :customer-name="customerName"
        :customer-email="customerEmail"
        :customer-phone="customerPhone"
      />
    </main>
  </div>
</template>
