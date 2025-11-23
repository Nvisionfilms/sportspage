'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Send, Eye, Copy, Check } from 'lucide-react'

interface EmailTemplate {
  id: string
  name: string
  category: string
  subject: string
  body: string
  usage_notes: string
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [recipientEmail, setRecipientEmail] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [customSubject, setCustomSubject] = useState('')
  const [customBody, setCustomBody] = useState('')
  const [sending, setSending] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('email_templates')
      .select('*')
      .eq('active', true)
      .order('category', { ascending: true })

    if (data) {
      setTemplates(data)
    }
  }

  const selectTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template)
    setCustomSubject(template.subject)
    setCustomBody(template.body)
  }

  const replaceVariables = (text: string) => {
    return text
      .replace(/\[Name\]/g, recipientName || '[Name]')
      .replace(/\[Your Name\]/g, 'NVision Films')
      .replace(/\[Phone\]/g, '(512) XXX-XXXX')
  }

  const handleSendEmail = async () => {
    if (!recipientEmail || !selectedTemplate) return

    setSending(true)

    const finalSubject = replaceVariables(customSubject)
    const finalBody = replaceVariables(customBody)

    const supabase = createClient()
    
    // Log the sent email
    await supabase.from('sent_emails').insert([{
      template_id: selectedTemplate.id,
      recipient_email: recipientEmail,
      recipient_name: recipientName,
      subject: finalSubject,
      body: finalBody,
      status: 'sent'
    }])

    // In production, integrate with email service (SendGrid, Resend, etc.)
    // For now, we'll just copy to clipboard
    const emailContent = `To: ${recipientEmail}\nSubject: ${finalSubject}\n\n${finalBody}`
    navigator.clipboard.writeText(emailContent)

    alert('Email logged! Content copied to clipboard. Paste into your email client.')
    
    setSending(false)
    setRecipientEmail('')
    setRecipientName('')
  }

  const copyToClipboard = () => {
    const emailContent = `Subject: ${replaceVariables(customSubject)}\n\n${replaceVariables(customBody)}`
    navigator.clipboard.writeText(emailContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const categories = [
    { id: 'outreach', name: 'Outreach', color: 'bg-blue-100 text-blue-800' },
    { id: 'follow-up', name: 'Follow-ups', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'onboarding', name: 'Onboarding', color: 'bg-green-100 text-green-800' },
    { id: 'retention', name: 'Retention', color: 'bg-purple-100 text-purple-800' }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Email Templates</h1>
        <p className="text-gray-600 mt-1">Send professional emails with one click</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Library */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Template Library</CardTitle>
              <CardDescription>Choose a template to send</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map(category => {
                const categoryTemplates = templates.filter(t => t.category === category.id)
                if (categoryTemplates.length === 0) return null

                return (
                  <div key={category.id}>
                    <div className={`px-2 py-1 text-xs rounded-full inline-block mb-2 ${category.color}`}>
                      {category.name}
                    </div>
                    {categoryTemplates.map(template => (
                      <button
                        key={template.id}
                        onClick={() => selectTemplate(template)}
                        className={`w-full text-left p-3 rounded-lg border mb-2 hover:bg-gray-50 transition ${
                          selectedTemplate?.id === template.id ? 'border-blue-500 bg-blue-50' : ''
                        }`}
                      >
                        <div className="font-medium text-sm">{template.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{template.subject}</div>
                      </button>
                    ))}
                  </div>
                )
              })}

              {templates.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No templates loaded yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Email Composer */}
        <div className="lg:col-span-2">
          {selectedTemplate ? (
            <Card>
              <CardHeader>
                <CardTitle>{selectedTemplate.name}</CardTitle>
                <CardDescription>{selectedTemplate.usage_notes}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Recipient Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Recipient Name</label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="John Smith"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Recipient Email</label>
                    <input
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                {/* Body */}
                <div>
                  <label className="block text-sm font-medium mb-2">Email Body</label>
                  <textarea
                    value={customBody}
                    onChange={(e) => setCustomBody(e.target.value)}
                    rows={12}
                    className="w-full px-3 py-2 border rounded-md font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use [Name] for recipient name - it will auto-replace
                  </p>
                </div>

                {/* Preview */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium mb-2">Preview:</div>
                  <div className="text-sm">
                    <div className="mb-2"><strong>Subject:</strong> {replaceVariables(customSubject)}</div>
                    <div className="whitespace-pre-wrap">{replaceVariables(customBody)}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={handleSendEmail}
                    disabled={!recipientEmail || sending}
                    className="flex-1"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {sending ? 'Sending...' : 'Send Email'}
                  </Button>
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-16 text-center text-gray-500">
                <Mail className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Select a template from the library to get started</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
