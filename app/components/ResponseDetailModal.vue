<script setup lang="ts">
/**
 * Store-driven -- props dropped from 4 to 0. Reads useResponsesStore()
 * directly instead of being passed `response`/`questions`/`onClose`/
 * `onStatusChange` by three different parents that each hand-rolled the
 * same reducer. `isPending` (React's useTransition) becomes store.pending.
 */
const store = useResponsesStore()

const response = computed(() => store.selected)
const isOpen = computed({
  get: () => !!response.value,
  set: (open) => {
    if (!open) store.select(null)
  },
})

function questionText(questionId: string) {
  return store.questions.find((q) => q.id === questionId)?.text ?? 'Question'
}

function setStatus(status: 'approved' | 'rejected') {
  if (!response.value) return
  store.setStatus(response.value.id, status)
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="max-h-[85vh] overflow-y-auto sm:max-w-xl">
      <template v-if="response">
        <DialogHeader>
          <div class="flex items-center gap-2.5">
            <DialogTitle class="font-display">{{ response.customer_name || 'Anonymous' }}</DialogTitle>
            <span
              v-if="response.status === 'approved'"
              class="animate-stamp-press inline-flex rounded-sm border-2 border-primary/50 px-1.5 py-0.5 font-mono text-[0.62rem] font-bold tracking-[0.12em] text-primary uppercase"
            >
              Published
            </span>
            <StatusBadge v-else :status="response.status" />
          </div>
        </DialogHeader>

        <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <p v-if="response.customer_email">{{ response.customer_email }}</p>
          <p v-if="response.customer_phone">{{ response.customer_phone }}</p>
          <p>{{ new Date(response.created_at).toLocaleString() }}</p>
          <p>{{ response.consent ? 'Consented to public use' : 'No consent on file' }}</p>
        </div>

        <Separator />

        <div class="flex flex-col gap-5">
          <div v-for="answer in response.answers" :key="answer.id" class="space-y-2">
            <p class="text-sm font-medium">{{ questionText(answer.question_id) }}</p>
            <Badge v-if="answer.skipped" variant="outline" class="text-muted-foreground">Skipped</Badge>
            <div v-if="answer.video_url" class="space-y-2">
              <video :src="answer.video_url" controls playsinline class="aspect-video w-full rounded-lg bg-black" />
              <a :href="answer.video_url" download class="text-xs font-medium underline underline-offset-4">
                Download {{ answer.video_url.split('.').pop()?.toUpperCase() }}
              </a>
            </div>
            <p v-if="answer.text_answer" class="rounded-lg bg-muted/40 p-3 text-sm">{{ answer.text_answer }}</p>
          </div>
        </div>

        <Separator />

        <div class="flex items-center justify-between gap-2">
          <p class="ticket-meta">{{ response.consent ? 'Consent on file' : 'No consent — do not publish' }}</p>
          <div class="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              :disabled="store.pending || response.status === 'rejected'"
              @click="setStatus('rejected')"
            >
              {{ response.status === 'rejected' ? 'Hidden' : 'Hide' }}
            </Button>
            <Button size="sm" :disabled="store.pending || response.status === 'approved'" @click="setStatus('approved')">
              {{ response.status === 'approved' ? 'Published' : 'Publish' }}
            </Button>
          </div>
        </div>
      </template>
    </DialogContent>
  </Dialog>
</template>
