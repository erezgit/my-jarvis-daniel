-- Fix icount_doc_id: change from integer to text (composite key: "doctype_docnum")
-- and replace partial unique index with proper unique constraint for PostgREST upserts.

-- 1. Drop the old partial unique index (PostgREST can't use partial indexes for ON CONFLICT)
DROP INDEX IF EXISTS "public"."icount_documents_icount_doc_id_key";

-- 2. Change column type from integer to text
ALTER TABLE "public"."icount_documents"
  ALTER COLUMN "icount_doc_id" TYPE text USING "icount_doc_id"::text;

-- 3. Create proper unique constraint (non-partial) for upsert support
ALTER TABLE "public"."icount_documents"
  ADD CONSTRAINT "icount_documents_icount_doc_id_unique" UNIQUE ("icount_doc_id");
