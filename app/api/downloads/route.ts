import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { rateLimit, getClientIp, getSecureHeaders } from '@/lib/security'

/**
 * POST /api/downloads - Generate signed download URL
 */
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const rateLimitResult = rateLimit(ip, 20, 60000) // Stricter for downloads
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many download requests' },
        { status: 429, headers: getSecureHeaders() }
      )
    }

    const body = await request.json()
    const { gallery_id, media_id, client_identifier, download_type = 'web' } = body

    if (!gallery_id || !client_identifier) {
      return NextResponse.json(
        { error: 'gallery_id and client_identifier are required' },
        { status: 400, headers: getSecureHeaders() }
      )
    }

    const supabase = createServerClient()

    // Verify gallery allows downloads
    const { data: gallery, error: galleryError } = await supabase
      .from('galleries')
      .select('allow_downloads, status, is_public')
      .eq('id', gallery_id)
      .single()

    if (galleryError || !gallery) {
      return NextResponse.json(
        { error: 'Gallery not found' },
        { status: 404, headers: getSecureHeaders() }
      )
    }

    if (!gallery.allow_downloads) {
      return NextResponse.json(
        { error: 'Downloads are not enabled for this gallery' },
        { status: 403, headers: getSecureHeaders() }
      )
    }

    if (gallery.status !== 'published') {
      return NextResponse.json(
        { error: 'Gallery is not published' },
        { status: 403, headers: getSecureHeaders() }
      )
    }

    // Log download
    await supabase.from('downloads').insert({
      gallery_id,
      media_id: media_id || null,
      client_identifier,
      download_type,
    })

    if (media_id) {
      // Single file download
      const { data: media, error: mediaError } = await supabase
        .from('media')
        .select('file_url')
        .eq('id', media_id)
        .eq('gallery_id', gallery_id)
        .single()

      if (mediaError || !media) {
        return NextResponse.json(
          { error: 'Media not found' },
          { status: 404, headers: getSecureHeaders() }
        )
      }

      // Extract file path from URL
      const url = new URL(media.file_url)
      const filePath = url.pathname.split('/storage/v1/object/public/galleries/')[1]

      if (!filePath) {
        return NextResponse.json(
          { error: 'Invalid file URL' },
          { status: 500, headers: getSecureHeaders() }
        )
      }

      // Generate signed URL (valid for 1 hour)
      const { data: signedData, error: signError } = await supabase.storage
        .from('galleries')
        .createSignedUrl(filePath, 3600)

      if (signError || !signedData) {
        console.error('Signed URL error:', signError)
        return NextResponse.json(
          { error: 'Failed to generate download URL' },
          { status: 500, headers: getSecureHeaders() }
        )
      }

      return NextResponse.json(
        { 
          download_url: signedData.signedUrl,
          expires_in: 3600 
        },
        { status: 200, headers: getSecureHeaders() }
      )
    } else {
      // ZIP download - would need implementation
      // For now, return error
      return NextResponse.json(
        { error: 'ZIP download not yet implemented. Please download files individually.' },
        { status: 501, headers: getSecureHeaders() }
      )
    }
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: getSecureHeaders() }
    )
  }
}
