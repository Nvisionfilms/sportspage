import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getSecureHeaders } from '@/lib/security'

export async function POST() {
  try {
    const supabase = createServerClient()
    await supabase.auth.signOut()

    return NextResponse.json(
      { success: true },
      { 
        status: 200,
        headers: getSecureHeaders()
      }
    )
  } catch (error) {
    console.error('Sign out error:', error)
    return NextResponse.json(
      { error: 'Failed to sign out' },
      { 
        status: 500,
        headers: getSecureHeaders()
      }
    )
  }
}
