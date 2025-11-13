# Sports Media Gallery - Project Overview

## 🎯 Project Summary

A complete, production-ready gallery and booking system for **Nvision Video** and **Vincente Photos** sports media services. Built with modern web technologies to handle photo/video galleries, client interactions, favorites, downloads, and print ordering.

## ✨ Key Features

### For Photographers (Owners)
- **Gallery Management**: Create unlimited galleries for different events/clients
- **Bulk Upload**: Drag-and-drop interface for uploading multiple files
- **Privacy Controls**: 
  - Public/private galleries
  - Password protection
  - Expiration dates
  - Invite-only access
- **Client Tracking**: Monitor views, favorites, downloads, and orders
- **Service Types**: Separate workflows for video (Nvision) and photos (Vincente)

### For Clients (Visitors)
- **Beautiful Gallery View**: Responsive masonry grid layout
- **Favorites System**: Mark and collect favorite images/videos
- **Downloads**: 
  - Individual file downloads
  - Bulk ZIP downloads
  - Web and full-resolution options
- **Print Ordering**: Order prints, canvas, and products with Stripe integration
- **Anonymous Access**: No login required for viewing (optional)

## 🏗️ Architecture

### Tech Stack
```
Frontend:
- Next.js 14 (App Router)
- React 18
- TypeScript
- TailwindCSS
- shadcn/ui components
- Lucide icons

Backend:
- Supabase (PostgreSQL)
- Supabase Auth
- Supabase Storage
- Row Level Security (RLS)

Payments:
- Stripe
- Webhook integration

Deployment:
- Vercel (recommended)
- Any Node.js hosting
```

### Database Schema

```
profiles (users)
├── id (UUID, PK)
├── name
├── email
├── role (owner/client)
└── timestamps

galleries
├── id (UUID, PK)
├── user_id (FK → profiles)
├── title, slug, description
├── service_type (video/photo)
├── status (draft/published/archived)
├── is_public, password_hash
├── allow_downloads, allow_favorites, allow_orders
├── expires_at
└── timestamps

media (photos/videos)
├── id (UUID, PK)
├── gallery_id (FK → galleries)
├── file_url, preview_url, thumbnail_url
├── media_type (photo/video)
├── dimensions, metadata
└── sort_order

favorites
├── id (UUID, PK)
├── gallery_id (FK)
├── media_id (FK)
└── client_identifier

downloads (tracking)
├── id (UUID, PK)
├── gallery_id, media_id
├── client_identifier
└── download_type

orders
├── id (UUID, PK)
├── gallery_id
├── client_identifier, client_email
├── status, total_amount
└── stripe_payment_intent_id

order_items
├── id (UUID, PK)
├── order_id (FK)
├── media_id (FK)
├── product_type, quantity, price
```

## 📁 Project Structure

```
Sports Page/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Auth pages (grouped route)
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── dashboard/               # Owner dashboard
│   │   ├── page.tsx            # Gallery list
│   │   └── galleries/
│   │       ├── new/page.tsx    # Create gallery
│   │       └── [id]/page.tsx   # Edit gallery
│   ├── g/[slug]/page.tsx       # Public gallery view
│   ├── api/                     # API routes
│   │   ├── upload/route.ts
│   │   ├── galleries/route.ts
│   │   └── stripe/webhook/route.ts
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   └── globals.css             # Global styles
│
├── components/
│   ├── ui/                      # Reusable UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── badge.tsx
│   ├── gallery/                 # Gallery-specific
│   │   ├── upload-zone.tsx
│   │   ├── gallery-grid.tsx
│   │   └── media-card.tsx
│   └── dashboard/               # Dashboard components
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Client-side Supabase
│   │   └── server.ts           # Server-side Supabase
│   ├── stripe.ts               # Stripe config & pricing
│   └── utils.ts                # Utility functions
│
├── types/
│   └── database.ts             # TypeScript types
│
├── supabase/
│   └── schema.sql              # Database schema
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── .env.local.example
├── README.md                    # Full documentation
├── SETUP.md                     # Setup instructions
└── PROJECT_OVERVIEW.md          # This file
```

## 🔐 Security Features

### Row Level Security (RLS)
- All tables protected with RLS policies
- Owners can only access their own galleries
- Public galleries viewable by anyone
- Private galleries require authentication

### Authentication
- Supabase Auth (email/password)
- Role-based access (owner/client)
- Session management
- Password hashing (bcrypt)

### File Storage
- Signed URLs with expiration
- Public/private buckets
- File size limits
- Type validation

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase
1. Create project at supabase.com
2. Run `supabase/schema.sql` in SQL Editor
3. Create `galleries` storage bucket
4. Copy API keys

### 3. Configure Environment
```bash
cp .env.local.example .env.local
# Edit .env.local with your keys
```

### 4. Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000

## 📊 Data Flow

### Gallery Creation Flow
```
1. Owner creates gallery (draft status)
2. Sets title, description, service type
3. Configures privacy settings
4. Uploads media files
5. Files processed (thumbnails, previews)
6. Publishes gallery (status → published)
7. Shares link with clients
```

### Client Viewing Flow
```
1. Client visits /g/[slug]
2. Check gallery status & expiration
3. If private, prompt for password
4. Load media from database
5. Display in masonry grid
6. Enable favorites/downloads/orders
```

### Favorites Flow
```
1. Client clicks heart icon
2. Generate/retrieve client_identifier (localStorage)
3. Toggle favorite in database
4. Update UI optimistically
5. Show favorites bar if any selected
```

### Order Flow
```
1. Client selects media & products
2. Add to cart (local state)
3. Checkout creates order (pending)
4. Stripe payment intent created
5. Client completes payment
6. Webhook updates order (paid)
7. Owner fulfills order
```

## 💰 Pricing Configuration

Edit `lib/stripe.ts` to customize:

```typescript
export const PRODUCT_PRICES = {
  // Photos
  'print_8x10': 1500,      // $15.00
  'canvas_16x20': 8500,    // $85.00
  
  // Videos
  'video_highlight': 15000, // $150.00
  'video_full': 35000,      // $350.00
}
```

## 🎨 Customization

### Branding
- Update logo in `app/layout.tsx`
- Modify colors in `tailwind.config.ts`
- Edit landing page in `app/page.tsx`

### Gallery Layout
- Adjust grid columns in gallery components
- Modify masonry breakpoints
- Customize card styles

### Email Notifications
- Add email service (SendGrid, Resend)
- Create templates for:
  - Gallery published
  - Order confirmation
  - Download ready

## 📈 Future Enhancements

### Phase 2 Features
- [ ] Email notifications
- [ ] Gallery analytics dashboard
- [ ] Watermark support
- [ ] Batch editing tools
- [ ] Client comments
- [ ] Social sharing
- [ ] Mobile app

### Phase 3 Features
- [ ] AI-powered photo selection
- [ ] Automatic highlight reels
- [ ] Live event streaming
- [ ] Multi-photographer collaboration
- [ ] Advanced search & filters
- [ ] Custom branding per gallery

## 🐛 Known Limitations

1. **File Size**: Currently limited to 50MB per file
2. **Processing**: Thumbnail generation happens synchronously
3. **ZIP Downloads**: Generated on-demand (can be slow for large galleries)
4. **Video Playback**: Basic HTML5 player (no adaptive streaming)

## 📝 Development Notes

### TypeScript Errors
All TypeScript/lint errors shown in the IDE are expected before running `npm install`. They will resolve once dependencies are installed.

### Environment Variables
Never commit `.env.local` to version control. Always use `.env.local.example` as a template.

### Database Migrations
When modifying schema, update `supabase/schema.sql` and run migrations in Supabase dashboard.

## 🤝 Support & Maintenance

### Regular Tasks
- Monitor Supabase usage
- Review Stripe transactions
- Check error logs
- Update dependencies
- Backup database

### Troubleshooting
See `SETUP.md` for common issues and solutions.

## 📄 License

Proprietary - All rights reserved

---

**Built for sports photographers who demand the best** 📸🎥
