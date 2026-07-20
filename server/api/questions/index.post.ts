import { z } from 'zod'

const bodySchema = z.object({
  text: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const { supabase, businessId } = await requireBusiness(event)
  const { text } = await readValidatedBody(event, bodySchema.parse)

  const { count } = await supabase
    .from('questions')
    .select('id', { count: 'exact', head: true })
    .eq('business_id', businessId)

  const { data, error } = await supabase
    .from('questions')
    .insert({ business_id: businessId, text, sort_order: count ?? 0 })
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return data
})
