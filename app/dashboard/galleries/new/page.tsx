'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Camera, Video } from 'lucide-react'

export default function NewGalleryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    service_type: 'photo' as 'photo' | 'video',
    is_public: true,
    password: '',
    allow_downloads: true,
    allow_favorites: true,
    allow_orders: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/galleries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create gallery')
      }

      // Redirect to gallery edit page
      router.push(`/dashboard/galleries/${data.gallery.id}`)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Create New Gallery</CardTitle>
            <CardDescription>
              Set up a new gallery for your sports media
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                  {error}
                </div>
              )}

              {/* Title */}
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Gallery Title *
                </label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g., Championship Game 2024"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <textarea
                  id="description"
                  className="flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                  placeholder="Describe this gallery..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Service Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Service Type *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, service_type: 'photo' })}
                    className={`p-4 rounded-md border-2 text-sm font-medium transition-colors ${
                      formData.service_type === 'photo'
                        ? 'border-slate-900 bg-slate-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Camera className="h-6 w-6 mx-auto mb-2" />
                    Vincente Photos
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, service_type: 'video' })}
                    className={`p-4 rounded-md border-2 text-sm font-medium transition-colors ${
                      formData.service_type === 'video'
                        ? 'border-slate-900 bg-slate-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Video className="h-6 w-6 mx-auto mb-2" />
                    Nvision Video
                  </button>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
                <h3 className="font-medium">Privacy Settings</h3>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_public}
                    onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Public gallery (anyone with link can view)</span>
                </label>

                {!formData.is_public && (
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Gallery Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Set a password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                )}
              </div>

              {/* Feature Settings */}
              <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
                <h3 className="font-medium">Features</h3>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.allow_favorites}
                    onChange={(e) => setFormData({ ...formData, allow_favorites: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Allow clients to favorite items</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.allow_downloads}
                    onChange={(e) => setFormData({ ...formData, allow_downloads: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Allow downloads</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.allow_orders}
                    onChange={(e) => setFormData({ ...formData, allow_orders: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Enable print orders (requires Stripe)</span>
                </label>
              </div>

              {/* Submit */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Creating...' : 'Create Gallery'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
