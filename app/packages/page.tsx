'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Calendar } from 'lucide-react'
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
}

export default function PublicPackagesPage() {
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
      .eq('active', true)
      .order('display_order', { ascending: true })

    if (data) {
      setPackages(data)
    }
    setLoading(false)
  }

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'family': return 'For Families'
      case 'team': return 'For Teams'
      case 'tournament': return 'For Events'
      case 'multi-year': return 'Long-Term Programs'
      default: return category
    }
  }

  const groupedPackages = packages.reduce((acc, pkg) => {
    if (!acc[pkg.category]) {
      acc[pkg.category] = []
    }
    acc[pkg.category].push(pkg)
    return acc
  }, {} as Record<string, ServicePackage[]>)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Professional Sports Media Packages
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Capture every moment. Showcase every talent. Build your recruiting profile.
          </p>
        </div>
      </div>

      {/* Packages */}
      <div className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading packages...</div>
        ) : (
          <div className="space-y-16">
            {Object.entries(groupedPackages).map(([category, categoryPackages]) => (
              <div key={category}>
                <h2 className="text-3xl font-bold mb-8 text-center">
                  {getCategoryTitle(category)}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categoryPackages.map((pkg) => (
                    <Card key={pkg.id} className="hover:shadow-xl transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                        <CardDescription className="text-base">
                          {pkg.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {/* Pricing */}
                        <div className="mb-6">
                          {pkg.price_tiers ? (
                            <div>
                              <div className="text-sm text-gray-600 mb-2">Starting at</div>
                              <div className="text-4xl font-bold text-slate-900">
                                ${pkg.base_price}
                              </div>
                            </div>
                          ) : (
                            <div className="text-4xl font-bold text-slate-900">
                              ${pkg.base_price}
                            </div>
                          )}
                        </div>

                        {/* Features */}
                        {pkg.features && pkg.features.length > 0 && (
                          <div className="mb-6">
                            <ul className="space-y-3">
                              {pkg.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start">
                                  <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                                  <span className="text-gray-700">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* CTA Buttons */}
                        <div className="space-y-2">
                          <Link href={`/book?package=${pkg.slug}`} className="block">
                            <Button className="w-full" size="lg">
                              <Calendar className="h-4 w-4 mr-2" />
                              Book Now
                            </Button>
                          </Link>
                          <Link href={`/packages/${pkg.slug}`} className="block">
                            <Button variant="outline" className="w-full">
                              Learn More
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-slate-900 text-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Not Sure Which Package Is Right?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Let's chat! We'll help you find the perfect package for your needs.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" variant="outline" className="bg-white text-slate-900 hover:bg-slate-100">
                Contact Us
              </Button>
            </Link>
            <a href="tel:+15125550100">
              <Button size="lg">
                Call (512) 555-0100
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
