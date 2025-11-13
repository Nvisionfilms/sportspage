'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UploadZone } from '@/components/gallery/upload-zone'
import { ArrowLeft, Settings, ExternalLink, Trash2, Eye } from 'lucide-react'

export default function GalleryEditPage() {
  const params = useParams()
  const router = useRouter()
  const galleryId = params.id as string

  const [gallery, setGallery] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    loadGallery()
  }, [galleryId])

  const loadGallery = async () => {
    try {
      const response = await fetch(`/api/galleries/${galleryId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load gallery')
      }

      setGallery(data.gallery)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async () => {
    if (!gallery.media || gallery.media.length === 0) {
      alert('Please upload at least one file before publishing')
      return
    }

    setPublishing(true)
    try {
      const response = await fetch(`/api/galleries/${galleryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'published' }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to publish gallery')
      }

      setGallery(data.gallery)
      alert('Gallery published successfully!')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setPublishing(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this gallery? This cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/galleries/${galleryId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete gallery')
      }

      router.push('/dashboard')
    } catch (err: any) {
      alert(err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading gallery...</p>
      </div>
    )
  }

  if (error || !gallery) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 mb-4">{error || 'Gallery not found'}</p>
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const mediaCount = gallery.media?.length || 0
  const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL}/g/${gallery.slug}`

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-slate-600 hover:text-slate-900">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold">{gallery.title}</h1>
                <p className="text-sm text-slate-600">{mediaCount} items</p>
              </div>
              <Badge variant={gallery.status === 'published' ? 'success' : 'secondary'}>
                {gallery.status}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              {gallery.status === 'published' && (
                <Link href={publicUrl} target="_blank">
                  <Button variant="outline" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    View Live
                  </Button>
                </Link>
              )}
              
              {gallery.status === 'draft' && (
                <Button
                  onClick={handlePublish}
                  disabled={publishing || mediaCount === 0}
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  {publishing ? 'Publishing...' : 'Publish'}
                </Button>
              )}

              <Link href={`/dashboard/galleries/${galleryId}/settings`}>
                <Button variant="outline" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </Link>

              <Button
                variant="destructive"
                onClick={handleDelete}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Media</CardTitle>
              </CardHeader>
              <CardContent>
                <UploadZone
                  galleryId={galleryId}
                  onUploadComplete={loadGallery}
                />
              </CardContent>
            </Card>

            {/* Media Grid */}
            {mediaCount > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Uploaded Media ({mediaCount})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {gallery.media.map((item: any) => (
                      <div key={item.id} className="aspect-square bg-slate-200 rounded-lg overflow-hidden">
                        <img
                          src={item.thumbnail_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Gallery Info */}
            <Card>
              <CardHeader>
                <CardTitle>Gallery Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-600">Service Type</p>
                  <p className="font-medium capitalize">{gallery.service_type}</p>
                </div>
                <div>
                  <p className="text-slate-600">Status</p>
                  <p className="font-medium capitalize">{gallery.status}</p>
                </div>
                <div>
                  <p className="text-slate-600">Visibility</p>
                  <p className="font-medium">{gallery.is_public ? 'Public' : 'Private'}</p>
                </div>
                <div>
                  <p className="text-slate-600">Created</p>
                  <p className="font-medium">
                    {new Date(gallery.created_at).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Share Link */}
            {gallery.status === 'published' && (
              <Card>
                <CardHeader>
                  <CardTitle>Share Link</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={publicUrl}
                      readOnly
                      className="w-full px-3 py-2 text-sm border rounded-md bg-slate-50"
                      onClick={(e) => e.currentTarget.select()}
                    />
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        navigator.clipboard.writeText(publicUrl)
                        alert('Link copied to clipboard!')
                      }}
                    >
                      Copy Link
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Enabled Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Favorites</span>
                  <Badge variant={gallery.allow_favorites ? 'success' : 'secondary'}>
                    {gallery.allow_favorites ? 'On' : 'Off'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Downloads</span>
                  <Badge variant={gallery.allow_downloads ? 'success' : 'secondary'}>
                    {gallery.allow_downloads ? 'On' : 'Off'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Orders</span>
                  <Badge variant={gallery.allow_orders ? 'success' : 'secondary'}>
                    {gallery.allow_orders ? 'On' : 'Off'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
