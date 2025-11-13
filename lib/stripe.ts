import Stripe from 'stripe'
import { loadStripe } from '@stripe/stripe-js'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
})

let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripePromise
}

export const PRODUCT_PRICES = {
  // Photo prints
  'print_4x6': 500,      // $5.00
  'print_5x7': 800,      // $8.00
  'print_8x10': 1500,    // $15.00
  'print_11x14': 2500,   // $25.00
  'print_16x20': 4500,   // $45.00
  
  // Canvas prints
  'canvas_8x10': 3500,   // $35.00
  'canvas_11x14': 5500,  // $55.00
  'canvas_16x20': 8500,  // $85.00
  'canvas_20x30': 12500, // $125.00
  
  // Digital downloads
  'digital_web': 500,    // $5.00
  'digital_full': 1500,  // $15.00
  
  // Video packages
  'video_highlight': 15000,  // $150.00
  'video_full': 35000,       // $350.00
} as const

export type ProductType = keyof typeof PRODUCT_PRICES

export const PRODUCT_LABELS: Record<ProductType, string> = {
  'print_4x6': '4x6 Print',
  'print_5x7': '5x7 Print',
  'print_8x10': '8x10 Print',
  'print_11x14': '11x14 Print',
  'print_16x20': '16x20 Print',
  'canvas_8x10': '8x10 Canvas',
  'canvas_11x14': '11x14 Canvas',
  'canvas_16x20': '16x20 Canvas',
  'canvas_20x30': '20x30 Canvas',
  'digital_web': 'Web Resolution',
  'digital_full': 'Full Resolution',
  'video_highlight': 'Highlight Reel',
  'video_full': 'Full Game Video',
}
