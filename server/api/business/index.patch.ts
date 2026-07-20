import { z } from 'zod'

// Unlike the old updateBusiness(businessId, input) action, businessId is not
// accepted from the client -- it's derived server-side from the session via
// requireBusiness(). A small tightening: the old action trusted whatever id
// the client sent, relying solely on RLS.
const bodySchema = z.object({
  name: z.string().min(1),
  brand_color: z.string().min(1),
  reward_text: z.string().nullable().optional(),
  reward_code: z.string().nullable().optional(),
  reward_terms: z.string().nullable().optional(),
  logo_url: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const { supabase, businessId } = await requireBusiness(event)
  const input = await readValidatedBody(event, bodySchema.parse)

  const { data, error } = await supabase
    .from('businesses')
    .update(input)
    .eq('id', businessId)
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return data
})
