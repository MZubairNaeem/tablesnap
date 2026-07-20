<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { signupSchema } from '@/lib/validations/auth'

const supabase = useSupabaseClient()
const config = useRuntimeConfig()
const submitting = ref(false)
const formError = ref<string | null>(null)
const checkEmail = ref(false)

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(signupSchema),
  initialValues: { businessName: '', email: '', password: '' },
})

const [businessName, businessNameAttrs] = defineField('businessName')
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const onSubmit = handleSubmit(async (values) => {
  submitting.value = true
  formError.value = null

  const { data, error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      data: { business_name: values.businessName },
      emailRedirectTo: `${config.public.siteUrl}/confirm`,
    },
  })

  if (error) {
    formError.value = error.message
    submitting.value = false
    return
  }

  if (!data.session) {
    // "Confirm email" is on for this project -- signUp succeeds but no
    // session is issued until the user clicks the confirmation link.
    checkEmail.value = true
    submitting.value = false
    return
  }

  // See login.vue -- populate session/user state synchronously instead of
  // waiting on the async onAuthStateChange listener, otherwise the
  // "global-auth" middleware still sees no session and bounces back.
  useSupabaseSession().value = data.session
  const { data: claimsData } = await supabase.auth.getClaims()
  useSupabaseUser().value = claimsData?.claims ?? null

  await navigateTo('/dashboard')
})
</script>

<template>
  <div
    v-if="checkEmail"
    class="relative mx-auto flex min-h-svh w-full max-w-sm flex-col justify-center gap-4 px-6 py-10 text-center"
  >
    <ThemeToggle class="absolute top-6 right-6" />
    <h1 class="text-2xl font-semibold tracking-tight">Check your email</h1>
    <p class="text-sm text-muted-foreground">
      We sent you a confirmation link. Click it to activate your account, then log in.
    </p>
    <NuxtLink to="/login" class="font-medium text-foreground underline underline-offset-4">Go to login</NuxtLink>
  </div>

  <div v-else class="relative mx-auto flex min-h-svh w-full max-w-sm flex-col justify-center gap-6 px-6 py-10">
    <ThemeToggle class="absolute top-6 right-6" />
    <div>
      <h1 class="text-2xl font-semibold tracking-tight">Create your Vouch account</h1>
      <p class="mt-1 text-sm text-muted-foreground">We'll set up your first 9 questions automatically.</p>
    </div>

    <form class="flex flex-col gap-4" @submit="onSubmit">
      <div class="space-y-1.5">
        <Label for="businessName">Business name</Label>
        <Input id="businessName" v-model="businessName" v-bind="businessNameAttrs" autofocus />
        <p v-if="errors.businessName" class="text-sm text-destructive">{{ errors.businessName }}</p>
      </div>

      <div class="space-y-1.5">
        <Label for="email">Email</Label>
        <Input id="email" v-model="email" v-bind="emailAttrs" type="email" />
        <p v-if="errors.email" class="text-sm text-destructive">{{ errors.email }}</p>
      </div>

      <div class="space-y-1.5">
        <Label for="password">Password</Label>
        <Input id="password" v-model="password" v-bind="passwordAttrs" type="password" />
        <p v-if="errors.password" class="text-sm text-destructive">{{ errors.password }}</p>
      </div>

      <p v-if="formError" class="text-sm text-destructive">{{ formError }}</p>

      <Button type="submit" class="mt-2 h-11" :disabled="submitting">
        {{ submitting ? 'Creating account...' : 'Create account' }}
      </Button>
    </form>

    <p class="text-center text-sm text-muted-foreground">
      Already have an account?
      <NuxtLink to="/login" class="font-medium text-foreground underline underline-offset-4">Log in</NuxtLink>
    </p>
  </div>
</template>
