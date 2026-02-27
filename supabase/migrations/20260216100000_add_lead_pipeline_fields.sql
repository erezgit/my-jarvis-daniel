-- Add lead pipeline fields to contacts table
-- These fields power the Leads view (lifecycle_stage = 'new_lead')
-- while keeping leads and clients in the same table.

-- Activity status: tracks where the lead is in the sales pipeline
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS activity_status text NOT NULL DEFAULT 'none';
ALTER TABLE contacts ADD CONSTRAINT contacts_activity_status_check CHECK (
  activity_status IN ('none', 'new', 'no_answer', 'lost_lead', 'out_of_queue',
    'follow_up', 'no_show', 'arrive_no_sale', 'appointment_cancelled',
    'appointment_set', 'prepaid_exam', 'purchase', 'golden_nugget')
);

-- Qualification status: assessment of lead viability
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS qualification_status text NOT NULL DEFAULT 'select';
ALTER TABLE contacts ADD CONSTRAINT contacts_qualification_status_check CHECK (
  qualification_status IN ('select', 'qualified', 'disqualified')
);

-- Readiness to book: only for qualified leads
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS readiness_to_book text;
ALTER TABLE contacts ADD CONSTRAINT contacts_readiness_check CHECK (
  readiness_to_book IS NULL OR readiness_to_book IN ('high', 'medium', 'low')
);

-- Lost reason: why a lead was lost
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS lost_reason text;
ALTER TABLE contacts ADD CONSTRAINT contacts_lost_reason_check CHECK (
  lost_reason IS NULL OR lost_reason IN ('price', 'glassworks_fit', 'distance',
    'solved_with_competitor', 'medical_needs', 'trust_issues')
);

-- Lead context fields
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS lead_bio text;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS followup_prompt text;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS followup_date date;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS last_contact_at timestamptz;

-- UTM tracking from ManyChat
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS utm_source text;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS utm_medium text;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS utm_campaign text;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS utm_content text;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS utm_term text;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS manychat_id text;

-- Exam-specific fields (for web_exam source leads)
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS visit_reason text;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS last_exam_date_text text;

-- Update contacts_summary view to include new fields
DROP VIEW IF EXISTS contacts_summary;
CREATE VIEW contacts_summary WITH (security_invoker=off) AS
SELECT
  co.id, co.first_name, co.last_name, co.gender, co.title,
  co.email_jsonb,
  jsonb_path_query_array(co.email_jsonb, '$[*].email')::text as email_fts,
  co.phone_jsonb,
  jsonb_path_query_array(co.phone_jsonb, '$[*].number')::text as phone_fts,
  co.background, co.avatar, co.first_seen, co.last_seen,
  co.has_newsletter, co.status, co.tags,
  co.company_id, co.member_id, co.linkedin_url,
  co.lifecycle_stage, co.lead_source,
  co.date_of_birth, co.id_number, co.health_insurance,
  -- Lead pipeline fields
  co.activity_status, co.qualification_status,
  co.readiness_to_book, co.lost_reason,
  co.lead_bio, co.followup_prompt, co.followup_date,
  co.last_contact_at,
  co.utm_source, co.utm_medium, co.utm_campaign,
  co.manychat_id, co.visit_reason,
  -- Joins
  c.name as company_name,
  count(distinct t.id) as nb_tasks
FROM contacts co
LEFT JOIN tasks t ON co.id = t.contact_id
LEFT JOIN companies c ON co.company_id = c.id
GROUP BY co.id, c.name;

-- Indexes for lead pipeline queries
CREATE INDEX IF NOT EXISTS idx_contacts_activity_status ON contacts(activity_status);
CREATE INDEX IF NOT EXISTS idx_contacts_qualification_status ON contacts(qualification_status);
CREATE INDEX IF NOT EXISTS idx_contacts_lifecycle_stage ON contacts(lifecycle_stage);
CREATE INDEX IF NOT EXISTS idx_contacts_followup_date ON contacts(followup_date);
