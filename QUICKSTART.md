# Quick Start Guide

Get your Sports Media Gallery running in **5 minutes**!

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- Optional: Stripe account for payments

## Step-by-Step Setup

### 1️⃣ Install Dependencies (2 min)

```bash
cd "e:\websites\Sports Page"
npm install
```

Wait for all packages to install. This will resolve all TypeScript errors you're seeing.

### 2️⃣ Set Up Supabase (2 min)

1. **Create Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Name: "Sports Media Gallery"
   - Choose a region
   - Set database password (save it!)

2. **Run Database Schema**
   - In Supabase dashboard, go to **SQL Editor**
   - Click "New Query"
   - Copy ALL content from `supabase/schema.sql`
   - Paste and click **RUN**
   - Wait for "Success" message

3. **Create Storage Bucket**
   - Go to **Storage** in sidebar
   - Click "Create a new bucket"
   - Name: `galleries`
   - Make it **Public**
   - Click "Create"

4. **Get Your Keys**
   - Go to **Settings** > **API**
   - Copy these three values:
     - Project URL
     - `anon` `public` key
     - `service_role` `secret` key

### 3️⃣ Configure Environment (1 min)

1. Copy the example file:
   ```bash
   copy .env.local.example .env.local
   ```

2. Open `.env.local` in your editor

3. Paste your Supabase values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   
   # Leave Stripe empty for now (optional)
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
   STRIPE_SECRET_KEY=
   STRIPE_WEBHOOK_SECRET=
   
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Save the file

### 4️⃣ Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## 🎉 You're Ready!

### Create Your First Gallery

1. **Sign Up**
   - Click "Get Started" on homepage
   - Fill in your name, email, password
   - Select "Photographer" as account type
   - Click "Create Account"

2. **Create Gallery**
   - You'll see the dashboard
   - Click "New Gallery"
   - Fill in:
     - Title: "Test Gallery"
     - Service: Photo or Video
     - Description: "My first gallery"
   - Click "Create"

3. **Upload Media**
   - Click "Upload Photos/Videos"
   - Drag and drop some images
   - Click "Upload All"
   - Wait for processing

4. **Publish**
   - Click "Publish Gallery"
   - Copy the gallery link
   - Open in new tab to view as client

## 🔍 Test Features

### Test Favorites
1. Open gallery as client
2. Hover over images
3. Click heart icon
4. See favorites bar at bottom

### Test Password Protection
1. Edit gallery settings
2. Toggle "Private Gallery"
3. Set a password
4. Save and test access

### Test Downloads
1. Enable downloads in gallery settings
2. Click download icon on any image
3. Try "Download All" button

## 🚀 Next Steps

### Add Stripe (Optional)
1. Go to [stripe.com](https://stripe.com)
2. Get API keys from Dashboard
3. Add to `.env.local`
4. Restart dev server
5. Enable orders in gallery settings

### Customize
- Edit `app/page.tsx` for landing page
- Modify colors in `tailwind.config.ts`
- Update branding/logo

### Deploy
- Push to GitHub
- Deploy to Vercel
- Add environment variables
- Done!

## 📚 Documentation

- **Full Setup**: See `SETUP.md`
- **Project Overview**: See `PROJECT_OVERVIEW.md`
- **Features**: See `README.md`

## ❓ Troubleshooting

### "Cannot connect to Supabase"
- Check `.env.local` has correct values
- Ensure no extra spaces in keys
- Restart dev server

### "Database error"
- Verify `schema.sql` ran successfully
- Check all tables were created
- Look for errors in SQL Editor

### TypeScript errors
- Run `npm install` first
- Restart VS Code if needed
- Errors will disappear after install

### Upload not working
- Check Storage bucket exists
- Verify bucket is public
- Check file size under 50MB

## 🆘 Need Help?

Check the console for errors:
- Browser: F12 → Console tab
- Terminal: Look for error messages

Common fixes:
- Restart dev server
- Clear browser cache
- Check environment variables
- Verify Supabase project is active

---

**You're all set! Start creating amazing galleries!** 🎨📸

For detailed documentation, see `README.md` and `SETUP.md`.
