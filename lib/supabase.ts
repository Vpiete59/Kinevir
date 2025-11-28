import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
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
