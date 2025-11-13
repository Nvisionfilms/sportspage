# Security Documentation

## 🔒 Security Features Implemented

### 1. Authentication & Authorization

**Supabase Auth Integration**
- Email/password authentication with secure session management
- Row Level Security (RLS) on all database tables
- Role-based access control (owner/client)
- Server-side authentication verification for all protected routes

**API Route Protection**
- `requireAuth()` - Verifies user is authenticated
- `requireOwner()` - Verifies user has owner role
- All sensitive operations require authentication

### 2. Rate Limiting

**Implemented in `/lib/security.ts`**
- API endpoints have rate limits to prevent abuse
- Different limits for different operations:
  - General API calls: 100 requests/minute
  - Gallery creation: 20 requests/minute
  - File uploads: 10 requests/minute
  - Downloads: 20 requests/minute

**Production Note**: Current implementation uses in-memory storage. For production, migrate to Redis or similar distributed cache.

### 3. Input Validation & Sanitization

**All user inputs are validated:**
- `sanitizeInput()` - Removes XSS attempts, limits length
- `sanitizeFilename()` - Prevents path traversal attacks
- `isValidEmail()` - Validates email format
- Type checking on all API parameters

**File Upload Security:**
- File type validation (whitelist approach)
- File size limits (50MB default)
- Filename sanitization
- Secure storage paths

### 4. Data Protection

**Password Security:**
- Gallery passwords hashed with bcrypt (10 rounds)
- Never stored in plain text
- Verified server-side only

**Sensitive Data:**
- Service role key never exposed to client
- API keys in environment variables only
- `.env.local` excluded from git

**Database Security:**
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Public galleries have specific access policies
- Cascade deletes prevent orphaned data

### 5. HTTP Security Headers

**Implemented in `middleware.ts`:**
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security (production only)
```

### 6. CORS & Origin Validation

- Origin checking for API requests
- Secure headers on all API responses
- CSRF protection via SameSite cookies (Supabase)

### 7. Payment Security

**Stripe Integration:**
- PCI-compliant payment processing
- Client-side tokenization (no card data touches server)
- Webhook signature verification
- Secure payment intent creation
- Order status tracking

### 8. File Storage Security

**Supabase Storage:**
- Signed URLs with expiration (1 hour)
- Public/private bucket separation
- File access logging
- No direct file URL exposure for downloads

## 🚨 Security Best Practices

### Environment Variables

**Never commit these to git:**
```bash
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
```

**Verify `.gitignore` includes:**
```
.env*.local
.env
```

### Database Access

**Always use RLS policies:**
- Never bypass RLS with service role key on client
- Service role key only used in API routes
- All client queries use anon key with RLS

### API Routes

**Security checklist for each route:**
- ✅ Rate limiting implemented
- ✅ Authentication required (if needed)
- ✅ Input validation
- ✅ Error handling (no sensitive info in errors)
- ✅ Secure headers in response

### File Uploads

**Validation checklist:**
- ✅ File type whitelist
- ✅ File size limit
- ✅ Filename sanitization
- ✅ Ownership verification
- ✅ Storage quota checks (future)

## 🔐 Deployment Security

### Production Checklist

**Before deploying:**

1. **Environment Variables**
   - [ ] All secrets set in hosting platform
   - [ ] `NODE_ENV=production`
   - [ ] HTTPS URLs only
   - [ ] Webhook secrets configured

2. **Database**
   - [ ] RLS enabled on all tables
   - [ ] Service role key secured
   - [ ] Backup strategy in place
   - [ ] Connection pooling configured

3. **API Security**
   - [ ] Rate limiting with Redis/distributed cache
   - [ ] CORS properly configured
   - [ ] Error logging (no sensitive data)
   - [ ] API monitoring enabled

4. **Stripe**
   - [ ] Live keys (not test keys)
   - [ ] Webhook endpoint configured
   - [ ] Webhook secret set
   - [ ] Payment flow tested

5. **Storage**
   - [ ] Bucket policies reviewed
   - [ ] File size limits enforced
   - [ ] CDN configured (optional)
   - [ ] Backup strategy

6. **Monitoring**
   - [ ] Error tracking (Sentry, etc.)
   - [ ] Uptime monitoring
   - [ ] Security alerts
   - [ ] Audit logging

## 🛡️ Security Incident Response

### If Credentials Are Compromised

**Immediate actions:**

1. **Supabase Keys**
   - Rotate API keys in Supabase dashboard
   - Update environment variables
   - Redeploy application
   - Review access logs

2. **Stripe Keys**
   - Rotate API keys in Stripe dashboard
   - Update environment variables
   - Review recent transactions
   - Contact Stripe support if needed

3. **User Data Breach**
   - Notify affected users
   - Force password resets
   - Review audit logs
   - Document incident

### Monitoring for Attacks

**Watch for:**
- Unusual rate limit hits
- Failed authentication attempts
- Suspicious file uploads
- Abnormal database queries
- Payment fraud attempts

## 📋 Security Audit Checklist

### Monthly Review

- [ ] Review access logs
- [ ] Check for dependency vulnerabilities (`npm audit`)
- [ ] Verify RLS policies
- [ ] Test authentication flows
- [ ] Review error logs
- [ ] Check rate limit effectiveness

### Quarterly Review

- [ ] Penetration testing
- [ ] Security dependency updates
- [ ] Review and rotate secrets
- [ ] Audit user permissions
- [ ] Review backup procedures
- [ ] Update security documentation

## 🔧 Security Tools

### Recommended Tools

**Development:**
- `npm audit` - Check for vulnerable dependencies
- ESLint security plugins
- Git secrets scanning

**Production:**
- Sentry - Error tracking
- Cloudflare - DDoS protection
- Uptime monitoring
- Log aggregation (Datadog, LogRocket)

## 📞 Security Contacts

**Report Security Issues:**
- Create private security advisory on GitHub
- Email: security@yourdomain.com (set this up)
- Response time: 24-48 hours

## 🔄 Security Updates

**Stay Updated:**
- Subscribe to Supabase security advisories
- Monitor Next.js security releases
- Follow Stripe security blog
- Keep dependencies updated

---

**Last Updated:** November 2024  
**Next Review:** December 2024

## ⚠️ Known Limitations

1. **Rate Limiting**: In-memory storage (needs Redis for production)
2. **File Processing**: No thumbnail generation yet
3. **ZIP Downloads**: Not implemented (security consideration for large files)
4. **2FA**: Not implemented (future enhancement)
5. **IP Blocking**: Manual process (needs automation)

## 🎯 Future Security Enhancements

- [ ] Two-factor authentication (2FA)
- [ ] IP-based blocking/allowlisting
- [ ] Advanced rate limiting with Redis
- [ ] Automated security scanning
- [ ] Content Security Policy (CSP)
- [ ] Subresource Integrity (SRI)
- [ ] Advanced audit logging
- [ ] Automated backup verification
