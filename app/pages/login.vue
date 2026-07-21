<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { loginSchema } from '@/lib/validations/auth'

const supabase = useSupabaseClient()
const submitting = ref(false)
const formError = ref<string | null>(null)

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(loginSchema),
  initialValues: { email: '', password: '' },
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const onSubmit = handleSubmit(async (values) => {
  submitting.value = true
  formError.value = null

  const { data, error } = await supabase.auth.signInWithPassword(values)

  if (error) {
    formError.value = error.message
    submitting.value = false
    return
  }

  // @nuxtjs/supabase's session/user state only updates via the client's
  // onAuthStateChange listener, which fires asynchronously (deferred by
  // supabase-js) -- navigating immediately races it, so the global
  // "global-auth" middleware still sees no session and bounces straight
  // back to /login, leaving this button stuck on "Logging in...". Populate
  // the state synchronously from the sign-in response instead of waiting.
  //
  // getClaims() must be called with the access token in hand: called with no
  // argument it re-reads the session via getSession() internally, which can
  // still race the write we just did above and resolve to no session at all.
  useSupabaseSession().value = data.session
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(data.session.access_token)
  if (claimsError || !claimsData) {
    formError.value = claimsError?.message ?? 'Could not verify session.'
    submitting.value = false
    return
  }
  useSupabaseUser().value = claimsData.claims
  await navigateTo('/dashboard')
})
</script>

<template>
  <div class="relative mx-auto flex min-h-svh w-full max-w-sm flex-col justify-center gap-6 px-6 py-10">
    <ThemeToggle class="absolute top-6 right-6" />
    <div>
      <h1 class="text-2xl font-semibold tracking-tight">Log in to TableSnap</h1>
      <p class="mt-1 text-sm text-muted-foreground">Manage your testimonials and questions.</p>
    </div>

    <form class="flex flex-col gap-4" @submit="onSubmit">
      <div class="space-y-1.5">
        <Label for="email">Email</Label>
        <Input id="email" v-model="email" v-bind="emailAttrs" type="email" autofocus />
        <p v-if="errors.email" class="text-sm text-destructive">{{ errors.email }}</p>
      </div>

      <div class="space-y-1.5">
        <Label for="password">Password</Label>
        <Input id="password" v-model="password" v-bind="passwordAttrs" type="password" />
        <p v-if="errors.password" class="text-sm text-destructive">{{ errors.password }}</p>
      </div>

      <p v-if="formError" class="text-sm text-destructive">{{ formError }}</p>

      <Button type="submit" class="mt-2 h-11" :disabled="submitting">
        {{ submitting ? 'Logging in...' : 'Log in' }}
      </Button>
    </form>

    <p class="text-center text-sm text-muted-foreground">
      Don't have an account?
      <NuxtLink to="/signup" class="font-medium text-foreground underline underline-offset-4">Sign up</NuxtLink>
    </p>
  </div>
</template>
