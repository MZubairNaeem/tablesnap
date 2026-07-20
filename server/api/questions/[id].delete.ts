export default defineEventHandler(async (event) => {
  const { supabase, businessId } = await requireBusiness(event)
  const questionId = getRouterParam(event, 'id')

  const { error } = await supabase
    .from('questions')
    .delete()
    .eq('id', questionId)
    .eq('business_id', businessId)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { ok: true }
})
