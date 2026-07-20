<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { contactSchema } from '@/lib/validations/contact'
import type { Business } from '@/lib/supabase/types'

const props = defineProps<{ business: Business }>()
const emit = defineEmits<{
  submitted: [responseId: string, name: string, email: string, phone: string]
}>()

const supabase = useSupabaseClient()
const submitting = ref(false)
const submitError = ref<string | null>(null)

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(contactSchema),
  initialValues: { name: '', email: '', phone: '', consent: false },
})

const [name, nameAttrs] = defineField('name')
const [email, emailAttrs] = defineField('email')
const [phone, phoneAttrs] = defineField('phone')
const [consent] = defineField('consent')

const onSubmit = handleSubmit(async (formValues) => {
  submitting.value = true
  submitError.value = null

  const responseId = crypto.randomUUID()

  const { error } = await supabase.from('responses').insert({
    id: responseId,
    business_id: props.business.id,
    customer_name: formValues.name,
    customer_email: formValues.email || null,
    customer_phone: formValues.phone || null,
    consent: formValues.consent,
  })

  if (error) {
    submitError.value = "That didn't save. Check your connection and tap continue again."
    submitting.value = false
    return
  }

  emit('submitted', responseId, formValues.name, formValues.email ?? '', formValues.phone ?? '')
})
</script>

<template>
  <Ticket edge="bottom" class="pb-3">
    <TicketHeader :business="business.name" meta="1 of 2" />
    <TicketPerforation />

    <div class="px-6 pt-5 pb-4">
      <h1 class="font-display text-3xl leading-tight font-semibold tracking-tight text-balance">
        Get {{ business.reward_text || 'a discount voucher' }} for your review
      </h1>
      <p class="mt-1.5 text-sm text-muted-foreground">First, so {{ business.name }} knows who to thank.</p>

      <form class="mt-5 flex flex-col gap-4" @submit="onSubmit">
        <div class="space-y-1.5">
          <Label for="name">Name</Label>
          <Input id="name" v-model="name" v-bind="nameAttrs" class="h-12 text-base" autofocus />
          <p v-if="errors.name" class="text-sm text-destructive">{{ errors.name }}</p>
        </div>

        <div class="space-y-1.5">
          <Label for="email">Email (optional)</Label>
          <Input id="email" v-model="email" v-bind="emailAttrs" type="email" class="h-12 text-base" />
          <p v-if="errors.email" class="text-sm text-destructive">{{ errors.email }}</p>
        </div>

        <div class="space-y-1.5">
          <Label for="phone">WhatsApp number (optional)</Label>
          <Input id="phone" v-model="phone" v-bind="phoneAttrs" type="tel" class="h-12 text-base" />
        </div>

        <p class="text-xs leading-relaxed text-muted-foreground">
          This is so {{ business.name }} can send you discount vouchers later, in exchange for
          testimonials like this one. Never used for marketing.
        </p>

        <div class="flex items-start gap-3 pt-1">
          <Checkbox
            id="consent"
            :model-value="consent"
            class="mt-0.5"
            @update:model-value="(v) => (consent = v === true)"
          />
          <Label for="consent" class="text-sm leading-snug font-normal text-muted-foreground">
            I'm happy for {{ business.name }} to share my video and name publicly.
          </Label>
        </div>
        <p v-if="errors.consent" class="text-sm text-destructive">{{ errors.consent }}</p>

        <p v-if="submitError" class="text-sm text-destructive">{{ submitError }}</p>

        <Button type="submit" size="xl" class="mt-1 w-full" :disabled="submitting">
          {{ submitting ? 'One sec' : 'Continue' }}
        </Button>
      </form>
    </div>
  </Ticket>
</template>
