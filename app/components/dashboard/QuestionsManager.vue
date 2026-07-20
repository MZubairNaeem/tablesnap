<script setup lang="ts">
import draggable from 'vuedraggable'
import { Plus } from '@lucide/vue'
import type { Question } from '@/lib/supabase/types'

const store = useQuestionsStore()

const addOpen = ref(false)
const addText = ref('')
const deleteTarget = ref<Question | null>(null)

// vuedraggable mutates store.questions in place via v-model as the user
// drags -- arrayMove() has no equivalent here, the array is already
// reordered by the time @end fires. This just persists the new order.
async function handleReorder() {
  await store.reorder(store.questions.map((q) => q.id))
}

function submitAdd() {
  if (!addText.value.trim()) return
  addOpen.value = false
  const text = addText.value.trim()
  addText.value = ''
  store.create(text)
}

async function handleConfirmDelete() {
  if (!deleteTarget.value) return
  const id = deleteTarget.value.id
  deleteTarget.value = null
  await store.remove(id)
}
</script>

<template>
  <div class="mx-auto max-w-4xl px-6 py-8">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">Questions</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          {{ store.activeCount }} of {{ store.questions.length }} questions active — this is what your customers see.
        </p>
      </div>
      <Button @click="addOpen = true">
        <Plus class="h-4 w-4" />
        Add question
      </Button>
    </div>

    <Alert v-if="store.activeCount > 5" class="mt-4">
      <AlertDescription>More than 5 questions lowers completion rates. Consider turning a few off.</AlertDescription>
    </Alert>

    <div class="mt-6 rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-8" />
            <TableHead>Question</TableHead>
            <TableHead class="w-20">Active</TableHead>
            <TableHead class="w-10" />
          </TableRow>
        </TableHeader>
        <draggable
          v-model="store.questions"
          tag="tbody"
          item-key="id"
          handle=".drag-handle"
          class="[&_tr:last-child]:border-0"
          @end="handleReorder"
        >
          <template #item="{ element: question }">
            <QuestionRow
              :question="question"
              @toggle-active="(checked) => store.toggleActive(question.id, checked)"
              @text-save="(text) => store.updateText(question.id, text)"
              @delete="deleteTarget = question"
            />
          </template>
        </draggable>
      </Table>
    </div>

    <Dialog v-model:open="addOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a question</DialogTitle>
        </DialogHeader>
        <div class="flex flex-col gap-4">
          <div class="space-y-1.5">
            <Label for="question-text">Question</Label>
            <Textarea id="question-text" v-model="addText" rows="3" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="addOpen = false">Cancel</Button>
          <Button @click="submitAdd">Add question</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <AlertDialog :open="!!deleteTarget" @update:open="(open) => !open && (deleteTarget = null)">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this question?</AlertDialogTitle>
          <AlertDialogDescription>
            This won't delete answers already collected for it, but customers will no longer be asked
            it. This can't be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction @click="handleConfirmDelete">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
