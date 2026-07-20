<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { businessSettingsSchema } from '@/lib/validations/business'
import type { Business } from '@/lib/supabase/types'

const props = defineProps<{ business: Business }>()

const businessStore = useBusinessStore()
const supabase = useSupabaseClient()

const logoUrl = ref(props.business.logo_url ?? '')
const uploadingLogo = ref(false)
const saved = ref(false)

const { defineField, handleSubmit, errors, isSubmitting } = useForm({
  validationSchema: toTypedSchema(businessSettingsSchema),
  initialValues: {
    name: props.business.name,
    brand_color: props.business.brand_color,
    reward_text: props.business.reward_text ?? '',
    reward_code: props.business.reward_code ?? '',
    reward_terms: props.business.reward_terms ?? '',
  },
})

const [name, nameAttrs] = defineField('name')
const [brandColor, brandColorAttrs] = defineField('brand_color')
const [rewardText, rewardTextAttrs] = defineField('reward_text')
const [rewardCode, rewardCodeAttrs] = defineField('reward_code')
const [rewardTerms, rewardTermsAttrs] = defineField('reward_terms')

async function handleLogoChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  uploadingLogo.value = true
  const ext = file.name.split('.').pop() || 'png'
  const path = `${props.business.id}/logo.${ext}`

  const { error } = await supabase.storage.from('logos').upload(path, file, { upsert: true, contentType: file.type })

  if (!error) {
    const {
      data: { publicUrl },
    } = supabase.storage.from('logos').getPublicUrl(path)
    logoUrl.value = `${publicUrl}?t=${Date.now()}`
  }
  uploadingLogo.value = false
}

const onSubmit = handleSubmit(async (values) => {
  saved.value = false
  await businessStore.update({
    name: values.name,
    brand_color: values.brand_color,
    reward_text: values.reward_text || null,
    reward_code: values.reward_code || null,
    reward_terms: values.reward_terms || null,
    logo_url: logoUrl.value || undefined,
  })
  saved.value = true
  setTimeout(() => (saved.value = false), 2500)
})
</script>

<template>
  <form class="flex max-w-2xl flex-col gap-6" @submit="onSubmit">
    <Card>
      <CardContent class="flex flex-col gap-4 px-6 py-6">
        <h2 class="text-sm font-semibold">Business profile</h2>

        <div class="flex items-center gap-4">
          <img v-if="logoUrl" :src="logoUrl" alt="Logo" class="h-16 w-16 rounded-full object-cover">
          <div v-else class="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-lg font-semibold text-muted-foreground">
            {{ business.name.charAt(0).toUpperCase() }}
          </div>
          <div>
            <Label for="logo" class="cursor-pointer text-sm font-medium underline underline-offset-4">
              {{ uploadingLogo ? 'Uploading...' : 'Change logo' }}
            </Label>
            <input id="logo" type="file" accept="image/*" class="hidden" :disabled="uploadingLogo" @change="handleLogoChange">
          </div>
        </div>

        <div class="space-y-1.5">
          <Label for="name">Business name</Label>
          <Input id="name" v-model="name" v-bind="nameAttrs" />
          <p v-if="errors.name" class="text-sm text-destructive">{{ errors.name }}</p>
        </div>

        <div class="space-y-1.5">
          <Label for="brand_color">Brand color</Label>
          <div class="flex items-center gap-3">
            <input id="brand_color" v-model="brandColor" v-bind="brandColorAttrs" type="color" class="h-10 w-14 cursor-pointer rounded border">
            <span class="text-sm text-muted-foreground">Used as the accent color on your public collection page.</span>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardContent class="flex flex-col gap-4 px-6 py-6">
        <h2 class="text-sm font-semibold">Reward</h2>

        <div class="space-y-1.5">
          <Label for="reward_text">Reward description</Label>
          <Input id="reward_text" v-model="rewardText" v-bind="rewardTextAttrs" placeholder="10% off your next visit" />
        </div>

        <div class="space-y-1.5">
          <Label for="reward_code">Reward code</Label>
          <Input id="reward_code" v-model="rewardCode" v-bind="rewardCodeAttrs" placeholder="THANKYOU10" />
        </div>

        <div class="space-y-1.5">
          <Label for="reward_terms">Terms</Label>
          <Textarea
            id="reward_terms"
            v-model="rewardTerms"
            v-bind="rewardTermsAttrs"
            rows="3"
            placeholder="Valid for 30 days. One per customer."
          />
        </div>
      </CardContent>
    </Card>

    <div class="flex items-center gap-3">
      <Button type="submit" :disabled="isSubmitting">{{ isSubmitting ? 'Saving...' : 'Save changes' }}</Button>
      <p v-if="saved" class="text-sm text-muted-foreground">Saved.</p>
    </div>
  </form>
</template>
