# Sports Media Gallery - Nvision & Vincente

A professional sports media gallery and booking system for **Nvision Video** and **Vincente Photos**. Built with Next.js 14, Supabase, and Stripe.

## 🚀 Quick Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Nvisionfilms/sportspage)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Nvisionfilms/sportspage)

## Features

### For Photographers/Owners
- **Gallery Management**: Create, edit, and organize photo/video galleries
- **Upload & Processing**: Bulk upload with automatic thumbnail generation
- **Privacy Controls**: Password protection, expiration dates, invite-only access
- **Client Management**: Track favorites, downloads, and orders
- **Analytics**: View gallery performance and client engagement

### For Clients/Visitors
- **Browse Galleries**: Beautiful masonry layout with lazy loading
- **Favorites**: Mark and collect favorite photos/videos
- **Downloads**: Download individual files or entire galleries as ZIP
- **Print Orders**: Order professional prints, canvas, and products
- **Secure Access**: Password-protected and invite-only galleries

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Payments**: Stripe
- **Styling**: TailwindCSS + shadcn/ui
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account (free tier works)
- Stripe account (for payments)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Set up Storage buckets:
   - Create a `galleries` bucket (public)
   - Create folders: `originals`, `previews`, `thumbnails`
4. Get your project URL and keys from Settings > API

### 3. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Owner dashboard
│   ├── g/[slug]/          # Public gallery view
│   └── api/               # API routes
├── components/
│   ├── ui/                # Reusable UI components
│   ├── gallery/           # Gallery-specific components
│   └── dashboard/         # Dashboard components
├── lib/
│   ├── supabase/          # Supabase client & server
│   ├── stripe.ts          # Stripe configuration
│   └── utils.ts           # Utility functions
├── types/
│   └── database.ts        # TypeScript types
└── supabase/
    └── schema.sql         # Database schema
```

## Key Features Implementation

### Gallery Access Logic

```typescript
// Public gallery: Anyone can view
if (gallery.is_public && gallery.status === 'published') {
  // Show gallery
}

// Password-protected: Require password
if (!gallery.is_public && gallery.password_hash) {
  // Prompt for password
  // Validate with bcrypt
  // Store in session
}

// Expired gallery: Block access
if (gallery.expires_at && new Date() > new Date(gallery.expires_at)) {
  // Show "Gallery expired"
}
```

### Favorites System

```typescript
// Client identifier (anonymous or logged in)
const clientId = user?.id || getClientIdentifier() // From localStorage

// Toggle favorite
await supabase.from('favorites').upsert({
  gallery_id,
  media_id,
  client_identifier: clientId
})
```

### Download Tracking

```typescript
// Log download
await supabase.from('downloads').insert({
  gallery_id,
  media_id,
  client_identifier: clientId,
  download_type: 'full_res' // or 'web', 'zip_all'
})

// Generate signed URL
const { data } = await supabase.storage
  .from('galleries')
  .createSignedUrl(filePath, 3600) // 1 hour expiry
```

### Order Processing

```typescript
// Create Stripe payment intent
const paymentIntent = await stripe.paymentIntents.create({
  amount: totalAmount,
  currency: 'usd',
  metadata: { gallery_id, order_id }
})

// On webhook success
await supabase.from('orders').update({
  status: 'paid',
  stripe_payment_intent_id: paymentIntent.id
}).eq('id', order_id)
```

## Database Schema

### Core Tables

- **profiles**: User accounts (owner/client roles)
- **galleries**: Gallery metadata and settings
- **media**: Photos/videos with URLs and metadata
- **favorites**: Client favorites tracking
- **downloads**: Download history
- **orders**: Print/product orders
- **order_items**: Individual order line items

### Row Level Security (RLS)

All tables have RLS policies:
- Owners can only manage their own galleries
- Public galleries are viewable by anyone
- Clients can manage their own favorites/orders

## API Routes

- `POST /api/galleries` - Create gallery
- `GET /api/galleries/:slug` - Get gallery details
- `POST /api/galleries/:id/photos` - Upload photos
- `POST /api/galleries/:id/favorites` - Toggle favorite
- `POST /api/galleries/:id/download` - Generate download URL
- `POST /api/orders` - Create order
- `POST /api/stripe/webhook` - Handle Stripe webhooks

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Set Up Stripe Webhooks

1. In Stripe Dashboard, add webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
2. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
3. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

## Customization

### Product Pricing

Edit `lib/stripe.ts` to customize print/product prices:

```typescript
export const PRODUCT_PRICES = {
  'print_8x10': 1500,  // $15.00
  'canvas_16x20': 8500, // $85.00
  // ... add more products
}
```

### Gallery Layout

Customize the masonry grid in `components/gallery/gallery-grid.tsx`:

```typescript
const breakpointColumns = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1
}
```

## Support

For issues or questions:
- Check the [documentation](docs/)
- Open an issue on GitHub
- Contact support

## License

Proprietary - All rights reserved

---

Built with ❤️ for sports photographers
