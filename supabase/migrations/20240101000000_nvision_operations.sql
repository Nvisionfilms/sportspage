-- NVision Operations System Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- LEADS & CRM
-- ============================================

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contact Info
  contact_name TEXT NOT NULL,
  athlete_name TEXT,
  email TEXT,
  phone TEXT,
  
  -- Details
  age INTEGER,
  sport TEXT,
  school_club TEXT,
  city TEXT,
  
  -- Lead Source
  contact_method TEXT, -- Instagram DM, Email, Phone, Referral, etc.
  referral_source TEXT,
  
  -- Status
  status TEXT DEFAULT 'new', -- new, warm, hot, cold, converted, lost
  lead_score INTEGER DEFAULT 5, -- 1-10
  
  -- Notes
  notes TEXT,
  next_follow_up_date DATE,
  
  -- Tracking
  interactions_count INTEGER DEFAULT 0,
  last_interaction_date TIMESTAMP WITH TIME ZONE,
  
  -- Conversion
  converted_to_client BOOLEAN DEFAULT FALSE,
  conversion_date TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- INTERACTIONS (CRM Activity Log)
-- ============================================

CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  
  interaction_type TEXT NOT NULL, -- email, call, meeting, dm, text
  interaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  subject TEXT,
  notes TEXT,
  outcome TEXT, -- interested, not_interested, follow_up_needed, converted
  
  next_action TEXT,
  next_action_date DATE
);

-- ============================================
-- SERVICE PACKAGES
-- ============================================

CREATE TABLE service_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT, -- family, team, tournament, multi-year
  
  description TEXT,
  features JSONB, -- Array of features/deliverables
  
  -- Pricing
  base_price DECIMAL(10,2),
  price_tiers JSONB, -- For different tier options
  
  -- Settings
  active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  
  -- Terms
  terms TEXT,
  cancellation_policy TEXT
);

-- ============================================
-- CLIENT CONTRACTS
-- ============================================

CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Parties
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  athlete_name TEXT,
  
  -- Contract Details
  contract_type TEXT, -- family, team
  package_id UUID REFERENCES service_packages(id),
  
  -- Services
  services_description TEXT,
  schedule TEXT,
  deliverables JSONB,
  
  -- Payment
  total_amount DECIMAL(10,2),
  payment_structure TEXT,
  payment_terms TEXT,
  
  -- Status
  status TEXT DEFAULT 'draft', -- draft, sent, signed, completed, cancelled
  sent_date TIMESTAMP WITH TIME ZONE,
  signed_date TIMESTAMP WITH TIME ZONE,
  signature_data TEXT, -- Digital signature
  
  -- Content
  contract_html TEXT,
  contract_pdf_url TEXT
);

-- ============================================
-- EMAIL TEMPLATES
-- ============================================

CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  name TEXT NOT NULL,
  category TEXT, -- outreach, follow-up, onboarding, retention
  slug TEXT UNIQUE NOT NULL,
  
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  
  -- Variables that can be used in template
  variables JSONB, -- e.g., ["name", "athlete_name", "package_name"]
  
  usage_notes TEXT,
  active BOOLEAN DEFAULT TRUE
);

-- ============================================
-- SENT EMAILS (Tracking)
-- ============================================

CREATE TABLE sent_emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  template_id UUID REFERENCES email_templates(id),
  lead_id UUID REFERENCES leads(id),
  
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  
  subject TEXT,
  body TEXT,
  
  status TEXT DEFAULT 'sent', -- sent, opened, clicked, replied
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  replied_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- WEEKLY SCORECARDS
-- ============================================

CREATE TABLE weekly_scorecards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  
  -- Outreach
  new_leads_contacted INTEGER DEFAULT 0,
  follow_ups_sent INTEGER DEFAULT 0,
  meetings_calls_held INTEGER DEFAULT 0,
  
  -- Shooting & Delivery
  shoots_completed INTEGER DEFAULT 0,
  content_delivered INTEGER DEFAULT 0,
  avg_delivery_time_hours DECIMAL(5,2),
  
  -- Revenue
  revenue_generated DECIMAL(10,2) DEFAULT 0,
  new_clients INTEGER DEFAULT 0,
  repeat_clients INTEGER DEFAULT 0,
  
  -- Engagement
  content_posted_by_clients INTEGER DEFAULT 0,
  testimonials_received INTEGER DEFAULT 0,
  referrals_received INTEGER DEFAULT 0,
  
  -- Notes
  wins TEXT,
  challenges TEXT,
  next_week_goals TEXT
);

-- ============================================
-- BOOKINGS/SHOOTS
-- ============================================

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Client
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  athlete_name TEXT,
  
  -- Booking Details
  package_id UUID REFERENCES service_packages(id),
  booking_type TEXT, -- game, media_day, tournament, session
  
  -- Schedule
  shoot_date DATE,
  shoot_time TIME,
  location TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending', -- pending, confirmed, completed, cancelled
  
  -- Payment
  amount_paid DECIMAL(10,2) DEFAULT 0,
  amount_due DECIMAL(10,2),
  payment_status TEXT DEFAULT 'unpaid', -- unpaid, partial, paid
  
  -- Delivery
  content_delivered BOOLEAN DEFAULT FALSE,
  delivery_date TIMESTAMP WITH TIME ZONE,
  delivery_url TEXT,
  
  -- Notes
  notes TEXT,
  special_requests TEXT
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_next_follow_up ON leads(next_follow_up_date);
CREATE INDEX idx_interactions_lead_id ON interactions(lead_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_bookings_shoot_date ON bookings(shoot_date);
CREATE INDEX idx_bookings_status ON bookings(status);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE sent_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_scorecards ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Admin-only access for most tables
CREATE POLICY "Admin full access to leads" ON leads FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access to interactions" ON interactions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access to email_templates" ON email_templates FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access to sent_emails" ON sent_emails FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access to weekly_scorecards" ON weekly_scorecards FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access to bookings" ON bookings FOR ALL USING (auth.role() = 'authenticated');

-- Service packages - public can read, admin can modify
CREATE POLICY "Public can view active packages" ON service_packages FOR SELECT USING (active = TRUE);
CREATE POLICY "Admin can manage packages" ON service_packages FOR ALL USING (auth.role() = 'authenticated');

-- Contracts - clients can view their own, admin can manage all
CREATE POLICY "Clients can view their contracts" ON contracts FOR SELECT USING (
  auth.role() = 'authenticated' OR client_email = auth.email()
);
CREATE POLICY "Admin can manage contracts" ON contracts FOR ALL USING (auth.role() = 'authenticated');
