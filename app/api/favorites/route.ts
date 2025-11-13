import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { rateLimit, getClientIp, getSecureHeaders } from '@/lib/security'

/**
 * POST /api/favorites - Toggle favorite
 */
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const rateLimitResult = rateLimit(ip, 100, 60000)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: getSecureHeaders() }
      )
    }

    const body = await request.json()
    const { gallery_id, media_id, client_identifier } = body

    if (!gallery_id || !media_id || !client_identifier) {
      return NextResponse.json(
        { error: 'gallery_id, media_id, and client_identifier are required' },
        { status: 400, headers: getSecureHeaders() }
      )
    }

    const supabase = createServerClient()

    // Check if favorite exists
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('gallery_id', gallery_id)
      .eq('media_id', media_id)
      .eq('client_identifier', client_identifier)
      .single()

    if (existing) {
      // Remove favorite
      const { error: deleteError } = await supabase
        .from('favorites')
        .delete()
        .eq('id', existing.id)

      if (deleteError) {
        console.error('Delete favorite error:', deleteError)
        return NextResponse.json(
          { error: 'Failed to remove favorite' },
          { status: 500, headers: getSecureHeaders() }
        )
      }

      return NextResponse.json(
        { success: true, action: 'removed' },
        { status: 200, headers: getSecureHeaders() }
      )
    } else {
      // Add favorite
      const { error: insertError } = await supabase
        .from('favorites')
        .insert({
          gallery_id,
          media_id,
          client_identifier,
        })

      if (insertError) {
        console.error('Insert favorite error:', insertError)
        return NextResponse.json(
          { error: 'Failed to add favorite' },
          { status: 500, headers: getSecureHeaders() }
        )
      }

      return NextResponse.json(
        { success: true, action: 'added' },
        { status: 201, headers: getSecureHeaders() }
      )
    }
  } catch (error) {
    console.error('Favorites error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: getSecureHeaders() }
    )
  }
}

/**
 * GET /api/favorites?gallery_id=xxx&client_identifier=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const rateLimitResult = rateLimit(ip, 100, 60000)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: getSecureHeaders() }
      )
    }

    const { searchParams } = new URL(request.url)
    const gallery_id = searchParams.get('gallery_id')
    const client_identifier = searchParams.get('client_identifier')

    if (!gallery_id || !client_identifier) {
      return NextResponse.json(
        { error: 'gallery_id and client_identifier are required' },
        { status: 400, headers: getSecureHeaders() }
      )
    }

    const supabase = createServerClient()

    const { data: favorites, error } = await supabase
      .from('favorites')
      .select('media_id')
      .eq('gallery_id', gallery_id)
      .eq('client_identifier', client_identifier)

    if (error) {
      console.error('Fetch favorites error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch favorites' },
        { status: 500, headers: getSecureHeaders() }
      )
    }

    return NextResponse.json(
      { favorites: favorites.map(f => f.media_id) },
      { status: 200, headers: getSecureHeaders() }
    )
  } catch (error) {
    console.error('Favorites fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: getSecureHeaders() }
    )
  }
}
