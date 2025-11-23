# Email Sending Setup Guide

Your email template system is ready! Now you just need to connect an email service to actually send emails.

## ✅ What's Already Built

- ✅ Email template manager with 12 templates
- ✅ Send email API endpoint (`/api/send-email`)
- ✅ Email tracking in database
- ✅ Fallback to clipboard if email service not configured

## 🚀 Setup Email Sending (Choose One)

### Option 1: Resend (Recommended)

**Why Resend?**
- Modern, simple API
- 3,000 emails/month FREE
- Great for transactional emails
- Easy setup

**Steps:**

1. **Sign up:** https://resend.com/signup

2. **Verify your domain** (or use their test domain for now)
   - Go to Domains → Add Domain
   - Add DNS records they provide
   - Or use `onboarding@resend.dev` for testing

3. **Get API Key:**
   - Dashboard → API Keys → Create API Key
   - Copy the key (starts with `re_`)

4. **Add to Netlify:**
   ```bash
   netlify env:set RESEND_API_KEY "re_your_key_here"
   ```
   
   Or via Netlify Dashboard:
   - Site settings → Environment variables
   - Add: `RESEND_API_KEY` = your key

5. **Install package:**
   ```bash
   npm install resend
   ```

6. **Update the "from" email** in `/app/api/send-email/route.ts`:
   ```typescript
   from: 'NVision Films <hello@yourdomain.com>'
   ```

7. **Deploy:**
   ```bash
   git add .
   git commit -m "Add Resend email integration"
   netlify deploy --prod
   ```

---

### Option 2: SendGrid

**Why SendGrid?**
- Industry standard
- 100 emails/day FREE
- More features (marketing campaigns, etc.)

**Steps:**

1. **Sign up:** https://sendgrid.com/signup

2. **Create API Key:**
   - Settings → API Keys → Create API Key
   - Full Access

3. **Verify sender email:**
   - Settings → Sender Authentication
   - Verify your email

4. **Install package:**
   ```bash
   npm install @sendgrid/mail
   ```

5. **Update API route** (`/app/api/send-email/route.ts`):
   ```typescript
   import sgMail from '@sendgrid/mail'
   
   sgMail.setApiKey(process.env.SENDGRID_API_KEY!)
   
   export async function POST(request: NextRequest) {
     // ... auth code ...
     
     const msg = {
       to: to,
       from: 'hello@yourdomain.com', // verified sender
       subject: subject,
       html: emailBody.replace(/\n/g, '<br>'),
     }
     
     await sgMail.send(msg)
     
     // ... logging code ...
   }
   ```

6. **Add to Netlify:**
   ```bash
   netlify env:set SENDGRID_API_KEY "SG.your_key_here"
   ```

---

### Option 3: Gmail SMTP (Quick Test)

**For testing only** - not recommended for production

1. **Enable 2FA** on your Gmail account

2. **Create App Password:**
   - Google Account → Security → 2-Step Verification
   - App passwords → Generate

3. **Install nodemailer:**
   ```bash
   npm install nodemailer
   ```

4. **Update API route:**
   ```typescript
   import nodemailer from 'nodemailer'
   
   const transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
       user: process.env.GMAIL_USER,
       pass: process.env.GMAIL_APP_PASSWORD
     }
   })
   
   await transporter.sendMail({
     from: process.env.GMAIL_USER,
     to: to,
     subject: subject,
     html: emailBody.replace(/\n/g, '<br>')
   })
   ```

5. **Add env vars:**
   ```bash
   netlify env:set GMAIL_USER "your@gmail.com"
   netlify env:set GMAIL_APP_PASSWORD "your_app_password"
   ```

---

## 🧪 Testing

Once configured, test by:

1. Go to: `/dashboard/emails`
2. Select a template
3. Enter recipient email
4. Click "Send Email"
5. Check recipient inbox!

## 📊 Email Tracking

All sent emails are logged in the `sent_emails` table with:
- Template used
- Recipient
- Subject & body
- Timestamp
- Status

You can build a "Sent Emails" page later to view history.

---

## 🎯 Recommended: Start with Resend

**Resend is the easiest and most modern option.**

Quick setup:
```bash
# 1. Install
npm install resend

# 2. Add API key to Netlify
netlify env:set RESEND_API_KEY "re_your_key_here"

# 3. Deploy
netlify deploy --prod
```

Then your "Send Email" button will actually send emails! 📧

---

## 💡 Current Behavior (Without Setup)

Right now, if email service isn't configured:
- ✅ Email content is copied to clipboard
- ✅ You get a notification
- ✅ You can paste into Gmail/Outlook manually

This works as a fallback until you set up a proper email service!
