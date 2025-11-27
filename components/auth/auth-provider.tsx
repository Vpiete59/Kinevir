'use client'

import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

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
  const supabase = createClientComponentClient()
  const fetchingRef = useRef(false)
  const initializedRef = useRef(false)

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    // Éviter les appels simultanés
    if (fetchingRef.current) {
      console.log('Fetch already in progress, skipping')
      return profile
    }
    
    fetchingRef.current = true
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
    } finally {
      fetchingRef.current = false
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
    if (initializedRef.current) return
    initializedRef.current = true

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
        
        // Ignorer INITIAL_SESSION car on le gère déjà dans init()
        if (event === 'INITIAL_SESSION') return
        
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