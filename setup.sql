-- ============================================================================
-- Email Subscriptions Table
-- ============================================================================

-- Create email subscriptions table
CREATE TABLE IF NOT EXISTS email_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  is_active BOOLEAN DEFAULT true,
  daily_summary_enabled BOOLEAN DEFAULT true,
  special_sighting_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_active 
  ON email_subscriptions(is_active);

CREATE INDEX IF NOT EXISTS idx_email_subscriptions_daily 
  ON email_subscriptions(is_active, daily_summary_enabled) 
  WHERE is_active = true AND daily_summary_enabled = true;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_email_subscriptions_updated_at
  BEFORE UPDATE ON email_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies if needed
ALTER TABLE email_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow service role to do everything
CREATE POLICY "Service role has full access" ON email_subscriptions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- Email Logs Table (Optional - for tracking sent emails)
-- ============================================================================

CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_type TEXT NOT NULL, -- 'daily_summary', 'special_sighting', 'welcome'
  recipient_email TEXT NOT NULL,
  status TEXT NOT NULL, -- 'sent', 'failed'
  message_id TEXT,
  error_message TEXT,
  metadata JSONB,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for email logs
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient 
  ON email_logs(recipient_email);

CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at 
  ON email_logs(sent_at DESC);

CREATE INDEX IF NOT EXISTS idx_email_logs_type 
  ON email_logs(email_type);

-- Add RLS for email logs
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role has full access to logs" ON email_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- Helper Functions
-- ============================================================================

-- Function to check if a species is a first-time sighting
CREATE OR REPLACE FUNCTION is_first_time_species(p_species TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  species_count INTEGER;
BEGIN
  SELECT COUNT(DISTINCT image_id)
  INTO species_count
  FROM attributions
  WHERE species = p_species;
  
  RETURN species_count = 1;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Sample Data (Optional - for testing)
-- ============================================================================

-- Insert a test subscriber (comment out in production)
-- INSERT INTO email_subscriptions (email, name, is_active, daily_summary_enabled, special_sighting_enabled)
-- VALUES ('test@example.com', 'Test User', true, true, true)
-- ON CONFLICT (email) DO NOTHING;

