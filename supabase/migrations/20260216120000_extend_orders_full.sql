-- Full Orders Upgrade: Add 18 new columns for complete optical shop workflow
-- Covers: order reference, lens classification, staff roles, QA, dates, financials

-- ============================================================
-- 1. New columns
-- ============================================================

-- Reference & classification
ALTER TABLE "public"."orders"
  ADD COLUMN IF NOT EXISTS "order_number"   text,
  ADD COLUMN IF NOT EXISTS "lens_category"  text,
  ADD COLUMN IF NOT EXISTS "lens_type"      text,
  ADD COLUMN IF NOT EXISTS "product_type"   text;

-- Clinical notes
ALTER TABLE "public"."orders"
  ADD COLUMN IF NOT EXISTS "distance_rx"    text,
  ADD COLUMN IF NOT EXISTS "opt_notes"      text;

-- Frame tracking
ALTER TABLE "public"."orders"
  ADD COLUMN IF NOT EXISTS "frame_present"  boolean NOT NULL DEFAULT false;

-- Lifecycle dates
ALTER TABLE "public"."orders"
  ADD COLUMN IF NOT EXISTS "lens_order_date"    timestamp with time zone,
  ADD COLUMN IF NOT EXISTS "received_date"      timestamp with time zone,
  ADD COLUMN IF NOT EXISTS "notification_date"  timestamp with time zone;

-- Staff roles (all FK → members)
ALTER TABLE "public"."orders"
  ADD COLUMN IF NOT EXISTS "store_rep"    bigint REFERENCES "public"."members"("id"),
  ADD COLUMN IF NOT EXISTS "optometrist"  bigint REFERENCES "public"."members"("id"),
  ADD COLUMN IF NOT EXISTS "ordered_by"   bigint REFERENCES "public"."members"("id"),
  ADD COLUMN IF NOT EXISTS "received_by"  bigint REFERENCES "public"."members"("id"),
  ADD COLUMN IF NOT EXISTS "cut_by"       bigint REFERENCES "public"."members"("id"),
  ADD COLUMN IF NOT EXISTS "pickup_with"  bigint REFERENCES "public"."members"("id");

-- QA workflow
ALTER TABLE "public"."orders"
  ADD COLUMN IF NOT EXISTS "qa_checks" jsonb DEFAULT '{"rx": false, "color": false, "coatings": false, "defects": false}';

-- Financial
ALTER TABLE "public"."orders"
  ADD COLUMN IF NOT EXISTS "open_balance" numeric(10,2) DEFAULT 0;

-- ============================================================
-- 2. CHECK constraints for classification fields
-- ============================================================
ALTER TABLE "public"."orders"
  ADD CONSTRAINT orders_lens_category_check
    CHECK (lens_category IS NULL OR lens_category IN ('sv', 'mf', 'cl'));

ALTER TABLE "public"."orders"
  ADD CONSTRAINT orders_lens_type_check
    CHECK (lens_type IS NULL OR lens_type IN ('optical', 'sun', 'transition', 'cl_order', 'cl_trial'));

ALTER TABLE "public"."orders"
  ADD CONSTRAINT orders_product_type_check
    CHECK (product_type IS NULL OR product_type IN ('stock', 'custom'));

-- ============================================================
-- 3. Update status CHECK to include frame_fix
-- ============================================================
ALTER TABLE "public"."orders" DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE "public"."orders"
  ADD CONSTRAINT orders_status_check
    CHECK (status IN ('new_entry', 'lens_ordered', 'arrived', 'qa_check', 'in_progress', 'frame_fix', 'completed', 'notified', 'picked_up'));

-- ============================================================
-- 4. Rebuild orders_summary view with new columns
-- ============================================================
CREATE OR REPLACE VIEW "public"."orders_summary" WITH (security_invoker=off) AS
SELECT
  o.*,
  c.first_name  AS contact_first_name,
  c.last_name   AS contact_last_name,
  m.first_name  AS member_first_name,
  m.last_name   AS member_last_name,
  sr.first_name AS store_rep_first_name,
  sr.last_name  AS store_rep_last_name,
  opt.first_name AS optometrist_first_name,
  opt.last_name  AS optometrist_last_name
FROM "public"."orders" o
LEFT JOIN "public"."contacts" c   ON o.contact_id  = c.id
LEFT JOIN "public"."members" m    ON o.member_id   = m.id
LEFT JOIN "public"."members" sr   ON o.store_rep   = sr.id
LEFT JOIN "public"."members" opt  ON o.optometrist = opt.id;
