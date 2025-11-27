import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client unique pour tout le navigateur
let browserClient: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseClient() {
  if (!browserClient) {
    browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey)
  }
  return browserClient
}

export type Profile = {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  role: 'patient' | 'practitioner' | 'admin'
  created_at: string
  updated_at: string
}
