import { NextResponse } from 'next/server'
import { createServer } from '@/lib/supabase-server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/', url.origin))
  }

  const supabase = createServer()
  await supabase.auth.exchangeCodeForSession(code)

  return NextResponse.redirect(new URL('/', url.origin))
}
