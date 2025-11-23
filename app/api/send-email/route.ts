import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createServerClient } from '@/lib/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    // Verify user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      to, 
      subject, 
      body: emailBody, 
      templateId,
      recipientName 
    } = body

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'NVision Films <noreply@nvisionfilms.com>', // Change to your verified domain
      to: [to],
      subject: subject,
      html: emailBody.replace(/\n/g, '<br>'),
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log sent email in database
    await supabase.from('sent_emails').insert({
      template_id: templateId,
      recipient_email: to,
      recipient_name: recipientName,
      subject: subject,
      body: emailBody,
      status: 'sent',
      sent_at: new Date().toISOString()
    })

    return NextResponse.json({ 
      success: true, 
      messageId: data?.id 
    })

  } catch (error: any) {
    console.error('Email send error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to send email' 
    }, { status: 500 })
  }
}
