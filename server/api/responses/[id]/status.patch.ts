import { z } from 'zod'

const bodySchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected']),
})

export default defineEventHandler(async (event) => {
  const { supabase, businessId } = await requireBusiness(event)
  const responseId = getRouterParam(event, 'id')
  const { status } = await readValidatedBody(event, bodySchema.parse)

  const { error } = await supabase
    .from('responses')
    .update({ status })
    .eq('id', responseId)
    .eq('business_id', businessId) // scoped on top of RLS

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { ok: true }
})
