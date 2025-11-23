# CRM Setup Guide - Phase 3

**Goal:** Move from spreadsheets to a real CRM system that tracks the entire customer journey.

---

## Why You Need a CRM in Phase 3

### Phase 0-2 Problems:
- Tracking leads in spreadsheets
- Missing follow-ups
- Can't see pipeline at a glance
- Hard to scale
- No automation

### Phase 3 Solution:
- Centralized customer database
- Automated follow-ups
- Pipeline visibility
- Scalable systems
- Data-driven decisions

---

## Recommended CRM Options

### Option 1: HubSpot (Free Tier)
**Best For:** Small businesses, easy to use, great free tier

**Pros:**
- Free forever for basic features
- Email integration
- Deal pipeline
- Contact management
- Email sequences
- Simple to learn

**Cons:**
- Limited automation on free tier
- Paid tiers get expensive
- Can be overkill for very small operations

**Cost:** Free (paid tiers start at $45/month)

---

### Option 2: Pipedrive
**Best For:** Sales-focused businesses, visual pipeline

**Pros:**
- Visual pipeline (drag and drop)
- Easy to use
- Great mobile app
- Affordable
- Good automation

**Cons:**
- No free tier
- Limited marketing features

**Cost:** $14-$99/month

---

### Option 3: Airtable
**Best For:** DIY approach, highly customizable

**Pros:**
- Flexible (build your own system)
- Affordable
- Great for visual thinkers
- Can integrate with other tools

**Cons:**
- Requires setup time
- Not a "true" CRM
- Less automation

**Cost:** Free (paid tiers start at $10/month)

---

### Option 4: Google Sheets + Zapier (Budget Option)
**Best For:** Bootstrapping, already using Google Workspace

**Pros:**
- Free (except Zapier)
- You already know how to use it
- Highly customizable

**Cons:**
- Manual work
- Limited automation
- Not scalable long-term

**Cost:** Free + Zapier ($20-$50/month for automation)

---

## Recommended: Start with HubSpot Free

**Why:**
- Zero cost to start
- Easy to learn
- Scales with you
- Industry standard
- Great support and resources

---

## HubSpot Setup (Step-by-Step)

### Step 1: Create Account
1. Go to hubspot.com
2. Sign up for free account
3. Choose "CRM" as your primary tool
4. Complete onboarding

### Step 2: Import Existing Contacts
1. Export your current tracking spreadsheet to CSV
2. In HubSpot, go to Contacts > Import
3. Map fields:
   - Name → Contact Name
   - Email → Email
   - Phone → Phone
   - Sport → Custom Property (create it)
   - Status → Deal Stage
   - Notes → Notes

### Step 3: Set Up Deal Pipeline
**Create Pipeline Stages:**
1. **Cold Lead** – Initial outreach, no response yet
2. **Warm Lead** – Responded, interested but not committed
3. **Proposal Sent** – Sent pricing/package info
4. **Negotiation** – Discussing details, price, etc.
5. **Won** – Signed contract, paid deposit
6. **Lost** – Not interested or went with someone else

**For Each Stage, Define:**
- What actions move a lead to this stage?
- What's the next action to move them forward?
- How long should they stay in this stage before follow-up?

### Step 4: Create Custom Properties
**Add These Custom Fields:**
- **Athlete Name** (text)
- **Athlete Age** (number)
- **Sport** (dropdown: Basketball, Football, Soccer, etc.)
- **School/Team** (text)
- **Package Interest** (dropdown: Seasonal, Media Day, Tournament, etc.)
- **Lead Source** (dropdown: Referral, Instagram, Cold Outreach, Event, etc.)
- **Priority Score** (number: 1-10)
- **Last Contact Date** (date)
- **Next Follow-Up Date** (date)

### Step 5: Set Up Email Templates
**Import Your Email Templates:**
1. Go to Conversations > Templates
2. Create templates for:
   - Parent initial contact
   - Coach/AD outreach
   - Follow-ups (1st, 2nd, 3rd)
   - Onboarding
   - Thank you/retention

3. Use merge tags for personalization:
   - `{{contact.firstname}}`
   - `{{contact.athlete_name}}`
   - `{{contact.sport}}`

### Step 6: Create Email Sequences
**Automate Follow-Ups:**

**Sequence 1: Cold Lead Follow-Up**
- Day 0: Initial outreach (manual)
- Day 3: Follow-up #1 (automated)
- Day 7: Follow-up #2 with samples (automated)
- Day 14: Final check-in (automated)

**Sequence 2: Post-Proposal**
- Day 0: Proposal sent (manual)
- Day 3: "Did you get a chance to review?" (automated)
- Day 7: "Any questions?" (automated)
- Day 10: Final check-in (automated)

**Sequence 3: Post-Delivery**
- Day 0: Content delivered (manual)
- Day 2: "Did you get the files?" (automated)
- Day 7: Request testimonial (automated)
- Day 30: Re-engagement for next season (automated)

### Step 7: Set Up Tasks & Reminders
**Create Recurring Tasks:**
- Weekly: Review pipeline
- Weekly: Follow up on all "Warm Leads"
- Monthly: Review won/lost deals
- Monthly: Reach out to past clients

**Set Reminders:**
- When a lead hasn't been contacted in 7 days
- When a proposal has been out for 5+ days with no response
- When a client's season is ending (re-engagement opportunity)

---

## Daily CRM Workflow

### Morning (10 minutes)
1. Check today's tasks
2. Review any new leads from yesterday
3. Check for email responses
4. Plan outreach for the day

### Throughout the Day
1. Log every interaction (call, email, text, meeting)
2. Update deal stages as leads progress
3. Set follow-up reminders
4. Add notes to contacts

### Evening (5 minutes)
1. Review what got done
2. Set tomorrow's tasks
3. Update any deals that moved

---

## Weekly CRM Workflow

### Monday Morning (30 minutes)
1. Review entire pipeline
2. Identify stuck deals
3. Plan week's outreach
4. Set goals for the week

### Friday Afternoon (30 minutes)
1. Review week's activity
2. Update all deal stages
3. Clean up any missing data
4. Plan next week

---

## Key Reports to Track

### 1. Pipeline Report
- How many leads in each stage?
- What's the total value of open deals?
- What's the conversion rate from stage to stage?

### 2. Lead Source Report
- Where are your best leads coming from?
- Which sources convert best?
- Where should you focus your efforts?

### 3. Win/Loss Report
- Why are you winning deals?
- Why are you losing deals?
- What can you improve?

### 4. Activity Report
- How many calls/emails/meetings per week?
- Are you hitting your activity goals?
- Where are you spending your time?

---

## Automation Ideas (Phase 3+)

### Email Automation
- Auto-send follow-ups based on deal stage
- Auto-send onboarding emails after contract signed
- Auto-send retention emails at end of season

### Task Automation
- Auto-create follow-up task when deal moves to "Proposal Sent"
- Auto-create task to check in 30 days after delivery
- Auto-create task when lead hasn't been contacted in 7 days

### Deal Automation
- Auto-move deal to "Lost" if no activity for 30 days
- Auto-tag deals by sport, package type, etc.
- Auto-calculate deal value based on package selected

---

## Integration Ideas

### Connect HubSpot to:
- **Gmail/Outlook:** Log all emails automatically
- **Calendly:** Auto-create contacts when someone books a call
- **Stripe/PayPal:** Track payments and revenue
- **Google Drive:** Attach contracts and deliverables to contacts
- **Zapier:** Connect to other tools (social media, scheduling, etc.)

---

## Migration from Spreadsheets

### Week 1: Setup
- Create HubSpot account
- Set up pipeline stages
- Create custom properties
- Import email templates

### Week 2: Import Data
- Clean up your spreadsheet
- Import contacts
- Create deals for active leads
- Add notes and context

### Week 3: Parallel Run
- Use both spreadsheet and HubSpot
- Get comfortable with HubSpot
- Identify any missing features

### Week 4: Full Migration
- Stop using spreadsheet
- HubSpot is your single source of truth
- Archive spreadsheet as backup

---

## Common Mistakes to Avoid

1. **Not logging interactions** – If it's not in the CRM, it didn't happen
2. **Letting data get stale** – Update regularly or it's useless
3. **Over-complicating** – Start simple, add complexity later
4. **Not using it daily** – CRM only works if you use it
5. **Forgetting to follow up** – Set reminders and tasks

---

## Success Metrics

### After 3 Months with CRM:
- [ ] 100% of leads tracked in CRM
- [ ] Zero missed follow-ups
- [ ] Can see entire pipeline at a glance
- [ ] Conversion rates tracked and improving
- [ ] Email sequences running automatically
- [ ] Weekly reports reviewed and actioned

---

## When to Upgrade

**Consider paid tier when:**
- You're hitting free tier limits (1,000+ contacts)
- You need more automation
- You're hiring and need multiple users
- You want advanced reporting
- You need integrations not available on free tier

---

**Bottom Line:** A CRM is not optional in Phase 3. It's the difference between chaos and control. Start simple, stay consistent, and let it grow with you.
