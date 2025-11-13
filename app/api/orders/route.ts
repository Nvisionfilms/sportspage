import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { rateLimit, getClientIp, sanitizeInput, isValidEmail, getSecureHeaders } from '@/lib/security'
import { stripe } from '@/lib/stripe'

/**
 * POST /api/orders - Create new order
 */
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const rateLimitResult = rateLimit(ip, 10, 60000)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: getSecureHeaders() }
      )
    }

    const body = await request.json()
    const { 
      gallery_id, 
      client_identifier, 
      client_email, 
      client_name,
      items // Array of { media_id, product_type, quantity, price }
    } = body

    // Validate required fields
    if (!gallery_id || !client_identifier || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400, headers: getSecureHeaders() }
      )
    }

    // Validate email if provided
    if (client_email && !isValidEmail(client_email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400, headers: getSecureHeaders() }
      )
    }

    const supabase = createServerClient()

    // Verify gallery exists and allows orders
    const { data: gallery, error: galleryError } = await supabase
      .from('galleries')
      .select('allow_orders, status')
      .eq('id', gallery_id)
      .single()

    if (galleryError || !gallery) {
      return NextResponse.json(
        { error: 'Gallery not found' },
        { status: 404, headers: getSecureHeaders() }
      )
    }

    if (!gallery.allow_orders) {
      return NextResponse.json(
        { error: 'Orders are not enabled for this gallery' },
        { status: 403, headers: getSecureHeaders() }
      )
    }

    if (gallery.status !== 'published') {
      return NextResponse.json(
        { error: 'Gallery is not published' },
        { status: 403, headers: getSecureHeaders() }
      )
    }

    // Calculate total
    const totalAmount = items.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity)
    }, 0)

    if (totalAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid order total' },
        { status: 400, headers: getSecureHeaders() }
      )
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        gallery_id,
        client_identifier,
        client_email: client_email ? sanitizeInput(client_email) : null,
        client_name: client_name ? sanitizeInput(client_name) : null,
        status: 'pending',
        total_amount: totalAmount,
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order creation error:', orderError)
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500, headers: getSecureHeaders() }
      )
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      media_id: item.media_id,
      product_type: item.product_type,
      quantity: item.quantity,
      price: item.price,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Order items error:', itemsError)
      // Rollback order
      await supabase.from('orders').delete().eq('id', order.id)
      
      return NextResponse.json(
        { error: 'Failed to create order items' },
        { status: 500, headers: getSecureHeaders() }
      )
    }

    // Create Stripe payment intent
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount,
        currency: 'usd',
        metadata: {
          order_id: order.id,
          gallery_id: gallery_id,
        },
      })

      // Update order with payment intent ID
      await supabase
        .from('orders')
        .update({ stripe_payment_intent_id: paymentIntent.id })
        .eq('id', order.id)

      return NextResponse.json(
        { 
          order,
          client_secret: paymentIntent.client_secret,
        },
        { status: 201, headers: getSecureHeaders() }
      )
    } catch (stripeError: any) {
      console.error('Stripe error:', stripeError)
      
      return NextResponse.json(
        { error: 'Failed to create payment. Please try again.' },
        { status: 500, headers: getSecureHeaders() }
      )
    }
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: getSecureHeaders() }
    )
  }
}
