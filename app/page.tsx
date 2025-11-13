import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Camera, Video, Heart, Download, ShoppingCart, Lock } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="h-8 w-8 text-slate-900" />
            <div>
              <h1 className="text-xl font-bold">NVC Sports Media</h1>
              <p className="text-xs text-slate-600">Professional Sports Coverage</p>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
          Professional Sports Media
        </h2>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Capture every moment with our premium photography and videography services.
          Share, favorite, and order prints from your personalized galleries.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg" className="gap-2">
              <Camera className="h-5 w-5" />
              Create Gallery
            </Button>
          </Link>
          <Link href="/demo">
            <Button size="lg" variant="outline" className="gap-2">
              <Video className="h-5 w-5" />
              View Demo
            </Button>
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-2 hover:border-slate-300 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <Video className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Nvision - Video</CardTitle>
              <CardDescription>
                Professional sports videography with highlight reels and full game coverage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Highlight reels</li>
                <li>• Full game videos</li>
                <li>• Instant downloads</li>
                <li>• HD & 4K quality</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-slate-300 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <Camera className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Vincente - Photos</CardTitle>
              <CardDescription>
                High-quality sports photography with professional editing and print options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Action shots</li>
                <li>• Team photos</li>
                <li>• Print & canvas orders</li>
                <li>• Digital downloads</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Gallery Features</h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <h4 className="font-semibold mb-2">Favorites</h4>
              <p className="text-sm text-slate-600">
                Mark your favorite photos and videos for easy access
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Downloads</h4>
              <p className="text-sm text-slate-600">
                Download individual files or entire galleries as ZIP
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Print Orders</h4>
              <p className="text-sm text-slate-600">
                Order professional prints and canvas directly from galleries
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-slate-600" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Private & Secure Galleries</h3>
          <p className="text-slate-600 mb-6">
            Control who sees your media with password-protected galleries, expiration dates,
            and invite-only access. Your content is stored securely and only accessible to those you choose.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-slate-50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-slate-600">
          <p>&copy; 2024 NVC Sports Media. All rights reserved.</p>
          <div className="flex gap-4 justify-center mt-4">
            <Link href="/privacy" className="hover:text-slate-900">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-900">Terms</Link>
            <Link href="/contact" className="hover:text-slate-900">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
