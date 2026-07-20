import { defineStore } from 'pinia'
import type { Business } from '@/lib/supabase/types'

/**
 * Fixes an N+1 that existed in the Next version: `/dashboard`, `/customers`,
 * `/testimonials`, and `/written` each re-fetched the current business after
 * `app/dashboard/layout.tsx` already had. Here the layout hydrates this
 * store once and every page just reads it.
 */
export const useBusinessStore = defineStore('business', {
  state: () => ({
    business: null as Business | null,
    loaded: false,
  }),
  getters: {
    businessId: (state) => state.business?.id ?? null,
    initials: (state) => state.business?.name.charAt(0).toUpperCase() ?? '',
  },
  actions: {
    async fetch() {
      const supabase = useSupabaseClient()
      const user = useSupabaseUser()

      if (!user.value) {
        this.business = null
        this.loaded = true
        return
      }

      // useSupabaseUser() holds decoded JWT claims (client.auth.getClaims()),
      // not a Supabase User object -- the id is `.sub`, there is no `.id`.
      // A stale/expired refresh-token cookie on a hard reload makes this
      // throw instead of returning a postgrest error -- treat that the same
      // as "no business" rather than letting it crash SSR rendering.
      try {
        const { data } = await supabase
          .from('businesses')
          .select('*')
          .eq('owner_id', user.value.sub)
          .single<Business>()

        this.business = data
      } catch {
        this.business = null
      }

      this.loaded = true
    },
    /**
     * Unlike the old updateBusiness(businessId, input) server action, no id
     * is sent -- server/api/business/index.patch.ts derives it from the
     * session via requireBusiness().
     */
    async update(input: {
      name: string
      brand_color: string
      reward_text: string | null
      reward_code: string | null
      reward_terms: string | null
      logo_url?: string
    }) {
      const updated = await $fetch<Business>('/api/business', { method: 'PATCH', body: input })
      this.business = updated
      return updated
    },
  },
})
