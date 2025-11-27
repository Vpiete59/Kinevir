'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Profile = {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  role: 'patient' | 'practitioner' | 'admin'
  created_at: string
  updated_at: string
}

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    console.log('Fetching profile for:', userId)
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      console.log('Profile result:', { data, error })

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
      const profileData = await fetchProfile(user.id)
      setProfile(profileData)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    router.push('/')
    router.refresh()
  }

  useEffect(() => {
    const init = async () => {
      console.log('Getting session...')
      
      try {
        const { data: { session } } = await supabase.auth.getSession()
        console.log('Session:', session?.user?.email || 'none')
        
        if (session?.user) {
          setUser(session.user)
          const profileData = await fetchProfile(session.user.id)
          setProfile(profileData)
        }
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setLoading(false)
      }
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event)
        
        if (session?.user) {
          setUser(session.user)
          const profileData = await fetchProfile(session.user.id)
          setProfile(profileData)
        } else {
          setUser(null)
          setProfile(null)
        }
        
        setLoading(false)
        router.refresh()
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