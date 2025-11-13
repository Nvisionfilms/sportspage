import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { 
  requireOwner, 
  rateLimit, 
  getClientIp, 
  sanitizeFilename,
  validateFileType,
  validateFileSize,
  getSecureHeaders 
} from '@/lib/security'

const ALLOWED_IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'gif', 'webp']
const ALLOWED_VIDEO_TYPES = ['mp4', 'mov', 'avi', 'webm']
const MAX_FILE_SIZE_MB = 50

/**
 * POST /api/upload - Upload media file to gallery
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting - stricter for uploads
    const ip = getClientIp(request)
    const rateLimitResult = rateLimit(ip, 10, 60000) // 10 uploads per minute
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many upload requests. Please wait before uploading more.' },
        { status: 429, headers: getSecureHeaders() }
      )
    }

    // Require owner authentication
    const { user, error: authError } = await requireOwner(request)
    
    if (authError || !user) {
      return NextResponse.json(
        { error: authError || 'Unauthorized' },
        { status: 401, headers: getSecureHeaders() }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const galleryId = formData.get('gallery_id') as string

    // Validate inputs
    if (!file || !galleryId) {
      return NextResponse.json(
        { error: 'File and gallery_id are required' },
        { status: 400, headers: getSecureHeaders() }
      )
    }

    // Validate file size
    if (!validateFileSize(file.size, MAX_FILE_SIZE_MB)) {
      return NextResponse.json(
        { error: `File size must be less than ${MAX_FILE_SIZE_MB}MB` },
        { status: 400, headers: getSecureHeaders() }
      )
    }

    // Validate file type
    const allAllowedTypes = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES]
    if (!validateFileType(file.name, allAllowedTypes)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPG, PNG, GIF, WebP, MP4, MOV, AVI, WebM' },
        { status: 400, headers: getSecureHeaders() }
      )
    }

    const supabase = createServerClient()

    // Verify gallery ownership
    const { data: gallery, error: galleryError } = await supabase
      .from('galleries')
      .select('user_id, service_type')
      .eq('id', galleryId)
      .single()

    if (galleryError || !gallery || gallery.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Gallery not found or access denied' },
        { status: 404, headers: getSecureHeaders() }
      )
    }

    // Determine media type
    const fileExt = file.name.toLowerCase().split('.').pop() || ''
    const isVideo = ALLOWED_VIDEO_TYPES.includes(fileExt)
    const mediaType = isVideo ? 'video' : 'photo'

    // Validate media type matches gallery service type
    if (gallery.service_type === 'video' && !isVideo) {
      return NextResponse.json(
        { error: 'This gallery only accepts video files' },
        { status: 400, headers: getSecureHeaders() }
      )
    }
    if (gallery.service_type === 'photo' && isVideo) {
      return NextResponse.json(
        { error: 'This gallery only accepts photo files' },
        { status: 400, headers: getSecureHeaders() }
      )
    }

    // Sanitize filename
    const timestamp = Date.now()
    const sanitizedName = sanitizeFilename(file.name)
    const fileName = `${timestamp}-${sanitizedName}`

    // Upload to Supabase Storage
    const filePath = `${galleryId}/${fileName}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('galleries')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500, headers: getSecureHeaders() }
      )
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('galleries')
      .getPublicUrl(filePath)

    // For production, you would generate thumbnails here
    // For now, use the same URL for all sizes
    const previewUrl = publicUrl
    const thumbnailUrl = publicUrl

    // Get image dimensions (if image)
    let width = null
    let height = null
    let aspectRatio = null

    if (!isVideo && typeof Image !== 'undefined') {
      // In a real implementation, you'd use sharp or similar to get dimensions
      // For now, we'll skip this
    }

    // Create media record
    const { data: media, error: mediaError } = await supabase
      .from('media')
      .insert({
        gallery_id: galleryId,
        file_url: publicUrl,
        preview_url: previewUrl,
        thumbnail_url: thumbnailUrl,
        media_type: mediaType,
        width,
        height,
        aspect_ratio: aspectRatio,
        file_size: file.size,
        metadata: {
          original_name: file.name,
          content_type: file.type,
          uploaded_at: new Date().toISOString(),
        },
      })
      .select()
      .single()

    if (mediaError) {
      console.error('Media record error:', mediaError)
      // Try to clean up uploaded file
      await supabase.storage.from('galleries').remove([filePath])
      
      return NextResponse.json(
        { error: 'Failed to create media record' },
        { status: 500, headers: getSecureHeaders() }
      )
    }

    return NextResponse.json(
      { 
        success: true,
        media,
        message: 'File uploaded successfully'
      },
      { status: 201, headers: getSecureHeaders() }
    )
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: getSecureHeaders() }
    )
  }
}

/**
 * GET /api/upload - Not allowed
 */
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405, headers: getSecureHeaders() }
  )
}
