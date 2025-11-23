'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, Phone, Mail, MessageSquare, Calendar, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'

interface Lead {
  id: string
  contact_name: string
  athlete_name: string | null
  email: string | null
  phone: string | null
  sport: string | null
  school_club: string | null
  city: string | null
  status: string
  lead_score: number
  next_follow_up_date: string | null
  interactions_count: number
  created_at: string
}

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    warm: 0,
    hot: 0,
    converted: 0
  })

  useEffect(() => {
    fetchLeads()
  }, [])

  useEffect(() => {
    filterLeads()
  }, [searchTerm, statusFilter, leads])

  const fetchLeads = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) {
      setLeads(data)
      calculateStats(data)
    }
    setLoading(false)
  }

  const calculateStats = (leadsData: Lead[]) => {
    setStats({
      total: leadsData.length,
      new: leadsData.filter(l => l.status === 'new').length,
      warm: leadsData.filter(l => l.status === 'warm').length,
      hot: leadsData.filter(l => l.status === 'hot').length,
      converted: leadsData.filter(l => l.status === 'converted').length
    })
  }

  const filterLeads = () => {
    let filtered = leads

    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.athlete_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.sport?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredLeads(filtered)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'warm': return 'bg-yellow-100 text-yellow-800'
      case 'hot': return 'bg-red-100 text-red-800'
      case 'converted': return 'bg-green-100 text-green-800'
      case 'cold': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 font-semibold'
    if (score >= 5) return 'text-yellow-600'
    return 'text-gray-600'
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">CRM & Lead Tracking</h1>
          <p className="text-gray-600 mt-1">Manage your leads and client relationships</p>
        </div>
        <Link href="/dashboard/crm/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Leads</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>New</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{stats.new}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Warm</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{stats.warm}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Hot</CardDescription>
            <CardTitle className="text-3xl text-red-600">{stats.hot}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Converted</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.converted}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="warm">Warm</option>
              <option value="hot">Hot</option>
              <option value="cold">Cold</option>
              <option value="converted">Converted</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading leads...</div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No leads found. <Link href="/dashboard/crm/new" className="text-blue-600 hover:underline">Add your first lead</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Athlete</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sport</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">School/Club</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Follow-up</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium">{lead.contact_name}</div>
                          <div className="text-sm text-gray-500">{lead.email}</div>
                          <div className="text-sm text-gray-500">{lead.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">{lead.athlete_name || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">{lead.sport || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">{lead.school_club || '-'}</div>
                        <div className="text-xs text-gray-500">{lead.city}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm ${getScoreColor(lead.lead_score)}`}>
                          {lead.lead_score}/10
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {lead.next_follow_up_date ? (
                            <span className="text-gray-900">
                              {new Date(lead.next_follow_up_date).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="text-gray-400">Not set</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link href={`/dashboard/crm/${lead.id}`}>
                            <Button variant="outline" size="sm">View</Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
