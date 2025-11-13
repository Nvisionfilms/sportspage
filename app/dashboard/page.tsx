import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Camera, Video, Eye, Heart, Download } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'owner') {
    redirect('/')
  }

  // Fetch galleries
  const { data: galleries } = await supabase
    .from('galleries')
    .select(`
      *,
      media(count)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="h-8 w-8 text-slate-900" />
            <div>
              <h1 className="text-xl font-bold">Dashboard</h1>
              <p className="text-xs text-slate-600">{profile?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/galleries/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Gallery
              </Button>
            </Link>
            <form action="/api/auth/signout" method="post">
              <Button variant="ghost">Sign Out</Button>
            </form>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Galleries</p>
                  <p className="text-2xl font-bold">{galleries?.length || 0}</p>
                </div>
                <Camera className="h-8 w-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Views</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <Eye className="h-8 w-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Favorites</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <Heart className="h-8 w-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Downloads</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <Download className="h-8 w-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Galleries */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Galleries</h2>
          <Link href="/dashboard/galleries/new">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Gallery
            </Button>
          </Link>
        </div>

        {galleries && galleries.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {galleries.map((gallery: any) => (
              <Link key={gallery.id} href={`/dashboard/galleries/${gallery.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-video bg-slate-200 rounded-t-lg flex items-center justify-center">
                    {gallery.service_type === 'video' ? (
                      <Video className="h-12 w-12 text-slate-400" />
                    ) : (
                      <Camera className="h-12 w-12 text-slate-400" />
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg">{gallery.title}</CardTitle>
                      <Badge variant={gallery.status === 'published' ? 'success' : 'secondary'}>
                        {gallery.status}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {gallery.description || 'No description'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span>{gallery.media?.[0]?.count || 0} items</span>
                      <span>•</span>
                      <span>{gallery.service_type}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Camera className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No galleries yet</h3>
              <p className="text-slate-600 mb-4">
                Create your first gallery to start sharing your sports media
              </p>
              <Link href="/dashboard/galleries/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Gallery
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
