'use client'

import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { User, SupabaseClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { Profile } from '@/lib/supabase'

type AuthContextType = {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
})

// Singleton pour le client
let supabaseClient: SupabaseClient | null = null

function getClient() {
  if (!supabaseClient) {
    supabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return supabaseClient
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const initialized = useRef(false)

  const fetchProfile = async (userId: string, client: SupabaseClient): Promise<Profile | null> => {
    console.log('fetchProfile called for:', userId)
    try {
      const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      console.log('fetchProfile result:', { data, error })
      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }
      return data as Profile
    } catch (error) {
      console.error('Exception fetching profile:', error)
      return null
    }
  }

  const refreshProfile = async () => {
    if (user) {
      const client = getClient()
      const profileData = await fetchProfile(user.id, client)
      setProfile(profileData)
    }
  }

  const signOut = async () => {
    const client = getClient()
    await client.auth.signOut()
    setUser(null)
    setProfile(null)
    router.push('/')
    router.refresh()
  }

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    
    console.log('AuthProvider useEffect running')
    const client = getClient()
    
    const initAuth = async () => {
      try {
        console.log('Getting session...')
        const { data, error } = await client.auth.getSession()
        console.log('Session result:', data?.session?.user?.email || 'no session', error)
        
        if (data?.session?.user) {
          setUser(data.session.user)
          const profileData = await fetchProfile(data.session.user.id, client)
          setProfile(profileData)
        }
      } catch (err) {
        console.error('Error in initAuth:', err)
      } finally {
        console.log('Setting loading to false')
        setLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = client.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session?.user?.email)
        
        if (session?.user) {
          setUser(session.user)
          const profileData = await fetchProfile(session.user.id, client)
          setProfile(profileData)
        } else {
          setUser(null)
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}