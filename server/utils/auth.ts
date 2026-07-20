import type { H3Event } from 'h3'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

/**
 * Ported from the local `requireBusinessId()` helper that lived only in
 * app/dashboard/questions/actions.ts -- the one action file in the old app
 * with explicit authz. Every Nitro route below starts with this, where
 * before only the questions actions did (updateResponseStatus and
 * updateBusiness relied on RLS alone). A deliberate tightening, not a
 * behavioral requirement of the migration.
 */
export async function requireBusiness(event: H3Event) {
  // serverSupabaseUser() throws a bare (statusCode-less, defaults to 500)
  // createError on any getClaims() failure -- an expired/rotated refresh
  // token included -- so a stale session surfaces as a clean 401 instead of
  // a 500.
  const user = await serverSupabaseUser(event).catch(() => null)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
  }

  const supabase = await serverSupabaseClient(event)

  // serverSupabaseUser() returns decoded JWT claims (client.auth.getClaims()),
  // not a Supabase User object -- the id is `.sub`, there is no `.id`.
  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', user.sub)
    .single()

  if (!business) {
    throw createError({ statusCode: 403, statusMessage: 'No business found for this account' })
  }

  return { supabase, businessId: business.id as string }
}
