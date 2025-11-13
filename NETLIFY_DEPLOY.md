# Netlify Deployment Guide

## 🚀 Deploy to Netlify from GitHub

### Prerequisites
- ✅ Code pushed to GitHub: https://github.com/Nvisionfilms/sportspage
- ✅ Netlify account (free tier available)

---

## Step 1: Connect to Netlify

### Option A: One-Click Deploy Button

Add this badge to your GitHub README for easy deployment:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Nvisionfilms/sportspage)

### Option B: Manual Deployment

1. **Go to Netlify**
   - Visit [netlify.com](https://netlify.com)
   - Sign up or log in with GitHub

2. **Import Project**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify to access your repositories
   - Select `Nvisionfilms/sportspage`

3. **Configure Build Settings**
   
   Netlify should auto-detect these settings from `netlify.toml`:
   ```
   Build command: npm run build
   Publish directory: .next
   ```

4. **Add Environment Variables**
   
   Click "Show advanced" → "New variable" and add:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://yumxmkirlvagctcefaaq.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_APP_URL=https://your-site.netlify.app
   NODE_ENV=production
   ```

   **Optional (if using Stripe):**
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

5. **Deploy**
   - Click "Deploy site"
   - Wait 2-3 minutes for build to complete
   - Your site will be live at: `https://random-name.netlify.app`

---

## Step 2: Custom Domain (Optional)

### Use Netlify Subdomain
1. Go to Site settings → Domain management
2. Click "Options" → "Edit site name"
3. Change to: `nvision-sports` or similar
4. Your URL becomes: `https://nvision-sports.netlify.app`

### Use Your Own Domain
1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Enter your domain (e.g., `gallery.nvisionfilms.com`)
4. Follow DNS configuration instructions
5. Netlify provides free SSL certificate

---

## Step 3: Configure Netlify Plugin

The `netlify.toml` file already includes Next.js plugin configuration.

**Verify it's installed:**
1. Go to Site settings → Plugins
2. You should see "@netlify/plugin-nextjs"
3. If not, click "Install plugin" and search for it

---

## Step 4: Update App URL

After deployment:

1. **Get your Netlify URL**
   - Example: `https://nvision-sports.netlify.app`

2. **Update Environment Variable**
   - Go to Site settings → Environment variables
   - Update `NEXT_PUBLIC_APP_URL` to your Netlify URL
   - Click "Save"

3. **Trigger Redeploy**
   - Go to Deploys
   - Click "Trigger deploy" → "Deploy site"

---

## Step 5: Set Up Stripe Webhook (If Using)

1. **Get Webhook URL**
   - Your webhook endpoint: `https://your-site.netlify.app/api/stripe/webhook`

2. **Configure in Stripe**
   - Go to Stripe Dashboard → Developers → Webhooks
   - Click "Add endpoint"
   - URL: `https://your-site.netlify.app/api/stripe/webhook`
   - Select events:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
   - Copy webhook secret

3. **Add to Netlify**
   - Go to Site settings → Environment variables
   - Add `STRIPE_WEBHOOK_SECRET` with the value
   - Redeploy site

---

## Step 6: Test Your Deployment

### Checklist:

- [ ] Site loads at Netlify URL
- [ ] Landing page displays correctly
- [ ] Can sign up / log in
- [ ] Dashboard loads
- [ ] Can create gallery
- [ ] Can upload files
- [ ] Public gallery view works
- [ ] Favorites work
- [ ] Downloads work
- [ ] Payments work (if enabled)

---

## Continuous Deployment

### Automatic Deploys

Netlify automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Netlify will:
1. Detect the push
2. Build your site
3. Deploy automatically
4. Usually takes 2-3 minutes

### Deploy Previews

Every pull request gets a preview URL:
- Create a branch
- Make changes
- Open pull request
- Netlify creates preview deployment
- Test before merging

---

## Netlify Features

### Included Free:
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Continuous deployment
- ✅ Deploy previews
- ✅ Form handling
- ✅ Serverless functions
- ✅ 100GB bandwidth/month
- ✅ 300 build minutes/month

### Monitoring:
- View deploy logs
- Check build status
- Monitor bandwidth usage
- Review function logs

---

## Troubleshooting

### Build Fails

**Check build logs:**
1. Go to Deploys
2. Click failed deploy
3. View logs

**Common issues:**
- Missing environment variables
- Node version mismatch (set to 18 in netlify.toml)
- Dependency errors

**Fix:**
- Add missing env vars
- Check `netlify.toml` settings
- Clear cache and redeploy

### Site Not Loading

**Check:**
- Build succeeded
- Environment variables set
- NEXT_PUBLIC_APP_URL is correct
- No errors in function logs

### API Routes Not Working

**Verify:**
- Netlify Next.js plugin installed
- Environment variables include all secrets
- Function logs for errors

### Stripe Webhook Fails

**Check:**
- Webhook URL is correct
- Webhook secret matches Netlify env var
- Events are selected in Stripe
- Function logs for errors

---

## Performance Optimization

### Enable Features:

1. **Asset Optimization**
   - Site settings → Build & deploy → Post processing
   - Enable "Bundle CSS" and "Minify JS"

2. **Image Optimization**
   - Already handled by Next.js Image component

3. **Caching**
   - Already configured in `netlify.toml`

---

## Monitoring & Analytics

### Netlify Analytics (Paid)
- Server-side analytics
- No client-side scripts
- Privacy-friendly
- $9/month per site

### Free Alternatives:
- Vercel Analytics
- Google Analytics
- Plausible Analytics
- Simple Analytics

---

## Comparison: Netlify vs Vercel

### Netlify Pros:
- ✅ Great for static sites
- ✅ Excellent form handling
- ✅ Good free tier
- ✅ Easy custom domains

### Vercel Pros:
- ✅ Made by Next.js team
- ✅ Better Next.js optimization
- ✅ Edge functions
- ✅ Better serverless performance

### Recommendation:
Both work great! Choose based on:
- **Netlify**: If you prefer their UI/workflow
- **Vercel**: If you want best Next.js performance

---

## Cost Estimate

### Free Tier (Good for starting):
- 100GB bandwidth
- 300 build minutes
- Unlimited sites
- **Cost: $0/month**

### Pro Plan (Growing business):
- 400GB bandwidth
- 1000 build minutes
- Analytics included
- **Cost: $19/month**

---

## Security on Netlify

### Automatic:
- ✅ HTTPS/SSL certificates
- ✅ DDoS protection
- ✅ Security headers (configured in netlify.toml)

### Manual Setup:
- [ ] Environment variable encryption (automatic)
- [ ] Access control (paid feature)
- [ ] Password protection (paid feature)

---

## Support Resources

- [Netlify Docs](https://docs.netlify.com)
- [Next.js on Netlify](https://docs.netlify.com/frameworks/next-js/)
- [Netlify Community](https://answers.netlify.com)
- [Status Page](https://status.netlify.com)

---

## Quick Commands

### Local Netlify CLI (Optional)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Link to site
netlify link

# Deploy preview
netlify deploy

# Deploy to production
netlify deploy --prod

# View logs
netlify logs

# Open site
netlify open
```

---

## 🎉 You're Live on Netlify!

Your sports media gallery is now deployed and accessible worldwide!

**Next Steps:**
1. Share your Netlify URL with clients
2. Set up custom domain (optional)
3. Monitor performance
4. Scale as you grow

**Your site:** `https://your-site.netlify.app`

---

**Need help?** Check the troubleshooting section or Netlify docs.

**Good luck! 🚀**
