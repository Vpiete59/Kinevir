import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Singleton pattern pour éviter les instances multiples
let supabaseInstance: ReturnType<typeof createClientComponentClient> | null = null

export function getSupabaseClient() {
  if (typeof window === 'undefined') {
    // Server-side: retourner null ou un client basique
    // Les composants serveur utiliseront createServerComponentClient
    return createClientComponentClient()
  }
  
  // Client-side: réutiliser la même instance
  if (!supabaseInstance) {
    supabaseInstance = createClientComponentClient()
  }
  return supabaseInstance
}

// Export pour compatibilité avec l'ancien code
export const supabase = typeof window !== 'undefined' 
  ? getSupabaseClient() 
  : createClientComponentClient()

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