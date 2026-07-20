<script setup lang="ts">
import QRCode from 'qrcode'
import { Check, Copy, Download, MessageCircle } from '@lucide/vue'
import type { Business } from '@/lib/supabase/types'

const props = defineProps<{ business: Business }>()

const config = useRuntimeConfig()
const qrDataUrl = ref<string | null>(null)
const copied = ref(false)

const publicUrl = computed(() => `${config.public.siteUrl}/c/${props.business.slug}`)

watchEffect(async () => {
  qrDataUrl.value = await QRCode.toDataURL(publicUrl.value, {
    width: 1024,
    margin: 4,
    errorCorrectionLevel: 'H',
  })
})

async function copyLink() {
  await navigator.clipboard.writeText(publicUrl.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

const whatsappHref = computed(() => {
  const message = `We'd love your feedback! Leave a quick video review here: ${publicUrl.value}`
  return `https://wa.me/?text=${encodeURIComponent(message)}`
})
</script>

<template>
  <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
    <Card>
      <CardContent class="flex flex-col items-center gap-4 px-6 py-8">
        <img v-if="qrDataUrl" :src="qrDataUrl" alt="QR code" class="h-56 w-56 rounded-lg border">
        <div v-else class="h-56 w-56 animate-pulse rounded-lg bg-muted" />

        <div class="flex w-full items-center gap-2 rounded-lg border px-3 py-2">
          <p class="flex-1 truncate text-sm text-muted-foreground">{{ publicUrl }}</p>
          <button aria-label="Copy link" @click="copyLink">
            <Check v-if="copied" class="h-4 w-4 text-muted-foreground" />
            <Copy v-else class="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <div class="flex w-full flex-col gap-2 sm:flex-row">
          <Button as-child class="flex-1" :disabled="!qrDataUrl">
            <a :href="qrDataUrl ?? undefined" download="vouch-qr-code.png">
              <Download class="h-4 w-4" />
              Download QR PNG
            </a>
          </Button>
          <Button as-child variant="outline" class="flex-1">
            <a :href="whatsappHref" target="_blank" rel="noopener noreferrer">
              <MessageCircle class="h-4 w-4" />
              Send via WhatsApp
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>

    <div>
      <p class="ticket-meta mb-3">Table-tent preview</p>
      <TableTentPreview :business="business" :qr-data-url="qrDataUrl" />
    </div>
  </div>
</template>
