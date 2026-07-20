// Hand-written to match app/lib/supabase/types.ts and supabase/schema.sql --
// this project has never generated types from the live schema (same as the
// old Next app). @nuxtjs/supabase picks this file up automatically and
// types useSupabaseClient<Database>() / serverSupabaseClient<Database>()
// with it, which is what gives .from('table').insert/update/select their
// real shapes instead of `never`.
//
// Two non-obvious requirements from postgrest-js's GenericTable/GenericSchema
// constraints, both load-bearing:
//   - `Relationships: []` on every table -- omitting it collapses the whole
//     Row/Insert/Update inference to `never`.
//   - `Database` must be a `type`, not an `interface`. Interfaces don't get
//     an implicit string index signature, so `Row`/`Insert`/`Update` fail
//     the `extends Record<string, unknown>` check GenericTable requires and
//     `.insert()` degrades to accepting only `never[]`. Plain object type
//     literals (via `type`) do get that implicit index signature.

export type Database = {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string
          owner_id: string
          name: string
          slug: string
          logo_url: string | null
          brand_color: string
          reward_text: string | null
          reward_code: string | null
          reward_terms: string | null
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['businesses']['Row']>
        Update: Partial<Database['public']['Tables']['businesses']['Row']>
        Relationships: []
      }
      questions: {
        Row: {
          id: string
          business_id: string
          text: string
          is_active: boolean
          sort_order: number
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['questions']['Row']> & {
          business_id: string
          text: string
        }
        Update: Partial<Database['public']['Tables']['questions']['Row']>
        Relationships: []
      }
      responses: {
        Row: {
          id: string
          business_id: string
          customer_name: string | null
          customer_email: string | null
          customer_phone: string | null
          consent: boolean
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['responses']['Row']> & {
          id: string
          business_id: string
        }
        Update: Partial<Database['public']['Tables']['responses']['Row']>
        Relationships: []
      }
      answers: {
        Row: {
          id: string
          response_id: string
          question_id: string
          video_url: string | null
          text_answer: string | null
          skipped: boolean
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['answers']['Row']> & {
          id: string
          response_id: string
          question_id: string
        }
        Update: Partial<Database['public']['Tables']['answers']['Row']>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}
