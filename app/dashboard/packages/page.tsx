'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Edit, Eye, EyeOff, DollarSign } from 'lucide-react'
import Link from 'next/link'

interface ServicePackage {
  id: string
  name: string
  slug: string
  category: string
  description: string
  features: string[]
  base_price: number
  price_tiers: any
  active: boolean
  display_order: number
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<ServicePackage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('service_packages')
      .select('*')
      .order('display_order', { ascending: true })

    if (data) {
      setPackages(data)
    }
    setLoading(false)
  }

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const supabase = createClient()
    await supabase
      .from('service_packages')
      .update({ active: !currentStatus })
      .eq('id', id)

    fetchPackages()
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'family': return 'bg-blue-100 text-blue-800'
      case 'team': return 'bg-green-100 text-green-800'
      case 'tournament': return 'bg-purple-100 text-purple-800'
      case 'multi-year': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Service Packages</h1>
          <p className="text-gray-600 mt-1">Manage your service offerings and pricing</p>
        </div>
        <Link href="/dashboard/packages/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Package
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading packages...</div>
      ) : packages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            <p className="mb-4">No packages yet.</p>
            <Link href="/dashboard/packages/new">
              <Button>Create Your First Package</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <Card key={pkg.id} className={!pkg.active ? 'opacity-60' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(pkg.category)}`}>
                    {pkg.category}
                  </span>
                  {pkg.active ? (
                    <Eye className="h-4 w-4 text-green-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                <CardTitle>{pkg.name}</CardTitle>
                <CardDescription className="line-clamp-2">{pkg.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="text-3xl font-bold text-gray-900">
                    ${pkg.base_price}
                  </div>
                  {pkg.price_tiers && (
                    <div className="text-sm text-gray-500 mt-1">
                      Multiple tiers available
                    </div>
                  )}
                </div>

                {pkg.features && pkg.features.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-medium mb-2">Features:</div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {pkg.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="mr-2">✓</span>
                          <span className="line-clamp-1">{feature}</span>
                        </li>
                      ))}
                      {pkg.features.length > 3 && (
                        <li className="text-gray-400">+{pkg.features.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="flex gap-2">
                  <Link href={`/dashboard/packages/${pkg.id}`} className="flex-1">
                    <Button variant="outline" className="w-full" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(pkg.id, pkg.active)}
                  >
                    {pkg.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Packages</CardDescription>
            <CardTitle className="text-2xl">{packages.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {packages.filter(p => p.active).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Inactive</CardDescription>
            <CardTitle className="text-2xl text-gray-600">
              {packages.filter(p => !p.active).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Avg Price</CardDescription>
            <CardTitle className="text-2xl">
              ${packages.length > 0 ? Math.round(packages.reduce((sum, p) => sum + p.base_price, 0) / packages.length) : 0}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
