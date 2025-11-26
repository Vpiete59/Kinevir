'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter, useSearchParams } from 'next/navigation'

export function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()
  const [processed, setProcessed] = useState(false)

  useEffect(() => {
    const code = searchParams.get('code')
    
    if (code && !processed) {
      setProcessed(true)
      console.log('Code OAuth détecté:', code)
      
      // Essayer d'échanger le code
      supabase.auth.exchangeCodeForSession(code)
        .then(({ data, error }) => {
          if (error) {
            console.error('Erreur exchangeCodeForSession:', error)
          } else {
            console.log('Session créée:', data)
          }
          // Nettoyer l'URL
          window.history.replaceState({}, '', '/')
          router.refresh()
        })
        .catch((err) => {
          console.error('Exception:', err)
        })
    }
  }, [searchParams, supabase, router, processed])

  return null
}