import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Singleton pattern pour éviter les instances multiples
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseClient() {
  if (typeof window === 'undefined') {
    // Server-side: créer une nouvelle instance à chaque fois
    return createBrowserClient(supabaseUrl, supabaseAnonKey)
  }
  
  // Client-side: réutiliser la même instance
  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseInstance
}

// Export pour compatibilité avec l'ancien code
export const supabase = typeof window !== 'undefined' 
  ? getSupabaseClient() 
  : createBrowserClient(supabaseUrl, supabaseAnonKey)

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