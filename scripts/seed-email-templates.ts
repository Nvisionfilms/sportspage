import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

const emailTemplates = [
  // OUTREACH TEMPLATES
  {
    name: 'Parent Initial Contact',
    category: 'outreach',
    slug: 'parent-initial-contact',
    subject: 'Capture [Athlete Name]\'s season with NVision Films',
    body: `Hi [Name],

I'm reaching out because I saw [Athlete Name] play [recently/this season] and wanted to introduce you to NVision Films.

We specialize in creating high-quality sports content for student athletes — game highlights, season recaps, and recruiting films that help athletes stand out.

**What we offer:**
- Professional game coverage
- 24-48 hour turnaround
- Highlight reels optimized for social media and recruiting
- Packages starting at $150/game

I'd love to chat about how we can help showcase [Athlete Name]'s talent this season.

Are you available for a quick call this week?

Best,
[Your Name]
NVision Films
[Phone]`,
    variables: ['Name', 'Athlete Name', 'Your Name', 'Phone'],
    usage_notes: 'Use for initial outreach to parents/families. Personalize with athlete name and recent game.',
    active: true
  },
  {
    name: 'Coach / Athletic Director',
    category: 'outreach',
    slug: 'coach-athletic-director',
    subject: 'Media coverage for [School/Team Name]',
    body: `Hi Coach [Name],

I'm [Your Name] with NVision Films, and I wanted to reach out about providing media coverage for your [sport] program at [School/Team Name].

**We specialize in:**
- Team media days (headshots, action shots, team photos)
- Game day coverage and highlight reels
- Season recap videos
- Recruiting film for your athletes

We've worked with [mention any local teams/schools if applicable], and coaches love that we:
✓ Make their athletes look great
✓ Provide content they can use for recruiting and promotion
✓ Turn around content quickly (24-48 hours)

**Pricing:** Team packages start at $750 for a full media day.

Would you be open to a quick call to discuss how we can support your program?

Best,
[Your Name]
NVision Films
[Phone]
[Email]`,
    variables: ['Name', 'School/Team Name', 'sport', 'Your Name', 'Phone', 'Email'],
    usage_notes: 'Use for coaches and athletic directors. Emphasize team benefits and recruiting value.',
    active: true
  },
  {
    name: 'Club / AAU Director',
    category: 'outreach',
    slug: 'club-aau-director',
    subject: 'Professional media for [Club Name]',
    body: `Hi [Name],

I'm [Your Name] with NVision Films. We create professional sports content for club and AAU programs across Central Texas.

I wanted to reach out about providing media coverage for [Club Name].

**What we offer:**
- **Media Days:** Team and individual photos, action shots, highlight reels
- **Tournament Coverage:** Game highlights for your athletes
- **Recruiting Support:** Content optimized for college coaches

**Why clubs love working with us:**
✓ Parents get shareable content within 24-48 hours
✓ Athletes get recruiting-quality highlights
✓ You get promotional content for your program
✓ Flexible packages that fit your budget

**Pricing:** Starting at $750 for a media day (covers entire team)

Would you be interested in setting up a media day for your upcoming season or tournament?

Happy to jump on a quick call to discuss!

Best,
[Your Name]
NVision Films
[Phone]
[Email]`,
    variables: ['Name', 'Club Name', 'Your Name', 'Phone', 'Email'],
    usage_notes: 'Use for club and AAU directors. Emphasize parent satisfaction and recruiting value.',
    active: true
  },

  // FOLLOW-UP TEMPLATES
  {
    name: 'No Response Follow-Up',
    category: 'follow-up',
    slug: 'no-response-follow-up',
    subject: 'Following up — NVision Films',
    body: `Hi [Name],

Just wanted to follow up on my email from last week about sports media coverage for [Athlete Name/Team Name].

I know you're busy, so I'll keep this short:

We create professional highlight reels and recruiting content for student athletes. Quick turnaround, great quality, and parents love the results.

If you're interested, I'd love to send you some samples of our work.

Let me know!

Best,
[Your Name]
[Phone]`,
    variables: ['Name', 'Athlete Name/Team Name', 'Your Name', 'Phone'],
    usage_notes: 'Send 5-7 days after initial contact with no response. Keep it brief and friendly.',
    active: true
  },
  {
    name: 'After Sample Sent',
    category: 'follow-up',
    slug: 'after-sample-sent',
    subject: 'Did you get a chance to check out the samples?',
    body: `Hi [Name],

Just checking in — did you get a chance to look at the sample videos I sent over?

I'd love to hear what you think and answer any questions you might have about our packages.

If you'd like to move forward, we can get started as soon as this weekend!

Best,
[Your Name]
[Phone]`,
    variables: ['Name', 'Your Name', 'Phone'],
    usage_notes: 'Send 3-4 days after sending samples. Gentle nudge to get feedback.',
    active: true
  },
  {
    name: 'After Meeting, No Decision',
    category: 'follow-up',
    slug: 'after-meeting-no-decision',
    subject: 'Next steps for [Team/Athlete Name]',
    body: `Hi [Name],

Great talking with you [yesterday/last week]!

I wanted to follow up on [specific thing discussed: season package / media day / recruiting film].

**Quick recap of what we discussed:**
- [Package/service]
- [Price point]
- [Timeline]

**Next steps:**
If you'd like to move forward, I just need:
1. [Specific info: athlete's schedule, team roster, etc.]
2. [Payment method or deposit]
3. [Any other requirement]

And we can get started [timeframe].

Let me know if you have any questions!

Best,
[Your Name]
[Phone]`,
    variables: ['Name', 'Team/Athlete Name', 'Your Name', 'Phone'],
    usage_notes: '2-3 days after a call or meeting when they seemed interested but didn\'t commit.',
    active: true
  },
  {
    name: 'Final Check-In',
    category: 'follow-up',
    slug: 'final-check-in',
    subject: 'Last check-in from NVision Films',
    body: `Hi [Name],

I wanted to reach out one last time about sports media coverage for [Athlete Name/Team Name].

I know timing isn't always right, and that's totally okay!

If you'd like to revisit this later in the season (or next season), just let me know. I'm always here to help.

Otherwise, I'll take you off my follow-up list so I'm not bugging you.

Thanks for your time!

Best,
[Your Name]
[Phone]`,
    variables: ['Name', 'Athlete Name/Team Name', 'Your Name', 'Phone'],
    usage_notes: 'Final follow-up before marking lead as "cold". Gives them an easy out.',
    active: true
  },

  // ONBOARDING TEMPLATES
  {
    name: 'Welcome - Family Package',
    category: 'onboarding',
    slug: 'welcome-family-package',
    subject: 'Welcome to NVision Films! Here\'s what to expect',
    body: `Hi [Name],

Welcome to NVision Films! We're excited to work with you and [Athlete Name] this season.

**Here's what happens next:**

1. **Schedule:** I'll reach out before each game to confirm I'll be there
2. **Shooting:** I'll capture [Athlete Name] throughout the game
3. **Delivery:** You'll get your highlight reel within 24-48 hours via [delivery method]
4. **Posting:** Feel free to post anywhere! Tag us @nvisionfilms so we can share

**What we need from you:**
- [Athlete Name]'s jersey number: _____
- Game schedule (if you have it)
- Any special requests or focus areas

**Questions?**
Text or call me anytime: [Phone]

Looking forward to an amazing season!

Best,
[Your Name]
NVision Films`,
    variables: ['Name', 'Athlete Name', 'Your Name', 'Phone'],
    usage_notes: 'Send immediately after family signs up for a package. Sets expectations.',
    active: true
  },
  {
    name: 'Welcome - Team Package',
    category: 'onboarding',
    slug: 'welcome-team-package',
    subject: 'Media Day Details for [Team Name]',
    body: `Hi [Name],

Excited to work with [Team Name]! Here are the details for your upcoming media day:

**Media Day Info:**
- **Date:** [Date]
- **Time:** [Time]
- **Location:** [Location]
- **Duration:** Approximately [X] hours

**What we'll capture:**
✓ Individual headshots
✓ Action shots
✓ Team photos
✓ Highlight reel (if applicable)

**What you need to do:**
1. Have athletes arrive in uniform
2. Provide roster with names and jersey numbers
3. Designate a point person for the day

**Delivery:**
- Individual photos: [X] days
- Team photos: [X] days
- Highlight reel: [X] days
- Delivery method: [Dropbox/Google Drive/etc.]

**Questions?**
Call or text: [Phone]

See you on [Date]!

Best,
[Your Name]
NVision Films`,
    variables: ['Name', 'Team Name', 'Date', 'Time', 'Location', 'Your Name', 'Phone'],
    usage_notes: 'Send after booking a team media day. Include all logistics.',
    active: true
  },

  // RETENTION TEMPLATES
  {
    name: 'End of Season Thank You',
    category: 'retention',
    slug: 'end-of-season-thank-you',
    subject: 'Thanks for an amazing season, [Name]!',
    body: `Hi [Name],

What a season! It was awesome capturing [Athlete Name]'s highlights this year.

I hope the content helped showcase [his/her] talent and that you got some great memories to look back on.

**Want to keep the momentum going?**

If [Athlete Name] plays [off-season sport/club ball/etc.], I'd love to continue working with you!

**Or, if you know other families who might be interested**, I'm offering a referral bonus:
→ Refer a family, and you both get [discount/free game/etc.]

Thanks again for trusting NVision Films with [Athlete Name]'s season!

Best,
[Your Name]
[Phone]`,
    variables: ['Name', 'Athlete Name', 'Your Name', 'Phone'],
    usage_notes: 'Send at end of season. Thank them and offer re-booking or referral incentive.',
    active: true
  },
  {
    name: 'Off-Season Check-In',
    category: 'retention',
    slug: 'off-season-check-in',
    subject: 'Off-season content for [Athlete Name]?',
    body: `Hi [Name],

Hope [Athlete Name] is enjoying the off-season!

I wanted to reach out because we're offering some off-season content options:

✓ Training montages
✓ Skills showcases
✓ Updated recruiting films
✓ [Other relevant content]

If [Athlete Name] is training or playing club ball, this is a great time to build [his/her] recruiting profile.

Interested? Let me know and we can set something up!

Best,
[Your Name]
[Phone]`,
    variables: ['Name', 'Athlete Name', 'Your Name', 'Phone'],
    usage_notes: 'Send during off-season to re-engage past clients with new offerings.',
    active: true
  },
  {
    name: 'Re-Engagement (Cold Lead)',
    category: 'retention',
    slug: 're-engagement-cold-lead',
    subject: 'New packages for [upcoming season]',
    body: `Hi [Name],

It's been a while! I wanted to reach out because we've added some new packages for the [upcoming season].

**What's new:**
- [New package or offering]
- [Improved turnaround time / new feature]
- [Special pricing for returning clients]

If you're interested in coverage for [Athlete Name] this season, I'd love to chat.

No pressure — just wanted to make sure you knew we're here if you need us!

Best,
[Your Name]
[Phone]`,
    variables: ['Name', 'Athlete Name', 'upcoming season', 'Your Name', 'Phone'],
    usage_notes: 'Re-engage cold leads with new offerings. Keep it light and no-pressure.',
    active: true
  }
]

async function seedEmailTemplates() {
  console.log('Seeding email templates...')

  for (const template of emailTemplates) {
    const { error } = await supabase
      .from('email_templates')
      .upsert(template, { onConflict: 'slug' })

    if (error) {
      console.error(`Error seeding ${template.name}:`, error)
    } else {
      console.log(`✓ Seeded: ${template.name}`)
    }
  }

  console.log('Email templates seeded successfully!')
}

seedEmailTemplates()
