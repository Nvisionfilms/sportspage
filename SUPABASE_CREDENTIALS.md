# Supabase Credentials for Netlify

Copy these values into your Netlify environment variables:

## NEXT_PUBLIC_SUPABASE_URL
```
https://yumxmkirlvagctcefaaq.supabase.co
```

## NEXT_PUBLIC_SUPABASE_ANON_KEY
```
sb_publishable_xgN9lHNJMgwn2dvLKGzDqQ_hHKJ7R17
```

## SUPABASE_SERVICE_ROLE_KEY
```
sb_secret_1w24I4mSRZgYsRUblYnFKg_Y-t8WAh6
```

---

## How to Add to Netlify

1. Go to: https://app.netlify.com/sites/nvcsports/configuration/env
2. Click on each variable name
3. Paste the corresponding value above
4. Set scope to "All scopes" or "Same value for all deploy contexts"
5. Click "Save"

## After Adding All Variables

1. Go to **Deploys** tab
2. Click **"Trigger deploy"** → **"Clear cache and deploy site"**
3. Wait 2-5 minutes for build to complete
4. Your site will be live at: https://nvcsports.netlify.app

---

## Create Your Admin User

After deployment is complete:

1. Go to: https://supabase.com/dashboard/project/yumxmkirlvagctcefaaq/auth/users
2. Click **"Add user"** → **"Create new user"**
3. Enter your email and password
4. Check **"Auto Confirm User"**
5. Click **"Create user"**

Then login at: https://nvcsports.netlify.app/login

---

**IMPORTANT: Delete this file after you've added the credentials to Netlify!**
This file contains sensitive information and should not be committed to git.
