# Deployment Guide

## 🚀 Complete Application - Ready to Deploy!

Your sports media gallery application is now **fully functional** with all features implemented and security hardened.

## ✅ What's Been Built

### Core Features
- ✅ **Authentication System** - Login/signup with role-based access
- ✅ **Gallery Management** - Create, edit, delete galleries
- ✅ **File Upload** - Drag & drop with validation and security
- ✅ **Public Gallery View** - Beautiful client-facing galleries
- ✅ **Favorites System** - Client can mark favorites
- ✅ **Downloads** - Secure file downloads with signed URLs
- ✅ **Order System** - Print/product ordering with Stripe
- ✅ **Dashboard** - Complete owner dashboard
- ✅ **Security** - Rate limiting, input validation, RLS, secure headers

### Security Features
- ✅ Row Level Security (RLS) on all tables
- ✅ Rate limiting on all API routes
- ✅ Input sanitization and validation
- ✅ File upload security (type/size validation)
- ✅ Password hashing (bcrypt)
- ✅ Secure HTTP headers
- ✅ CSRF protection
- ✅ XSS prevention
- ✅ SQL injection prevention (via Supabase)

## 📦 What You Need to Provide

### 1. Stripe Account (Optional - for payments)

**If you want to enable print/product orders:**

1. **Sign up at** [stripe.com](https://stripe.com)
2. **Get your API keys:**
   - Go to Developers → API keys
   - Copy **Publishable key** (starts with `pk_`)
   - Copy **Secret key** (starts with `sk_`)
3. **Set up webhook:**
   - Go to Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy **Webhook secret** (starts with `whsec_`)

**Add to `.env.local`:**
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**If you don't want payments yet:**
- Leave Stripe variables empty
- Set `allow_orders: false` when creating galleries
- You can add Stripe later

### 2. Storage Bucket (Already Done!)

You've already created the `galleries` bucket in Supabase. ✅

### 3. Domain Name (For Production)

**For production deployment:**
- Purchase a domain (Namecheap, GoDaddy, etc.)
- Or use Vercel's free subdomain: `your-app.vercel.app`

## 🌐 Deployment Options

### Option 1: Vercel (Recommended - Easiest)

**Why Vercel:**
- Made by Next.js creators
- Zero configuration
- Automatic HTTPS
- Global CDN
- Free tier available

**Steps:**

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/Nvisionfilms/sportspage.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables**
   In Vercel dashboard → Settings → Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (if using Stripe)
   STRIPE_SECRET_KEY (if using Stripe)
   STRIPE_WEBHOOK_SECRET (if using Stripe)
   NEXT_PUBLIC_APP_URL (your Vercel URL)
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app is live! 🎉

5. **Update Stripe Webhook** (if using)
   - Update webhook URL to: `https://your-app.vercel.app/api/stripe/webhook`

### Option 2: Netlify

**Steps:**

1. **Push to GitHub** (same as above)

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Select GitHub repository

3. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

4. **Add Environment Variables**
   Same as Vercel

5. **Deploy**

### Option 3: Self-Hosted (VPS)

**Requirements:**
- Ubuntu/Debian server
- Node.js 18+
- PM2 or similar process manager
- Nginx reverse proxy
- SSL certificate (Let's Encrypt)

**Not recommended for beginners** - use Vercel instead.

## 🔧 Post-Deployment Setup

### 1. Test Everything

**Authentication:**
- [ ] Sign up works
- [ ] Login works
- [ ] Sign out works
- [ ] Dashboard loads

**Gallery Management:**
- [ ] Create gallery
- [ ] Upload files
- [ ] Publish gallery
- [ ] View public gallery
- [ ] Edit gallery
- [ ] Delete gallery

**Client Features:**
- [ ] View gallery
- [ ] Add favorites
- [ ] Download files
- [ ] Password protection (if enabled)

**Payments (if enabled):**
- [ ] Add items to cart
- [ ] Checkout flow
- [ ] Test payment (use Stripe test cards)
- [ ] Webhook receives events
- [ ] Order status updates

### 2. Configure Supabase for Production

**Update RLS Policies (if needed):**
- Review policies in Supabase dashboard
- Ensure they match your security requirements

**Set up Email Templates:**
- Go to Authentication → Email Templates
- Customize signup/reset password emails
- Add your branding

**Configure Storage:**
- Review bucket policies
- Set up CDN (optional)
- Configure file size limits

### 3. Set Up Monitoring

**Recommended Tools:**

**Error Tracking:**
```bash
npm install @sentry/nextjs
```
Then configure Sentry for error tracking.

**Analytics:**
- Google Analytics
- Vercel Analytics (built-in)
- Plausible (privacy-friendly)

**Uptime Monitoring:**
- UptimeRobot (free)
- Pingdom
- StatusCake

### 4. Performance Optimization

**Enable in Production:**

1. **Image Optimization**
   - Next.js Image component (already used)
   - Supabase CDN for storage

2. **Caching**
   - Static page caching
   - API route caching (where appropriate)

3. **CDN**
   - Vercel Edge Network (automatic)
   - Cloudflare (optional additional layer)

## 🔒 Security Checklist

Before going live:

- [ ] All environment variables set
- [ ] `.env.local` not committed to git
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Stripe webhook secret configured
- [ ] RLS enabled on all Supabase tables
- [ ] Rate limiting tested
- [ ] File upload limits tested
- [ ] Error messages don't expose sensitive data
- [ ] Security headers configured (automatic via middleware)

## 📊 Monitoring & Maintenance

### Daily
- Check error logs
- Monitor uptime
- Review Stripe dashboard (if applicable)

### Weekly
- Review Supabase usage
- Check storage usage
- Review user feedback

### Monthly
- Update dependencies: `npm update`
- Review security: `npm audit`
- Backup database
- Review analytics

## 🆘 Troubleshooting

### "Cannot connect to Supabase"
- Verify environment variables
- Check Supabase project is active
- Verify RLS policies

### "Upload failed"
- Check storage bucket exists
- Verify bucket is public
- Check file size limits
- Review browser console

### "Payment failed"
- Verify Stripe keys (test vs live)
- Check webhook is receiving events
- Review Stripe dashboard logs

### "Gallery not found"
- Check gallery is published
- Verify slug is correct
- Check RLS policies

## 📈 Scaling Considerations

### When you grow:

**Database:**
- Upgrade Supabase plan
- Add database indexes
- Implement caching

**Storage:**
- Upgrade storage plan
- Implement CDN
- Add image optimization service

**Rate Limiting:**
- Migrate from in-memory to Redis
- Implement distributed rate limiting

**Performance:**
- Add Redis for caching
- Implement queue for file processing
- Use background jobs for heavy tasks

## 💰 Cost Estimate

### Free Tier (Good for starting):
- **Vercel**: Free (hobby plan)
- **Supabase**: Free (500MB database, 1GB storage)
- **Stripe**: Free (pay per transaction)
- **Total**: $0/month + Stripe fees

### Small Business (100-1000 users):
- **Vercel**: $20/month (Pro plan)
- **Supabase**: $25/month (Pro plan)
- **Stripe**: Transaction fees only
- **Total**: ~$45/month + Stripe fees

### Growing Business (1000+ users):
- **Vercel**: $20-50/month
- **Supabase**: $25-100/month
- **Monitoring**: $20/month
- **Total**: ~$65-170/month

## 🎉 You're Ready!

Your application is **production-ready** with:
- ✅ All features implemented
- ✅ Security hardened
- ✅ Error handling
- ✅ Rate limiting
- ✅ Documentation complete

**Next Steps:**
1. Test locally: `npm run dev`
2. Push to GitHub
3. Deploy to Vercel
4. Add Stripe keys (if needed)
5. Start creating galleries!

---

**Need Help?**
- Check `SECURITY.md` for security details
- Check `README.md` for feature documentation
- Check `QUICKSTART.md` for setup help
- Review code comments for implementation details

**Good luck with your sports media business! 📸🎥**
