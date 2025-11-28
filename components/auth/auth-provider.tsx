'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { getSupabaseClient, Profile } from '@/lib/supabase'

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
    const supabase = getSupabaseClient()
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

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
    const supabase = getSupabaseClient()
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    router.push('/')
    router.refresh()
  }

  useEffect(() => {
    const supabase = getSupabaseClient()
    console.log('AuthProvider mounted')
    
    // Récupérer la session initiale
    supabase.auth.getSession().then(async ({ data: { session } }: { data: { session: any } }) => {
      console.log('getSession result:', session?.user?.email || 'no session')
      if (session?.user) {
        setUser(session.user)
        console.log('Fetching profile for:', session.user.id)
        const profileData = await fetchProfile(session.user.id)
        console.log('Profile fetched:', profileData)
        setProfile(profileData)
      }
      console.log('Setting loading to false')
      setLoading(false)
    })

    // Écouter les changements
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: any) => {
        console.log('Auth event:', event, session?.user?.email)
        
        if (session?.user) {
          setUser(session.user)
          console.log('Fetching profile for:', session.user.id)
          const profileData = await fetchProfile(session.user.id)
          console.log('Profile fetched:', profileData)
          setProfile(profileData)
        } else {
          setUser(null)
          setProfile(null)
        }
        console.log('Setting loading to false after event')
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