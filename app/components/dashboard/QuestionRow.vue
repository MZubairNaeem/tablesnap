<script setup lang="ts">
import { GripVertical, Trash2 } from '@lucide/vue'
import type { Question } from '@/lib/supabase/types'

const props = defineProps<{ question: Question }>()
const emit = defineEmits<{
  toggleActive: [checked: boolean]
  textSave: [text: string]
  delete: []
}>()

const editing = ref(false)
const value = ref(props.question.text)

watch(
  () => props.question.text,
  (text) => {
    if (!editing.value) value.value = text
  },
)

function save() {
  editing.value = false
  emit('textSave', value.value)
}

function cancel() {
  value.value = props.question.text
  editing.value = false
}
</script>

<template>
  <TableRow>
    <TableCell>
      <!-- .drag-handle is the vuedraggable handle selector on the parent -->
      <button class="drag-handle cursor-grab touch-none text-muted-foreground active:cursor-grabbing" aria-label="Drag to reorder">
        <GripVertical class="h-4 w-4" />
      </button>
    </TableCell>
    <TableCell>
      <Input
        v-if="editing"
        v-model="value"
        autofocus
        @blur="save"
        @keydown.enter="save"
        @keydown.escape="cancel"
      />
      <button v-else class="text-left text-sm hover:underline" @click="editing = true">
        {{ question.text }}
      </button>
    </TableCell>
    <TableCell>
      <Switch :model-value="question.is_active" @update:model-value="(v) => emit('toggleActive', !!v)" />
    </TableCell>
    <TableCell>
      <Button variant="ghost" size="icon" aria-label="Delete question" @click="emit('delete')">
        <Trash2 class="h-4 w-4 text-muted-foreground" />
      </Button>
    </TableCell>
  </TableRow>
</template>
