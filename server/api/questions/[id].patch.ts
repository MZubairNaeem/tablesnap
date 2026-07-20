import { z } from 'zod'

// Collapses updateQuestionText + toggleQuestionActive from the old actions
// file into one handler -- both were the same UPDATE against the same row.
const bodySchema = z.object({
  text: z.string().min(1).optional(),
  is_active: z.boolean().optional(),
})

export default defineEventHandler(async (event) => {
  const { supabase, businessId } = await requireBusiness(event)
  const questionId = getRouterParam(event, 'id')
  const body = await readValidatedBody(event, bodySchema.parse)

  const { error } = await supabase
    .from('questions')
    .update(body)
    .eq('id', questionId)
    .eq('business_id', businessId)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { ok: true }
})
