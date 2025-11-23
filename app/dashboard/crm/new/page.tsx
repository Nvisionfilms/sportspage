'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewLeadPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    contact_name: '',
    athlete_name: '',
    email: '',
    phone: '',
    age: '',
    sport: '',
    school_club: '',
    city: '',
    contact_method: '',
    referral_source: '',
    status: 'new',
    lead_score: 5,
    notes: '',
    next_follow_up_date: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('leads')
      .insert([{
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
        lead_score: parseInt(formData.lead_score.toString())
      }])
      .select()

    if (error) {
      alert('Error creating lead: ' + error.message)
      setLoading(false)
    } else {
      router.push('/dashboard/crm')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link href="/dashboard/crm">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to CRM
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Add New Lead</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Name *</label>
                  <Input
                    name="contact_name"
                    value={formData.contact_name}
                    onChange={handleChange}
                    required
                    placeholder="Parent or contact name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Athlete Name</label>
                  <Input
                    name="athlete_name"
                    value={formData.athlete_name}
                    onChange={handleChange}
                    placeholder="Student athlete name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(512) 555-0100"
                  />
                </div>
              </div>
            </div>

            {/* Athlete Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Athlete Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Age</label>
                  <Input
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="14"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Sport</label>
                  <Input
                    name="sport"
                    value={formData.sport}
                    onChange={handleChange}
                    placeholder="Basketball, Football, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">School/Club</label>
                  <Input
                    name="school_club"
                    value={formData.school_club}
                    onChange={handleChange}
                    placeholder="Hays HS, Elite Hoops AAU, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Kyle, Buda, San Marcos, etc."
                  />
                </div>
              </div>
            </div>

            {/* Lead Source & Status */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Lead Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Method</label>
                  <select
                    name="contact_method"
                    value={formData.contact_method}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Select method</option>
                    <option value="Instagram DM">Instagram DM</option>
                    <option value="Email">Email</option>
                    <option value="Phone">Phone</option>
                    <option value="Text">Text</option>
                    <option value="In Person">In Person</option>
                    <option value="Referral">Referral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Referral Source</label>
                  <Input
                    name="referral_source"
                    value={formData.referral_source}
                    onChange={handleChange}
                    placeholder="Who referred them?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="new">New</option>
                    <option value="warm">Warm</option>
                    <option value="hot">Hot</option>
                    <option value="cold">Cold</option>
                    <option value="converted">Converted</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Lead Score (1-10)</label>
                  <Input
                    name="lead_score"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.lead_score}
                    onChange={handleChange}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Next Follow-up Date</label>
                  <Input
                    name="next_follow_up_date"
                    type="date"
                    value={formData.next_follow_up_date}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-2">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Any additional notes about this lead..."
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Creating...' : 'Create Lead'}
              </Button>
              <Link href="/dashboard/crm" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
