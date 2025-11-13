# ✅ Launch Checklist

## Pre-Launch Testing

### Local Testing (Do This First!)

- [ ] **Install dependencies** (already done ✅)
  ```bash
  npm install
  ```

- [ ] **Create storage bucket in Supabase**
  - Go to Storage → New bucket
  - Name: `galleries`
  - Make it Public ✅

- [ ] **Start development server**
  ```bash
  npm run dev
  ```

- [ ] **Test Authentication**
  - [ ] Sign up as photographer
  - [ ] Log out
  - [ ] Log back in
  - [ ] Dashboard loads

- [ ] **Test Gallery Creation**
  - [ ] Click "New Gallery"
  - [ ] Fill in title and description
  - [ ] Choose service type (Photo or Video)
  - [ ] Set privacy settings
  - [ ] Create gallery
  - [ ] Redirects to gallery edit page

- [ ] **Test File Upload**
  - [ ] Drag and drop images/videos
  - [ ] Files upload successfully
  - [ ] Thumbnails appear
  - [ ] No errors in console

- [ ] **Test Gallery Publishing**
  - [ ] Click "Publish" button
  - [ ] Status changes to "published"
  - [ ] "View Live" button appears
  - [ ] Can copy share link

- [ ] **Test Public Gallery View**
  - [ ] Open gallery link in new tab/incognito
  - [ ] Gallery loads correctly
  - [ ] Images display properly
  - [ ] Responsive on mobile

- [ ] **Test Favorites**
  - [ ] Click heart icon on images
  - [ ] Favorites bar appears at bottom
  - [ ] Count updates correctly
  - [ ] Can unfavorite

- [ ] **Test Downloads**
  - [ ] Click download icon
  - [ ] File downloads successfully
  - [ ] Signed URL works

- [ ] **Test Password Protection** (if using)
  - [ ] Create private gallery
  - [ ] Set password
  - [ ] Open in incognito
  - [ ] Password prompt appears
  - [ ] Correct password grants access

---

## Deployment Preparation

### GitHub Setup

- [ ] **Initialize Git** (if not done)
  ```bash
  git init
  git add .
  git commit -m "Initial commit - Complete sports media gallery"
  ```

- [ ] **Push to GitHub**
  ```bash
  git remote add origin https://github.com/Nvisionfilms/sportspage.git
  git branch -M main
  git push -u origin main
  ```

- [ ] **Verify `.gitignore`**
  - [ ] `.env.local` is excluded ✅
  - [ ] `node_modules` is excluded ✅
  - [ ] No secrets in repository

### Vercel Deployment

- [ ] **Sign up at vercel.com**
  - Use GitHub account for easy integration

- [ ] **Import Project**
  - Click "New Project"
  - Select your GitHub repository
  - Vercel auto-detects Next.js ✅

- [ ] **Add Environment Variables**
  Copy from your `.env.local`:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `NEXT_PUBLIC_APP_URL` (your Vercel URL)
  - [ ] `NODE_ENV=production`

- [ ] **Deploy**
  - Click "Deploy"
  - Wait 2-3 minutes
  - Note your deployment URL

- [ ] **Update App URL**
  - Update `NEXT_PUBLIC_APP_URL` to your Vercel URL
  - Redeploy

---

## Stripe Setup (Optional - Skip if not using payments)

### Only if you want print/product orders:

- [ ] **Create Stripe Account**
  - Sign up at stripe.com
  - Complete business verification

- [ ] **Get API Keys**
  - Go to Developers → API keys
  - [ ] Copy Publishable key (`pk_test_...`)
  - [ ] Copy Secret key (`sk_test_...`)

- [ ] **Add to Vercel**
  - Go to Vercel → Settings → Environment Variables
  - [ ] Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - [ ] Add `STRIPE_SECRET_KEY`
  - Redeploy

- [ ] **Set Up Webhook**
  - Go to Stripe → Developers → Webhooks
  - Add endpoint: `https://your-app.vercel.app/api/stripe/webhook`
  - Select events:
    - [ ] `payment_intent.succeeded`
    - [ ] `payment_intent.payment_failed`
  - [ ] Copy webhook secret (`whsec_...`)
  - [ ] Add to Vercel as `STRIPE_WEBHOOK_SECRET`
  - Redeploy

- [ ] **Test Payment**
  - Use test card: `4242 4242 4242 4242`
  - Any future expiry date
  - Any 3-digit CVC
  - Verify order status updates

---

## Post-Deployment Testing

### Test on Production

- [ ] **Visit your live URL**
  - https://your-app.vercel.app

- [ ] **Create Test Account**
  - [ ] Sign up works
  - [ ] Email confirmation (if enabled)
  - [ ] Can log in

- [ ] **Create Test Gallery**
  - [ ] Upload test images
  - [ ] Publish gallery
  - [ ] Share link works

- [ ] **Test from Mobile**
  - [ ] Open on phone
  - [ ] Gallery loads
  - [ ] Images display
  - [ ] Favorites work
  - [ ] Downloads work

- [ ] **Test from Different Browser**
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge

---

## Security Verification

- [ ] **Check Environment Variables**
  - [ ] No secrets in GitHub
  - [ ] All secrets in Vercel only
  - [ ] `.env.local` in `.gitignore`

- [ ] **Test Rate Limiting**
  - [ ] Try rapid API calls
  - [ ] Should get 429 error after limit

- [ ] **Test Authentication**
  - [ ] Can't access dashboard without login
  - [ ] Can't access other users' galleries
  - [ ] Can't upload to others' galleries

- [ ] **Test File Upload Security**
  - [ ] Try uploading .exe file (should fail)
  - [ ] Try uploading huge file (should fail)
  - [ ] Try path traversal in filename (should be sanitized)

- [ ] **Check HTTPS**
  - [ ] All pages use HTTPS
  - [ ] No mixed content warnings
  - [ ] Security headers present (check browser dev tools)

---

## Monitoring Setup

### Recommended (Optional but Good)

- [ ] **Set Up Error Tracking**
  - Install Sentry or similar
  - Track errors in production

- [ ] **Set Up Uptime Monitoring**
  - UptimeRobot (free)
  - Get alerts if site goes down

- [ ] **Set Up Analytics**
  - Vercel Analytics (built-in)
  - Or Google Analytics

---

## Business Preparation

### Before Sharing with Clients

- [ ] **Create Sample Gallery**
  - Upload high-quality sample images
  - Show off your best work
  - Use as demo for potential clients

- [ ] **Prepare Pricing**
  - Decide on print prices
  - Update `lib/stripe.ts` if needed
  - Test checkout flow

- [ ] **Create Terms of Service**
  - Usage terms
  - Copyright notice
  - Refund policy

- [ ] **Prepare Client Instructions**
  - How to view gallery
  - How to download
  - How to order prints

---

## Launch Day! 🚀

- [ ] **Final Test**
  - [ ] Everything works
  - [ ] No errors in console
  - [ ] Mobile responsive
  - [ ] Fast loading

- [ ] **Share with First Client**
  - [ ] Create their gallery
  - [ ] Upload their media
  - [ ] Send them the link
  - [ ] Get feedback

- [ ] **Monitor**
  - [ ] Check error logs
  - [ ] Watch for issues
  - [ ] Respond to feedback

---

## Post-Launch

### Week 1

- [ ] **Monitor Daily**
  - Check error logs
  - Review user feedback
  - Fix any issues

- [ ] **Gather Feedback**
  - Ask clients what they think
  - Note feature requests
  - Document bugs

### Week 2-4

- [ ] **Optimize**
  - Improve slow pages
  - Fix reported bugs
  - Add requested features

- [ ] **Marketing**
  - Share on social media
  - Add to portfolio
  - Tell other photographers

---

## Maintenance Schedule

### Weekly
- [ ] Check error logs
- [ ] Review Supabase usage
- [ ] Check storage usage
- [ ] Respond to support requests

### Monthly
- [ ] Update dependencies: `npm update`
- [ ] Run security audit: `npm audit`
- [ ] Review analytics
- [ ] Backup database

### Quarterly
- [ ] Review and update pricing
- [ ] Add new features
- [ ] Optimize performance
- [ ] Update documentation

---

## 🎉 You're Ready!

Once you've checked off all the items above, you're ready to launch your sports media gallery business!

**Remember:**
- Start small, test thoroughly
- Get feedback from real users
- Iterate and improve
- Scale as you grow

**Good luck! 📸🎥**
