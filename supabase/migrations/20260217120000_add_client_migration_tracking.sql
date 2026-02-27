-- Phase 9: Client Migration — add tracking columns and missing profile fields
-- These columns support the Google Drive → CRM import of ~3,940 client profiles.

-- 1. Migration tracking
ALTER TABLE "public"."contacts"
  ADD COLUMN IF NOT EXISTS "gdrive_file_id" text UNIQUE,
  ADD COLUMN IF NOT EXISTS "migration_status" text DEFAULT 'pending'
    CHECK ("migration_status" IN ('pending', 'imported', 'verified', 'skipped'));

-- 2. Profile fields found in Google Sheets but missing from contacts
ALTER TABLE "public"."contacts"
  ADD COLUMN IF NOT EXISTS "city" text,
  ADD COLUMN IF NOT EXISTS "preferred_language" text,
  ADD COLUMN IF NOT EXISTS "is_tourist" boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS "occupation" text;

-- 3. Index on migration_status for filtering during import
CREATE INDEX IF NOT EXISTS "idx_contacts_migration_status" ON "public"."contacts" ("migration_status");
