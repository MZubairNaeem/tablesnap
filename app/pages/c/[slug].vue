<script setup lang="ts">
import type { Business, Question } from '@/lib/supabase/types'

const route = useRoute()
const slug = route.params.slug as string
const supabase = useSupabaseClient()

const { data: business } = await supabase
  .from('businesses')
  .select('*')
  .eq('slug', slug)
  .single<Business>()

if (!business) {
  throw createError({ statusCode: 404, statusMessage: 'Business not found', fatal: true })
}

const { data: questionsData } = await supabase
  .from('questions')
  .select('*')
  .eq('business_id', business.id)
  .eq('is_active', true)
  .order('sort_order', { ascending: true })
  .returns<Question[]>()

const questions = questionsData ?? []
</script>

<template>
  <CollectionFlow :business="business" :questions="questions" />
</template>
