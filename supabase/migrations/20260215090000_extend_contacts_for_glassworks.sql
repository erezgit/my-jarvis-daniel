-- Phase D: Extend contacts for Glassworks + fix contacts_summary view
-- Part of Ticket 011 — Glassworks Domain Setup

-- 1. Add lifecycle_stage column
ALTER TABLE "public"."contacts"
  ADD COLUMN IF NOT EXISTS "lifecycle_stage" text NOT NULL DEFAULT 'new_lead';

-- 2. Add lead_source column
ALTER TABLE "public"."contacts"
  ADD COLUMN IF NOT EXISTS "lead_source" text;

-- 3. Add Glassworks-specific fields
ALTER TABLE "public"."contacts"
  ADD COLUMN IF NOT EXISTS "date_of_birth" date,
  ADD COLUMN IF NOT EXISTS "id_number" text,
  ADD COLUMN IF NOT EXISTS "health_insurance" text;

-- 4. Recreate contacts_summary view with new fields + fix member_id reference
DROP VIEW IF EXISTS "public"."contacts_summary";
CREATE VIEW "public"."contacts_summary"
  WITH (security_invoker=off)
  AS
SELECT
    co.id,
    co.first_name,
    co.last_name,
    co.gender,
    co.title,
    co.email_jsonb,
    jsonb_path_query_array(co.email_jsonb, '$[*].email')::text as email_fts,
    co.phone_jsonb,
    jsonb_path_query_array(co.phone_jsonb, '$[*].number')::text as phone_fts,
    co.background,
    co.avatar,
    co.first_seen,
    co.last_seen,
    co.has_newsletter,
    co.status,
    co.tags,
    co.company_id,
    co.member_id,
    co.linkedin_url,
    co.lifecycle_stage,
    co.lead_source,
    co.date_of_birth,
    co.id_number,
    co.health_insurance,
    c.name as company_name,
    count(distinct t.id) as nb_tasks
FROM contacts co
LEFT JOIN tasks t ON co.id = t.contact_id
LEFT JOIN companies c ON co.company_id = c.id
GROUP BY co.id, c.name;
