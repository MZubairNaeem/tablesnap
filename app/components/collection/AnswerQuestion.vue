<script setup lang="ts">
/**
 * Every question is answerable by video or by typing, regardless of how the
 * business configured it — the customer's choice from the mode step (and any
 * in-question switch) always wins. This is the single component that
 * handles both, so switching back and forth never means swapping
 * components.
 *
 * The camera/recorder machinery lives in useVideoCapture(); this component
 * owns mode switching, text answers, and the three `answers` inserts, all of
 * which stay client-side and anonymous against the public_insert_answers RLS
 * policy (they intentionally do NOT go through a Nitro route).
 */
import type { AnswerMode, Business, Question } from '@/lib/supabase/types'
import { uploadWithProgress } from '@/lib/supabase/upload-with-progress'
import type { RecordState } from '@/components/RecordButton.vue'

type Mode = 'record' | 'upload' | 'write'

const MAX_SECONDS = 60

const props = defineProps<{
  business: Business
  question: Question
  responseId: string
  /** The customer's chosen way of answering. */
  initialMode: AnswerMode
}>()

const emit = defineEmits<{
  /** Fired whenever the customer manually switches, so the choice carries forward. */
  modeChange: [mode: AnswerMode]
  answered: []
}>()

const supabase = useSupabaseClient()
const config = useRuntimeConfig()

const mode = ref<Mode>(props.initialMode === 'text' ? 'write' : 'record')
const textValue = ref('')
const submittingText = ref(false)
const uploadProgress = ref(0)
const uploadError = ref<string | null>(null)

const capture = useVideoCapture(MAX_SECONDS)
// liveVideoRef isn't referenced here -- the composable's own
// useTemplateRef('liveVideo') binds to this component's <video ref="liveVideo">
// by name, regardless of whether the returned ref is re-destructured.
const { captureState, secondsLeft, previewUrl, blob, ext } = capture

// Request the camera as soon as we're in record mode. Unlike the React
// version there's no cameraAttempt counter -- retryCamera()/retake() just
// call startCamera() directly instead of bumping a dependency to re-fire an
// effect.
watch(
  mode,
  (m) => {
    if (m === 'record') capture.startCamera()
    else capture.stopCamera()
  },
  { immediate: true },
)

function switchMode(next: Mode) {
  uploadError.value = null
  mode.value = next
  if (next === 'upload') captureState.value = 'file-pending'
  emit('modeChange', next === 'write' ? 'text' : 'video')
}

function retryCamera() {
  mode.value = 'record'
  capture.startCamera()
  emit('modeChange', 'video')
}

function retake() {
  capture.resetCapture()
  uploadError.value = null
  if (mode.value === 'record') {
    capture.startCamera()
  } else {
    captureState.value = 'file-pending'
  }
}

function handleFileSelected(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) capture.acceptFile(file)
}

async function insertAnswer(payload: { video_url?: string; text_answer?: string; skipped: boolean }) {
  await supabase.from('answers').insert({
    id: crypto.randomUUID(),
    response_id: props.responseId,
    question_id: props.question.id,
    ...payload,
  })
  emit('answered')
}

async function uploadAndSave() {
  if (!blob.value) return

  capture.stopCamera()
  captureState.value = 'uploading'
  uploadProgress.value = 0
  uploadError.value = null

  try {
    const path = `${props.business.id}/${props.responseId}/${props.question.id}.${ext.value}`
    const url = await uploadWithProgress('testimonials', path, blob.value, (pct) => (uploadProgress.value = pct), {
      supabaseUrl: config.public.supabase.url as string,
      key: config.public.supabase.key as string,
    })
    await insertAnswer({ video_url: url, skipped: false })
  } catch (err) {
    console.error('Video upload failed:', err)
    uploadError.value = 'Upload failed. Check your connection and try again.'
    captureState.value = 'error'
  }
}

async function submitSkip() {
  capture.stopCamera()
  await insertAnswer({ skipped: true })
}

async function submitWrittenAnswer() {
  if (!textValue.value.trim()) return
  submittingText.value = true
  await insertAnswer({ text_answer: textValue.value.trim(), skipped: false })
}

const showEscapeHatches = computed(() =>
  (['camera-init', 'camera-live', 'file-pending', 'error'] as const).includes(captureState.value as never),
)

const recordState = computed<RecordState>(() =>
  captureState.value === 'camera-init' ? 'arming' : captureState.value === 'recording' ? 'recording' : 'idle',
)
</script>

<template>
  <div v-if="mode === 'write'" class="flex flex-1 flex-col gap-4">
    <Textarea
      v-model="textValue"
      placeholder="Type your answer here"
      rows="6"
      class="resize-none text-base"
      autofocus
    />
    <div class="flex flex-col gap-3">
      <Button size="xl" class="w-full" :disabled="!textValue.trim() || submittingText" @click="submitWrittenAnswer">
        Continue
      </Button>
      <div class="flex items-center justify-center gap-4 text-sm text-muted-foreground">
        <button type="button" class="underline underline-offset-4" @click="retryCamera">
          Record a video instead
        </button>
        <button type="button" class="underline underline-offset-4" @click="submitSkip">Skip</button>
      </div>
    </div>
  </div>

  <div v-else class="flex flex-1 flex-col gap-4">
    <div v-if="captureState === 'preview' && previewUrl" class="flex flex-1 flex-col gap-4">
      <video :src="previewUrl" controls playsinline class="aspect-3/4 w-full rounded-md bg-ink object-cover" />
      <p class="text-center text-sm text-muted-foreground">Happy with it? You can always record again.</p>
      <div class="flex gap-3">
        <Button variant="outline" size="xl" class="flex-1" @click="retake">Record again</Button>
        <Button size="xl" class="flex-1" @click="uploadAndSave">Use this</Button>
      </div>
    </div>

    <div v-if="captureState === 'uploading'" class="flex flex-1 flex-col items-center justify-center gap-4 py-10">
      <p class="ticket-meta">Sending your video · {{ uploadProgress }}%</p>
      <Progress :value="uploadProgress" class="h-2 w-full max-w-xs" />
    </div>

    <div v-if="captureState === 'error'" class="flex flex-col gap-3 rounded-md border border-destructive/30 bg-destructive/5 p-4">
      <p class="text-sm text-destructive">{{ uploadError }} You can try again, or type your answer instead.</p>
      <div class="flex gap-3">
        <Button size="lg" class="flex-1" @click="uploadAndSave">Try again</Button>
        <Button variant="outline" size="lg" class="flex-1" @click="switchMode('write')">Type it instead</Button>
      </div>
    </div>

    <template v-if="mode === 'record' && (captureState === 'camera-init' || captureState === 'camera-live' || captureState === 'recording')">
      <div class="relative">
        <video ref="liveVideo" autoplay muted playsinline class="aspect-3/4 w-full rounded-md bg-ink object-cover" />
        <div
          v-if="captureState === 'recording'"
          class="absolute top-3 right-3 flex items-center gap-1.5 rounded-sm bg-ink/70 px-2.5 py-1 font-mono text-xs font-medium tracking-wide text-primary-foreground"
        >
          <span class="size-2 animate-pulse rounded-full bg-primary motion-reduce:animate-none" />
          REC
        </div>
      </div>

      <!-- The moment before record — write to the self-conscious diner. -->
      <p v-if="captureState === 'camera-live'" class="text-center text-sm leading-relaxed text-muted-foreground text-balance">
        No one sees this but {{ business.name }} — and only if they choose to share it. Record as
        many times as you like. Ready when you are.
      </p>

      <RecordButton
        :state="recordState"
        :seconds-left="secondsLeft"
        :max-seconds="MAX_SECONDS"
        @start="capture.startRecording"
        @stop="capture.stopRecording"
      />
    </template>

    <!-- Camera blocked is a fork in the road, not an error. -->
    <div
      v-if="mode === 'record' && captureState === 'camera-denied'"
      class="flex flex-col gap-4 rounded-md border border-dashed border-line bg-muted/40 p-5 text-center"
    >
      <div>
        <p class="font-display text-lg font-semibold">Your camera's off</p>
        <p class="mt-1 text-sm text-muted-foreground text-balance">
          Turn it on in your browser settings — or just type your answer, it's just as welcome.
        </p>
      </div>
      <div class="flex flex-col gap-2">
        <Button size="xl" class="w-full" @click="switchMode('write')">Type it instead</Button>
        <Button size="lg" variant="outline" class="w-full" @click="retryCamera">Try the camera again</Button>
      </div>
    </div>

    <label
      v-if="mode === 'upload' && captureState === 'file-pending'"
      class="flex aspect-3/4 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-line text-center text-muted-foreground"
    >
      <span class="text-sm font-medium">Tap to choose a video</span>
      <input type="file" accept="video/*" capture="user" class="hidden" @change="handleFileSelected">
    </label>

    <div v-if="showEscapeHatches" class="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
      <button v-if="mode !== 'upload'" type="button" class="underline underline-offset-4" @click="switchMode('upload')">
        Upload a video
      </button>
      <button type="button" class="underline underline-offset-4" @click="switchMode('write')">Type it instead</button>
      <button type="button" class="underline underline-offset-4" @click="submitSkip">Skip</button>
    </div>
  </div>
</template>
