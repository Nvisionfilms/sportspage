import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { requireOwner, rateLimit, getClientIp, sanitizeInput, getSecureHeaders } from '@/lib/security'

/**
 * GET /api/galleries/[id] - Get single gallery
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ip = getClientIp(request)
    const rateLimitResult = rateLimit(ip, 100, 60000)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: getSecureHeaders() }
      )
    }

    const supabase = createServerClient()
    const { data: gallery, error } = await supabase
      .from('galleries')
      .select(`
        *,
        media(*)
      `)
      .eq('id', params.id)
      .single()

    if (error || !gallery) {
      return NextResponse.json(
        { error: 'Gallery not found' },
        { status: 404, headers: getSecureHeaders() }
      )
    }

    return NextResponse.json(
      { gallery },
      { status: 200, headers: getSecureHeaders() }
    )
  } catch (error) {
    console.error('Gallery fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: getSecureHeaders() }
    )
  }
}

/**
 * PATCH /api/galleries/[id] - Update gallery
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ip = getClientIp(request)
    const rateLimitResult = rateLimit(ip, 50, 60000)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: getSecureHeaders() }
      )
    }

    const { user, error: authError } = await requireOwner(request)
    
    if (authError || !user) {
      return NextResponse.json(
        { error: authError || 'Unauthorized' },
        { status: 401, headers: getSecureHeaders() }
      )
    }

    const supabase = createServerClient()
    
    // Verify ownership
    const { data: gallery } = await supabase
      .from('galleries')
      .select('user_id')
      .eq('id', params.id)
      .single()

    if (!gallery || gallery.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Gallery not found or access denied' },
        { status: 404, headers: getSecureHeaders() }
      )
    }

    const body = await request.json()
    const { 
      title, 
      description, 
      status, 
      is_public, 
      password,
      allow_downloads,
      allow_favorites,
      allow_orders,
      expires_at 
    } = body

    // Build update object
    const updates: any = {}
    
    if (title) updates.title = sanitizeInput(title)
    if (description !== undefined) updates.description = description ? sanitizeInput(description) : null
    if (status) updates.status = status
    if (is_public !== undefined) updates.is_public = is_public
    if (allow_downloads !== undefined) updates.allow_downloads = allow_downloads
    if (allow_favorites !== undefined) updates.allow_favorites = allow_favorites
    if (allow_orders !== undefined) updates.allow_orders = allow_orders
    if (expires_at !== undefined) updates.expires_at = expires_at

    // Handle password
    if (password && !is_public) {
      const bcrypt = require('bcryptjs')
      const salt = await bcrypt.genSalt(10)
      updates.password_hash = await bcrypt.hash(password, salt)
    } else if (is_public) {
      updates.password_hash = null
    }

    const { data: updatedGallery, error: updateError } = await supabase
      .from('galleries')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single()

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update gallery' },
        { status: 500, headers: getSecureHeaders() }
      )
    }

    return NextResponse.json(
      { gallery: updatedGallery },
      { status: 200, headers: getSecureHeaders() }
    )
  } catch (error) {
    console.error('Gallery update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: getSecureHeaders() }
    )
  }
}

/**
 * DELETE /api/galleries/[id] - Delete gallery
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ip = getClientIp(request)
    const rateLimitResult = rateLimit(ip, 20, 60000)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: getSecureHeaders() }
      )
    }

    const { user, error: authError } = await requireOwner(request)
    
    if (authError || !user) {
      return NextResponse.json(
        { error: authError || 'Unauthorized' },
        { status: 401, headers: getSecureHeaders() }
      )
    }

    const supabase = createServerClient()
    
    // Verify ownership
    const { data: gallery } = await supabase
      .from('galleries')
      .select('user_id')
      .eq('id', params.id)
      .single()

    if (!gallery || gallery.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Gallery not found or access denied' },
        { status: 404, headers: getSecureHeaders() }
      )
    }

    // Delete gallery (cascade will handle media, favorites, etc.)
    const { error: deleteError } = await supabase
      .from('galleries')
      .delete()
      .eq('id', params.id)

    if (deleteError) {
      console.error('Delete error:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete gallery' },
        { status: 500, headers: getSecureHeaders() }
      )
    }

    return NextResponse.json(
      { success: true },
      { status: 200, headers: getSecureHeaders() }
    )
  } catch (error) {
    console.error('Gallery deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: getSecureHeaders() }
    )
  }
}
