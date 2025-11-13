import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { requireOwner, rateLimit, getClientIp, sanitizeInput, getSecureHeaders } from '@/lib/security'
import { generateSlug } from '@/lib/utils'

/**
 * GET /api/galleries - List all galleries for authenticated owner
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(request)
    const rateLimitResult = rateLimit(ip, 100, 60000)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { 
          status: 429,
          headers: getSecureHeaders()
        }
      )
    }

    // Require authentication
    const { user, error } = await requireOwner(request)
    
    if (error || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { 
          status: 401,
          headers: getSecureHeaders()
        }
      )
    }

    const supabase = createServerClient()
    
    const { data: galleries, error: dbError } = await supabase
      .from('galleries')
      .select(`
        *,
        media(count)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to fetch galleries' },
        { 
          status: 500,
          headers: getSecureHeaders()
        }
      )
    }

    return NextResponse.json(
      { galleries },
      { 
        status: 200,
        headers: getSecureHeaders()
      }
    )
  } catch (error) {
    console.error('Gallery list error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: getSecureHeaders()
      }
    )
  }
}

/**
 * POST /api/galleries - Create new gallery
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(request)
    const rateLimitResult = rateLimit(ip, 20, 60000) // Lower limit for creates
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { 
          status: 429,
          headers: getSecureHeaders()
        }
      )
    }

    // Require owner authentication
    const { user, error: authError } = await requireOwner(request)
    
    if (authError || !user) {
      return NextResponse.json(
        { error: authError || 'Unauthorized' },
        { 
          status: 401,
          headers: getSecureHeaders()
        }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const { title, description, service_type, is_public, password, expires_at } = body

    // Validate required fields
    if (!title || !service_type) {
      return NextResponse.json(
        { error: 'Title and service type are required' },
        { 
          status: 400,
          headers: getSecureHeaders()
        }
      )
    }

    // Validate service type
    if (!['video', 'photo'].includes(service_type)) {
      return NextResponse.json(
        { error: 'Invalid service type' },
        { 
          status: 400,
          headers: getSecureHeaders()
        }
      )
    }

    // Sanitize inputs
    const sanitizedTitle = sanitizeInput(title)
    const sanitizedDescription = description ? sanitizeInput(description) : null

    // Generate unique slug
    let slug = generateSlug(sanitizedTitle)
    const supabase = createServerClient()
    
    // Check if slug exists and make it unique
    const { data: existing } = await supabase
      .from('galleries')
      .select('slug')
      .eq('slug', slug)
      .single()

    if (existing) {
      slug = `${slug}-${Date.now()}`
    }

    // Hash password if provided
    let passwordHash = null
    if (password && !is_public) {
      const bcrypt = require('bcryptjs')
      const salt = await bcrypt.genSalt(10)
      passwordHash = await bcrypt.hash(password, salt)
    }

    // Create gallery
    const { data: gallery, error: dbError } = await supabase
      .from('galleries')
      .insert({
        user_id: user.id,
        title: sanitizedTitle,
        slug,
        description: sanitizedDescription,
        service_type,
        status: 'draft',
        is_public: is_public !== false, // Default to true
        password_hash: passwordHash,
        expires_at: expires_at || null,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to create gallery' },
        { 
          status: 500,
          headers: getSecureHeaders()
        }
      )
    }

    return NextResponse.json(
      { gallery },
      { 
        status: 201,
        headers: getSecureHeaders()
      }
    )
  } catch (error) {
    console.error('Gallery creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: getSecureHeaders()
      }
    )
  }
}
