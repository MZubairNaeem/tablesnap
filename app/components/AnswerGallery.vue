<script setup lang="ts">
import { Video, FileText } from '@lucide/vue'
import type { Answer, Question, ResponseStatus, ResponseWithAnswers } from '@/lib/supabase/types'

type FilterTab = 'all' | ResponseStatus

interface AnswerCard {
  answer: Answer
  response: ResponseWithAnswers
  question: Question | undefined
}

const props = defineProps<{ variant: 'video' | 'text' }>()

const store = useResponsesStore()
const filter = ref<FilterTab>('all')

const allCards = computed<AnswerCard[]>(() => {
  const cards: AnswerCard[] = []
  for (const response of store.responses) {
    for (const answer of response.answers) {
      const matches = props.variant === 'video' ? !!answer.video_url : !!answer.text_answer
      if (!matches) continue
      cards.push({ answer, response, question: store.questions.find((q) => q.id === answer.question_id) })
    }
  }
  return cards.sort((a, b) => new Date(b.response.created_at).getTime() - new Date(a.response.created_at).getTime())
})

const filteredCards = computed(() =>
  filter.value === 'all' ? allCards.value : allCards.value.filter((c) => c.response.status === filter.value),
)

const emptyCopy = computed(() =>
  props.variant === 'video'
    ? {
        icon: Video,
        title: 'No testimonials yet',
        description: 'Print your QR code and put it on the table. Videos land here as diners fill out the ticket.',
        meta: 'Nothing on the rail',
      }
    : {
        icon: FileText,
        title: 'No written answers yet',
        description: "When a diner types instead of filming, their answer shows up here.",
        meta: 'Nothing on the rail',
      },
)
</script>

<template>
  <div>
    <Tabs :model-value="filter" @update:model-value="(v) => (filter = v as FilterTab)">
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="approved">Published</TabsTrigger>
        <TabsTrigger value="rejected">Hidden</TabsTrigger>
      </TabsList>
    </Tabs>

    <div class="mt-6">
      <EmptyState
        v-if="filteredCards.length === 0"
        :icon="emptyCopy.icon"
        :title="emptyCopy.title"
        :description="emptyCopy.description"
        :meta="emptyCopy.meta"
        action-label="Get your QR code"
        action-href="/dashboard/qr"
      />
      <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <TestimonialCard
          v-for="{ answer, response, question } in filteredCards"
          :key="answer.id"
          :variant="variant"
          :video-url="answer.video_url"
          :text-answer="answer.text_answer"
          :question-text="question?.text ?? 'Question'"
          :customer-name="response.customer_name || 'Anonymous'"
          :date="new Date(response.created_at).toLocaleDateString()"
          :status="response.status"
          @click="store.select(response.id)"
        />
      </div>
    </div>

    <ResponseDetailModal />
  </div>
</template>
