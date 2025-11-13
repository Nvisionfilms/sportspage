import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { getSecureHeaders } from '@/lib/security'

/**
 * POST /api/stripe/webhook - Handle Stripe webhooks
 */
export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400, headers: getSecureHeaders() }
    )
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400, headers: getSecureHeaders() }
    )
  }

  const supabase = createServerClient()

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        const orderId = paymentIntent.metadata.order_id

        if (orderId) {
          // Update order status to paid
          const { error } = await supabase
            .from('orders')
            .update({ status: 'paid' })
            .eq('id', orderId)

          if (error) {
            console.error('Failed to update order:', error)
          } else {
            console.log(`Order ${orderId} marked as paid`)
          }
        }
        break

      case 'payment_intent.payment_failed':
        const failedIntent = event.data.object
        const failedOrderId = failedIntent.metadata.order_id

        if (failedOrderId) {
          // Update order status to cancelled
          await supabase
            .from('orders')
            .update({ status: 'cancelled' })
            .eq('id', failedOrderId)

          console.log(`Order ${failedOrderId} marked as cancelled`)
        }
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json(
      { received: true },
      { status: 200, headers: getSecureHeaders() }
    )
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500, headers: getSecureHeaders() }
    )
  }
}
