'use client'

import { useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter, useSearchParams } from 'next/navigation'

export function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const code = searchParams.get('code')
    
    if (code) {
      // Échanger le code contre une session
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          console.error('Error exchanging code:', error)
        }
        // Retirer le code de l'URL et rafraîchir
        router.replace('/')
        router.refresh()
      })
    }
  }, [searchParams, supabase, router])

  return null
}
