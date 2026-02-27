-- =============================================================
-- iCount Integration — documents table + contact sync field
-- =============================================================

-- 1. Add icount_customer_id to contacts for syncing
ALTER TABLE "public"."contacts"
  ADD COLUMN IF NOT EXISTS "icount_customer_id" integer;

-- 2. Create icount_documents table to track all iCount documents per order
CREATE TABLE IF NOT EXISTS "public"."icount_documents" (
  "id" serial PRIMARY KEY,
  "order_id" integer REFERENCES "public"."orders"("id") ON DELETE SET NULL,
  "contact_id" integer REFERENCES "public"."contacts"("id") ON DELETE SET NULL,
  "icount_doc_id" integer,            -- iCount's internal document ID
  "doctype" text NOT NULL,            -- invoice, receipt, invrec, quote, credit, etc.
  "docnum" integer,                   -- iCount document number (the user-facing number)
  "total" numeric(10,2),
  "currency" text DEFAULT 'ILS',
  "status" text DEFAULT 'created' CHECK (status IN ('created', 'sent', 'paid', 'cancelled')),
  "icount_url" text,                  -- link to view in iCount
  "raw_response" jsonb,               -- full iCount API response for debugging
  "created_at" timestamptz DEFAULT now(),
  "updated_at" timestamptz DEFAULT now()
);

-- Index for quick lookups by order
CREATE INDEX IF NOT EXISTS "idx_icount_documents_order_id" ON "public"."icount_documents"("order_id");
CREATE INDEX IF NOT EXISTS "idx_icount_documents_contact_id" ON "public"."icount_documents"("contact_id");

-- 3. RLS policies for icount_documents (same pattern as orders)
ALTER TABLE "public"."icount_documents" ENABLE ROW LEVEL SECURITY;

-- Admins + managers see all
CREATE POLICY "icount_documents_admin_manager_select"
  ON "public"."icount_documents" FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "public"."members" m
      WHERE m.user_id = auth.uid()
        AND m.role IN ('admin', 'manager')
        AND m.disabled IS NOT TRUE
    )
  );

-- Office staff can see all
CREATE POLICY "icount_documents_office_select"
  ON "public"."icount_documents" FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "public"."members" m
      WHERE m.user_id = auth.uid()
        AND m.role = 'office'
        AND m.disabled IS NOT TRUE
    )
  );

-- Salesperson sees documents for their own orders
CREATE POLICY "icount_documents_salesperson_select"
  ON "public"."icount_documents" FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "public"."members" m
      JOIN "public"."orders" o ON o.member_id = m.id
      WHERE m.user_id = auth.uid()
        AND m.role = 'salesperson'
        AND m.disabled IS NOT TRUE
        AND o.id = "icount_documents".order_id
    )
  );

-- Admin + manager + office can insert/update (create invoices)
CREATE POLICY "icount_documents_insert"
  ON "public"."icount_documents" FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "public"."members" m
      WHERE m.user_id = auth.uid()
        AND m.role IN ('admin', 'manager', 'office')
        AND m.disabled IS NOT TRUE
    )
  );

CREATE POLICY "icount_documents_update"
  ON "public"."icount_documents" FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "public"."members" m
      WHERE m.user_id = auth.uid()
        AND m.role IN ('admin', 'manager', 'office')
        AND m.disabled IS NOT TRUE
    )
  );

-- Service role (agent/edge functions) has full access via default bypass

-- 4. Updated_at trigger
CREATE OR REPLACE FUNCTION update_icount_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_icount_documents_updated_at
  BEFORE UPDATE ON "public"."icount_documents"
  FOR EACH ROW
  EXECUTE FUNCTION update_icount_documents_updated_at();

-- 5. Update contacts_summary view to include icount_customer_id
DROP VIEW IF EXISTS "public"."contacts_summary";
CREATE VIEW "public"."contacts_summary" AS
SELECT
  c.*,
  m.first_name AS member_first_name,
  m.last_name AS member_last_name,
  (SELECT count(*) FROM tasks t WHERE t.contact_id = c.id AND t.done_date IS NULL) AS nb_tasks,
  (SELECT count(*) FROM orders o WHERE o.contact_id = c.id) AS nb_orders
FROM contacts c
LEFT JOIN members m ON c.member_id = m.id;
