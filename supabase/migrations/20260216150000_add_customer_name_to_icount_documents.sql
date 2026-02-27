-- Add customer_name to icount_documents for dashboard display
-- This stores the iCount client name so we don't need to parse raw_response JSONB
ALTER TABLE "public"."icount_documents"
  ADD COLUMN IF NOT EXISTS "customer_name" text;

-- Add unique constraint on icount_doc_id for upsert during sync
CREATE UNIQUE INDEX IF NOT EXISTS "icount_documents_icount_doc_id_key"
  ON "public"."icount_documents" ("icount_doc_id")
  WHERE "icount_doc_id" IS NOT NULL;
