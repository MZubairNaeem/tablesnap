import { defineStore } from 'pinia'
import type { Question } from '@/lib/supabase/types'

export const useQuestionsStore = defineStore('questions', {
  state: () => ({
    questions: [] as Question[],
  }),
  getters: {
    active: (state) => state.questions.filter((q) => q.is_active),
    activeCount: (state) => state.questions.filter((q) => q.is_active).length,
  },
  actions: {
    async load(businessId: string) {
      const supabase = useSupabaseClient()
      const { data } = await supabase
        .from('questions')
        .select('*')
        .eq('business_id', businessId)
        .order('sort_order', { ascending: true })
      this.questions = data ?? []
    },
    async create(text: string) {
      const created = await $fetch<Question>('/api/questions', { method: 'POST', body: { text } })
      this.questions.push(created)
      return created
    },
    async updateText(id: string, text: string) {
      const idx = this.questions.findIndex((q) => q.id === id)
      const current = this.questions[idx]
      const previous = current?.text
      if (current) this.questions[idx] = { ...current, text }
      try {
        await $fetch(`/api/questions/${id}`, { method: 'PATCH', body: { text } })
      } catch (err) {
        if (current && previous !== undefined) this.questions[idx] = { ...current, text: previous }
        throw err
      }
    },
    async toggleActive(id: string, isActive: boolean) {
      const idx = this.questions.findIndex((q) => q.id === id)
      const current = this.questions[idx]
      if (current) this.questions[idx] = { ...current, is_active: isActive }
      try {
        await $fetch(`/api/questions/${id}`, { method: 'PATCH', body: { is_active: isActive } })
      } catch (err) {
        if (current) this.questions[idx] = { ...current, is_active: !isActive }
        throw err
      }
    },
    async remove(id: string) {
      const previous = this.questions
      this.questions = this.questions.filter((q) => q.id !== id)
      try {
        await $fetch(`/api/questions/${id}`, { method: 'DELETE' })
      } catch (err) {
        this.questions = previous
        throw err
      }
    },
    async reorder(orderedIds: string[]) {
      const previous = this.questions
      this.questions = orderedIds
        .map((id, index) => {
          const q = this.questions.find((question) => question.id === id)
          return q ? { ...q, sort_order: index } : null
        })
        .filter((q): q is Question => q !== null)
      try {
        await $fetch('/api/questions/reorder', { method: 'POST', body: { orderedIds } })
      } catch (err) {
        this.questions = previous
        throw err
      }
    },
  },
})
