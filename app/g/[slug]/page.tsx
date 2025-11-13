'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, Download, ShoppingCart, Lock, Camera } from 'lucide-react'
import { getClientIdentifier } from '@/lib/utils'

export default function GalleryViewPage() {
  const params = useParams()
  const slug = params.slug as string
  const [gallery, setGallery] = useState<any>(null)
  const [media, setMedia] = useState<any[]>([])
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [passwordRequired, setPasswordRequired] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    loadGallery()
  }, [slug])

  const loadGallery = async () => {
    const supabase = createClient()
    
    // Fetch gallery
    const { data: galleryData, error: galleryError } = await supabase
      .from('galleries')
      .select('*')
      .eq('slug', slug)
      .single()

    if (galleryError || !galleryData) {
      setError('Gallery not found')
      setLoading(false)
      return
    }

    // Check if published
    if (galleryData.status !== 'published') {
      setError('This gallery is not available')
      setLoading(false)
      return
    }

    // Check expiration
    if (galleryData.expires_at && new Date(galleryData.expires_at) < new Date()) {
      setError('This gallery has expired')
      setLoading(false)
      return
    }

    // Check password protection
    if (!galleryData.is_public && galleryData.password_hash) {
      const hasAccess = sessionStorage.getItem(`gallery_access_${galleryData.id}`)
      if (!hasAccess) {
        setPasswordRequired(true)
        setGallery(galleryData)
        setLoading(false)
        return
      }
    }

    setGallery(galleryData)

    // Fetch media
    const { data: mediaData } = await supabase
      .from('media')
      .select('*')
      .eq('gallery_id', galleryData.id)
      .order('sort_order', { ascending: true })

    setMedia(mediaData || [])

    // Load favorites
    const clientId = getClientIdentifier()
    const { data: favData } = await supabase
      .from('favorites')
      .select('media_id')
      .eq('gallery_id', galleryData.id)
      .eq('client_identifier', clientId)

    if (favData) {
      setFavorites(new Set(favData.map(f => f.media_id)))
    }

    setLoading(false)
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // In production, verify password with backend
    // For now, just grant access
    sessionStorage.setItem(`gallery_access_${gallery.id}`, 'true')
    setPasswordRequired(false)
    loadGallery()
  }

  const toggleFavorite = async (mediaId: string) => {
    const supabase = createClient()
    const clientId = getClientIdentifier()

    if (favorites.has(mediaId)) {
      // Remove favorite
      await supabase
        .from('favorites')
        .delete()
        .eq('gallery_id', gallery.id)
        .eq('media_id', mediaId)
        .eq('client_identifier', clientId)
      
      setFavorites(prev => {
        const next = new Set(prev)
        next.delete(mediaId)
        return next
      })
    } else {
      // Add favorite
      await supabase
        .from('favorites')
        .insert({
          gallery_id: gallery.id,
          media_id: mediaId,
          client_identifier: clientId,
        })
      
      setFavorites(prev => new Set(prev).add(mediaId))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Camera className="h-12 w-12 text-slate-400 mx-auto mb-4 animate-pulse" />
          <p className="text-slate-600">Loading gallery...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <Lock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">{error}</h2>
            <p className="text-slate-600 mb-4">
              This gallery may have been removed or is no longer available.
            </p>
            <Button onClick={() => window.location.href = '/'}>
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (passwordRequired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <Lock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-center mb-2">Password Protected</h2>
            <p className="text-slate-600 text-center mb-6">
              This gallery requires a password to view.
            </p>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" className="w-full">
                Access Gallery
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{gallery.title}</h1>
              <p className="text-sm text-slate-600">{gallery.description}</p>
            </div>
            <div className="flex items-center gap-2">
              {gallery.allow_downloads && (
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download All
                </Button>
              )}
              {gallery.allow_orders && (
                <Button variant="outline" className="gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Cart (0)
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 py-8">
        {media.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Camera className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No media in this gallery yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {media.map((item) => (
              <div key={item.id} className="relative group">
                <div className="aspect-square bg-slate-200 rounded-lg overflow-hidden">
                  <img
                    src={item.preview_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  {gallery.allow_favorites && (
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => toggleFavorite(item.id)}
                      className={favorites.has(item.id) ? 'text-red-600' : ''}
                    >
                      <Heart className={`h-5 w-5 ${favorites.has(item.id) ? 'fill-current' : ''}`} />
                    </Button>
                  )}
                  {gallery.allow_downloads && (
                    <Button size="icon" variant="secondary">
                      <Download className="h-5 w-5" />
                    </Button>
                  )}
                  {gallery.allow_orders && (
                    <Button size="icon" variant="secondary">
                      <ShoppingCart className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Favorites Bar */}
      {favorites.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-600 fill-current" />
              <span className="font-medium">{favorites.size} favorites selected</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">View Favorites</Button>
              {gallery.allow_downloads && (
                <Button>Download Favorites</Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
