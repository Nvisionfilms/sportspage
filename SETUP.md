# Setup Guide - Sports Media Gallery

## Quick Start

Follow these steps to get your gallery system up and running.

## 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- Supabase client
- Stripe
- TailwindCSS
- UI components

## 2. Set Up Supabase

### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Fill in project details:
   - Name: Sports Media Gallery
   - Database Password: (save this securely)
   - Region: Choose closest to your users

### Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase/schema.sql`
4. Paste and click "Run"
5. Wait for success message

### Set Up Storage

1. Go to **Storage** in Supabase dashboard
2. Click "Create a new bucket"
3. Name: `galleries`
4. Make it **public**
5. Click "Create bucket"

### Get API Keys

1. Go to **Settings** > **API**
2. Copy these values:
   - Project URL
   - `anon` `public` key
   - `service_role` `secret` key (keep this secure!)

## 3. Configure Environment Variables

1. Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

3. For Stripe (optional, for payments):
   - Go to [stripe.com](https://stripe.com)
   - Get your API keys from Dashboard
   - Add to `.env.local`

## 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 5. Create Your First Account

1. Click "Get Started" or "Sign Up"
2. Fill in your details
3. Select "Photographer" as account type
4. Click "Create Account"

## 6. Create Your First Gallery

1. You'll be redirected to the dashboard
2. Click "New Gallery"
3. Fill in:
   - Title: e.g., "Championship Game 2024"
   - Service Type: Video (Nvision) or Photo (Vincente)
   - Description
   - Privacy settings
4. Click "Create"

## 7. Upload Media

1. Open your new gallery
2. Click "Upload Photos/Videos"
3. Select files from your computer
4. Wait for upload and processing
5. Click "Publish" when ready

## 8. Share Your Gallery

1. Copy the gallery link
2. Share with clients
3. They can:
   - View media
   - Mark favorites
   - Download (if enabled)
   - Order prints (if enabled)

## Troubleshooting

### "Cannot connect to Supabase"
- Check your `.env.local` file has correct values
- Ensure Supabase project is active
- Verify API keys are correct

### "Upload failed"
- Check Storage bucket is created and public
- Verify file size is under 50MB
- Check browser console for errors

### "Database error"
- Ensure schema.sql was run successfully
- Check RLS policies are enabled
- Verify user is authenticated

### TypeScript/Lint Errors
These are expected before running `npm install`. They will resolve once dependencies are installed.

## Production Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Add environment variables from `.env.local`
6. Click "Deploy"

### Set Up Stripe Webhooks (if using payments)

1. In Stripe Dashboard, go to **Developers** > **Webhooks**
2. Click "Add endpoint"
3. URL: `https://yourdomain.com/api/stripe/webhook`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy webhook secret to environment variables

## Next Steps

- Customize product prices in `lib/stripe.ts`
- Add your branding/logo
- Configure email notifications
- Set up custom domain
- Add analytics

## Support

For issues:
- Check the README.md
- Review Supabase logs
- Check browser console
- Verify environment variables

## Security Checklist

- ✅ Never commit `.env.local` to git
- ✅ Use service role key only on server
- ✅ Enable RLS on all tables
- ✅ Use HTTPS in production
- ✅ Rotate API keys periodically
- ✅ Set up CORS properly
- ✅ Validate all user inputs

---

You're all set! Start creating amazing sports media galleries. 🎉
