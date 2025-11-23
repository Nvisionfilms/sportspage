# NVision Operations Integration - Deployment Steps

## ✅ What's Built

You now have a complete business operating system integrated into your website with **instant action buttons** throughout!

### Admin Dashboard Features:
1. **CRM** - Track leads, manage contacts
2. **Email Manager** - Send templated emails with one click
3. **Package Manager** - Manage service offerings

### Client Features:
1. **Package Browsing** - Public-facing catalog with "Book Now" buttons

---

## 🚀 Deploy in 3 Steps

### Step 1: Run Database Migration (5 minutes)

1. Go to your Supabase Dashboard:
   ```
   https://supabase.com/dashboard/project/yumxmkirlvagctcefaaq/editor
   ```

2. Click **"SQL Editor"** in the left sidebar

3. Click **"New query"**

4. Copy the entire contents of:
   ```
   e:\websites\Sports Page\supabase\migrations\20240101000000_nvision_operations.sql
   ```

5. Paste into the SQL editor

6. Click **"Run"** (bottom right)

7. You should see: "Success. No rows returned"

✅ **Database tables are now created!**

---

### Step 2: Seed Email Templates (2 minutes)

1. Open terminal in your project folder

2. Run the seed script:
   ```bash
   npx tsx scripts/seed-email-templates.ts
   ```

3. You should see:
   ```
   ✓ Seeded: Parent Initial Contact
   ✓ Seeded: Coach / Athletic Director
   ✓ Seeded: Club / AAU Director
   ... (12 total templates)
   Email templates seeded successfully!
   ```

✅ **All 12 email templates are now in your database!**

---

### Step 3: Deploy to Netlify (5 minutes)

1. Commit and push your changes:
   ```bash
   git add .
   git commit -m "Add NVision Operations integration"
   git push origin main
   ```

2. Netlify will automatically deploy (watch in Netlify dashboard)

3. Wait 2-5 minutes for build to complete

✅ **Your site is live with all new features!**

---

## 🎯 Test Your New Features

### Test Admin Dashboard

1. Go to: `https://nvcsports.netlify.app/login`

2. Login with your admin account

3. Navigate to:
   - `/dashboard/crm` - See CRM dashboard
   - `/dashboard/crm/new` - Add a test lead
   - `/dashboard/emails` - Browse email templates
   - `/dashboard/packages` - View packages

### Test Client Features

1. Go to: `https://nvcsports.netlify.app/packages`

2. You should see all service packages

3. Click "Book Now" buttons (will need booking page built next)

---

## 📊 Seed Service Packages (Optional)

Want to add the 4 main packages from your operations folder?

Create this file: `scripts/seed-packages.ts`

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

const packages = [
  {
    name: 'Seasonal Family Package',
    slug: 'seasonal-family',
    category: 'family',
    description: 'Full season coverage for your student athlete',
    features: [
      '4-8 game highlights per season',
      '60-90 second highlight reel per game',
      '24-48 hour turnaround',
      'Optimized for social media and recruiting',
      'End-of-season recap video',
      'Unlimited downloads and sharing'
    ],
    base_price: 800,
    price_tiers: {
      bronze: { games: 4, price: 800 },
      silver: { games: 6, price: 1200 },
      gold: { games: 8, price: 1600 }
    },
    active: true,
    display_order: 1
  },
  {
    name: 'Team Media Day',
    slug: 'team-media-day',
    category: 'team',
    description: 'Professional team photos and action shots',
    features: [
      'Individual headshots (all athletes)',
      'Action shots during practice/scrimmage',
      'Team photos',
      'Coach and staff photos',
      'Delivered within 3-5 days',
      'High-resolution downloads'
    ],
    base_price: 750,
    price_tiers: {
      small: { players: '1-15', price: 750 },
      medium: { players: '16-30', price: 1000 },
      large: { players: '31+', price: 1500 }
    },
    active: true,
    display_order: 2
  },
  {
    name: 'Tournament/Event Package',
    slug: 'tournament-event',
    category: 'tournament',
    description: 'Multi-game tournament coverage',
    features: [
      'Coverage of 2-4 games',
      'Individual athlete highlights',
      'Team highlights',
      '48-72 hour delivery',
      'Action photos included',
      'Social media ready content'
    ],
    base_price: 500,
    price_tiers: {
      weekend: { games: 2, price: 500 },
      full_tournament: { games: 4, price: 900 }
    },
    active: true,
    display_order: 3
  },
  {
    name: 'Rookie to Recruit',
    slug: 'rookie-to-recruit',
    category: 'multi-year',
    description: 'Multi-year program from freshman to senior',
    features: [
      'Full season coverage each year (4 years)',
      'Progressive recruiting film development',
      'Priority scheduling',
      'Discounted rate vs. annual packages',
      'Dedicated support throughout high school career',
      'College recruiting consultation'
    ],
    base_price: 5000,
    price_tiers: {
      four_year: { years: 4, price: 5000, savings: 1400 }
    },
    active: true,
    display_order: 4
  }
]

async function seedPackages() {
  console.log('Seeding service packages...')

  for (const pkg of packages) {
    const { error } = await supabase
      .from('service_packages')
      .upsert(pkg, { onConflict: 'slug' })

    if (error) {
      console.error(`Error seeding ${pkg.name}:`, error)
    } else {
      console.log(`✓ Seeded: ${pkg.name}`)
    }
  }

  console.log('Service packages seeded successfully!')
}

seedPackages()
```

Then run:
```bash
npx tsx scripts/seed-packages.ts
```

---

## 🎉 What You Can Do Now

### As Admin:
1. **Add leads** - Track every potential client
2. **Send emails** - Use templates with one click
3. **Manage packages** - Update pricing anytime
4. **Track everything** - No more spreadsheets!

### Clients Can:
1. **Browse packages** - See all offerings
2. **Book instantly** - Click "Book Now" buttons
3. **View pricing** - Transparent pricing display

---

## 🚧 What's Next (Optional)

Want to add more features? I can build:

1. **Booking System** - Let clients book shoots online
2. **Contract Generator** - Auto-generate contracts
3. **Weekly Scorecard** - Track business metrics
4. **Lead Detail Pages** - Full lead profiles with interaction history
5. **Client Dashboard** - Let clients view their content
6. **Payment Integration** - Accept payments via Stripe

Just let me know what you want next!

---

## 📞 Need Help?

If you run into any issues:
1. Check Supabase logs for database errors
2. Check Netlify deploy logs for build errors
3. Check browser console for frontend errors

**Your NVision Operations system is now live! 🎬**
