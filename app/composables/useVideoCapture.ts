export type CaptureState =
  | 'camera-init'
  | 'camera-live'
  | 'camera-denied'
  | 'recording'
  | 'file-pending'
  | 'preview'
  | 'uploading'
  | 'error'

const MIME_CANDIDATES = [
  { mime: 'video/mp4;codecs=avc1', ext: 'mp4' },
  { mime: 'video/webm;codecs=vp9', ext: 'webm' },
  { mime: 'video/webm', ext: 'webm' },
]

function pickMimeType() {
  // Matters more here than it did in the React version -- this module's top
  // level runs during SSR too, so `MediaRecorder` genuinely doesn't exist.
  if (typeof MediaRecorder === 'undefined') return null
  return MIME_CANDIDATES.find((c) => MediaRecorder.isTypeSupported(c.mime)) ?? null
}

/**
 * All the imperative camera/recorder machinery for one question, extracted
 * out of the answer-question SFC so the template stays readable. Mode
 * branching (record vs. upload vs. write) and the Supabase writes stay in
 * the component -- this composable only knows about the camera.
 *
 * Every native browser object (MediaStream, MediaRecorder, Blob) is held in
 * a `shallowRef`, never a plain `ref` -- Vue's deep reactivity proxies plain
 * refs, and calling `.getTracks()` / `.start()` / `.stop()` on a Proxy of a
 * native object throws "Illegal invocation".
 */
export function useVideoCapture(maxSeconds: number) {
  const liveVideoRef = useTemplateRef<HTMLVideoElement>('liveVideo')

  const stream = shallowRef<MediaStream | null>(null)
  const recorder = shallowRef<MediaRecorder | null>(null)
  const blob = shallowRef<Blob | null>(null)
  let chunks: Blob[] = []
  let timer: ReturnType<typeof setInterval> | null = null
  let isActive = true

  const captureState = ref<CaptureState>('camera-init')
  const secondsLeft = ref(maxSeconds)
  const previewUrl = ref<string | null>(null)
  const ext = ref('webm')

  function stopCamera() {
    stream.value?.getTracks().forEach((t) => t.stop())
    stream.value = null
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  async function startCamera() {
    stopCamera()
    captureState.value = 'camera-init'
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: true,
      })
      if (!isActive) {
        s.getTracks().forEach((t) => t.stop())
        return
      }
      stream.value = s
      // The <video> behind a v-if may not exist yet the instant getUserMedia
      // resolves -- unlike React, the ref isn't guaranteed attached before
      // this runs. Wait a tick so the DOM has caught up with captureState.
      await nextTick()
      if (liveVideoRef.value) {
        liveVideoRef.value.srcObject = s
        liveVideoRef.value.muted = true
      }
      captureState.value = 'camera-live'
    } catch {
      if (isActive) captureState.value = 'camera-denied'
    }
  }

  function startRecording() {
    const s = stream.value
    const picked = pickMimeType()
    if (!s || !picked) {
      captureState.value = 'camera-denied'
      return
    }
    ext.value = picked.ext

    const rec = new MediaRecorder(s, { mimeType: picked.mime })
    chunks = []

    rec.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data)
    }

    rec.onstop = () => {
      const recordedBlob = new Blob(chunks, { type: picked.mime })
      blob.value = recordedBlob
      previewUrl.value = URL.createObjectURL(recordedBlob)
      captureState.value = 'preview'
    }

    recorder.value = rec
    rec.start()
    captureState.value = 'recording'
    secondsLeft.value = maxSeconds

    timer = setInterval(() => {
      secondsLeft.value -= 1
      if (secondsLeft.value <= 0) stopRecording()
    }, 1000)
  }

  function stopRecording() {
    recorder.value?.stop()
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  /** Clears any recorded/selected blob so the caller can restart capture. */
  function resetCapture() {
    blob.value = null
    previewUrl.value = null // the watcher below revokes the old URL
  }

  function acceptFile(file: File) {
    ext.value = file.name.split('.').pop() || 'mp4'
    blob.value = file
    previewUrl.value = URL.createObjectURL(file)
    captureState.value = 'preview'
  }

  // Revoke the outgoing object URL whenever it's replaced or cleared --
  // replaces the two manual revoke call sites the React version needed.
  watch(previewUrl, (_next, old) => {
    if (old) URL.revokeObjectURL(old)
  })

  onScopeDispose(() => {
    isActive = false
    stopCamera()
  })

  return {
    liveVideoRef,
    captureState,
    secondsLeft,
    previewUrl,
    blob,
    ext,
    startCamera,
    stopCamera,
    startRecording,
    stopRecording,
    resetCapture,
    acceptFile,
  }
}
