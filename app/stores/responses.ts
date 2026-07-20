import { defineStore } from 'pinia'
import type { Question, ResponseStatus, ResponseWithAnswers } from '@/lib/supabase/types'

/**
 * The highest-value store in the migration. response-detail-modal.tsx used
 * to be consumed by three parents (recent-responses, customers-table,
 * answer-gallery) with an identical onStatusChange contract, each hand-
 * rolling the same `setResponses(prev => prev.map(...))` reducer. Here
 * every view reads the same array, so ResponseDetailModal.vue needs zero
 * props and a status change is visible everywhere with no network
 * round-trip, no revalidatePath needed.
 */
export const useResponsesStore = defineStore('responses', {
  state: () => ({
    responses: [] as ResponseWithAnswers[],
    questions: [] as Question[],
    selectedId: null as string | null,
    pending: false,
  }),
  getters: {
    selected: (state) => state.responses.find((r) => r.id === state.selectedId) ?? null,
    recent: (state) => state.responses.slice(0, 8),
    totalResponses: (state) => state.responses.length,
    videoCount: (state) =>
      state.responses.reduce((sum, r) => sum + r.answers.filter((a) => a.video_url).length, 0),
    writtenCount: (state) =>
      state.responses.reduce((sum, r) => sum + r.answers.filter((a) => a.text_answer).length, 0),
    activeQuestions: (state) => state.questions.filter((q) => q.is_active),
    completionRate: (state) => {
      if (state.responses.length === 0) return 0
      const activeIds = state.questions.filter((q) => q.is_active).map((q) => q.id)
      const completed = state.responses.filter((r) =>
        activeIds.every((qId) => r.answers.some((a) => a.question_id === qId)),
      )
      return Math.round((completed.length / state.responses.length) * 100)
    },
    pendingCount: (state) => state.responses.filter((r) => r.status === 'pending').length,
  },
  actions: {
    async load(businessId: string) {
      const supabase = useSupabaseClient()
      const [{ data: responses }, { data: questions }] = await Promise.all([
        supabase
          .from('responses')
          .select('*, answers(*)')
          .eq('business_id', businessId)
          .order('created_at', { ascending: false }),
        supabase.from('questions').select('*').eq('business_id', businessId).order('sort_order', { ascending: true }),
      ])
      this.responses = (responses as ResponseWithAnswers[] | null) ?? []
      this.questions = questions ?? []
    },
    select(id: string | null) {
      this.selectedId = id
    },
    async setStatus(responseId: string, status: ResponseStatus) {
      const idx = this.responses.findIndex((r) => r.id === responseId)
      const current = this.responses[idx]
      const previousStatus = current?.status
      if (current) this.responses[idx] = { ...current, status }

      this.pending = true
      try {
        await $fetch(`/api/responses/${responseId}/status`, { method: 'PATCH', body: { status } })
      } catch (err) {
        if (current && previousStatus) this.responses[idx] = { ...current, status: previousStatus }
        throw err
      } finally {
        this.pending = false
      }
    },
  },
})
