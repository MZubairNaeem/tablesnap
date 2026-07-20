import { z } from 'zod'

const bodySchema = z.object({
  orderedIds: z.array(z.string()),
})

export default defineEventHandler(async (event) => {
  const { supabase, businessId } = await requireBusiness(event)
  const { orderedIds } = await readValidatedBody(event, bodySchema.parse)

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from('questions').update({ sort_order: index }).eq('id', id).eq('business_id', businessId),
    ),
  )

  return { ok: true }
})
