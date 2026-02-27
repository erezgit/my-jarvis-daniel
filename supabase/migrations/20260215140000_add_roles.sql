-- Phase 3: Add Roles & Permissions
-- Adds role column, helper functions, sync trigger, and role-based RLS policies

-- ============================================================
-- 1. Add role column to members
-- ============================================================
ALTER TABLE "public"."members"
  ADD COLUMN "role" text NOT NULL DEFAULT 'salesperson';

ALTER TABLE "public"."members"
  ADD CONSTRAINT members_role_check
  CHECK (role IN ('admin', 'manager', 'salesperson', 'glazier', 'office'));

-- Migrate existing data: administrator=true → admin, others → salesperson
UPDATE "public"."members"
  SET role = CASE WHEN administrator THEN 'admin' ELSE 'salesperson' END;

-- ============================================================
-- 2. Helper functions for RLS
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_current_member_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role FROM public.members WHERE user_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_current_member_id()
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT id FROM public.members WHERE user_id = auth.uid() LIMIT 1;
$$;

-- ============================================================
-- 3. Sync trigger: keep administrator in sync with role
-- ============================================================
CREATE OR REPLACE FUNCTION public.sync_administrator_from_role()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.administrator := (NEW.role = 'admin');
  RETURN NEW;
END;
$$;

CREATE TRIGGER sync_administrator_trigger
BEFORE INSERT OR UPDATE OF role ON public.members
FOR EACH ROW
EXECUTE FUNCTION public.sync_administrator_from_role();

-- ============================================================
-- 4. Update handle_new_user trigger to set role
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
declare
  member_count int;
  new_role text;
begin
  select count(id) into member_count from public.members;

  new_role := case when member_count > 0 then 'salesperson' else 'admin' end;

  insert into public.members (first_name, last_name, email, user_id, administrator, role)
  values (
    coalesce(new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data -> 'custom_claims' ->> 'first_name', 'Pending'),
    coalesce(new.raw_user_meta_data ->> 'last_name', new.raw_user_meta_data -> 'custom_claims' ->> 'last_name', 'Pending'),
    new.email,
    new.id,
    case when member_count > 0 then FALSE else TRUE end,
    new_role
  );
  return new;
end;
$$;

-- ============================================================
-- 5. Drop all existing permissive RLS policies
-- ============================================================

-- contacts
DROP POLICY IF EXISTS "Contact Delete Policy" ON "public"."contacts";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "public"."contacts";
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON "public"."contacts";
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON "public"."contacts";

-- contact_notes
DROP POLICY IF EXISTS "Contact Notes Delete Policy" ON "public"."contact_notes";
DROP POLICY IF EXISTS "Contact Notes Update policy" ON "public"."contact_notes";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "public"."contact_notes";
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON "public"."contact_notes";

-- tasks
DROP POLICY IF EXISTS "Task Delete Policy" ON "public"."tasks";
DROP POLICY IF EXISTS "Task Update Policy" ON "public"."tasks";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "public"."tasks";
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON "public"."tasks";

-- tags
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON "public"."tags";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "public"."tags";
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON "public"."tags";
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON "public"."tags";

-- companies
DROP POLICY IF EXISTS "Company Delete Policy" ON "public"."companies";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "public"."companies";
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON "public"."companies";
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON "public"."companies";

-- ============================================================
-- 6. Create role-based RLS policies
-- ============================================================

-- === CONTACTS ===
CREATE POLICY "contacts_select" ON "public"."contacts"
AS PERMISSIVE FOR SELECT TO authenticated
USING (
  public.get_current_member_role() IN ('admin', 'manager', 'office', 'glazier')
  OR member_id = public.get_current_member_id()
);

CREATE POLICY "contacts_insert" ON "public"."contacts"
AS PERMISSIVE FOR INSERT TO authenticated
WITH CHECK (
  public.get_current_member_role() IN ('admin', 'manager', 'office', 'salesperson')
);

CREATE POLICY "contacts_update" ON "public"."contacts"
AS PERMISSIVE FOR UPDATE TO authenticated
USING (
  public.get_current_member_role() IN ('admin', 'manager')
  OR (public.get_current_member_role() = 'salesperson' AND member_id = public.get_current_member_id())
);

CREATE POLICY "contacts_delete" ON "public"."contacts"
AS PERMISSIVE FOR DELETE TO authenticated
USING (
  public.get_current_member_role() IN ('admin', 'manager')
  OR (public.get_current_member_role() = 'salesperson' AND member_id = public.get_current_member_id())
);

-- === CONTACT_NOTES ===
CREATE POLICY "contact_notes_select" ON "public"."contact_notes"
AS PERMISSIVE FOR SELECT TO authenticated
USING (
  public.get_current_member_role() IN ('admin', 'manager', 'office', 'glazier')
  OR member_id = public.get_current_member_id()
);

CREATE POLICY "contact_notes_insert" ON "public"."contact_notes"
AS PERMISSIVE FOR INSERT TO authenticated
WITH CHECK (
  public.get_current_member_role() IN ('admin', 'manager', 'salesperson')
);

CREATE POLICY "contact_notes_update" ON "public"."contact_notes"
AS PERMISSIVE FOR UPDATE TO authenticated
USING (
  public.get_current_member_role() IN ('admin', 'manager')
  OR (public.get_current_member_role() = 'salesperson' AND member_id = public.get_current_member_id())
);

CREATE POLICY "contact_notes_delete" ON "public"."contact_notes"
AS PERMISSIVE FOR DELETE TO authenticated
USING (
  public.get_current_member_role() IN ('admin', 'manager')
  OR (public.get_current_member_role() = 'salesperson' AND member_id = public.get_current_member_id())
);

-- === TASKS ===
CREATE POLICY "tasks_select" ON "public"."tasks"
AS PERMISSIVE FOR SELECT TO authenticated
USING (
  public.get_current_member_role() IN ('admin', 'manager', 'office', 'glazier')
  OR member_id = public.get_current_member_id()
);

CREATE POLICY "tasks_insert" ON "public"."tasks"
AS PERMISSIVE FOR INSERT TO authenticated
WITH CHECK (
  public.get_current_member_role() IN ('admin', 'manager', 'office', 'salesperson')
);

CREATE POLICY "tasks_update" ON "public"."tasks"
AS PERMISSIVE FOR UPDATE TO authenticated
USING (
  public.get_current_member_role() IN ('admin', 'manager')
  OR (public.get_current_member_role() = 'salesperson' AND member_id = public.get_current_member_id())
);

CREATE POLICY "tasks_delete" ON "public"."tasks"
AS PERMISSIVE FOR DELETE TO authenticated
USING (
  public.get_current_member_role() IN ('admin', 'manager')
  OR (public.get_current_member_role() = 'salesperson' AND member_id = public.get_current_member_id())
);

-- === TAGS ===
CREATE POLICY "tags_select" ON "public"."tags"
AS PERMISSIVE FOR SELECT TO authenticated
USING (true);

CREATE POLICY "tags_insert" ON "public"."tags"
AS PERMISSIVE FOR INSERT TO authenticated
WITH CHECK (public.get_current_member_role() IN ('admin', 'manager'));

CREATE POLICY "tags_update" ON "public"."tags"
AS PERMISSIVE FOR UPDATE TO authenticated
USING (public.get_current_member_role() IN ('admin', 'manager'));

CREATE POLICY "tags_delete" ON "public"."tags"
AS PERMISSIVE FOR DELETE TO authenticated
USING (public.get_current_member_role() IN ('admin', 'manager'));

-- === COMPANIES ===
CREATE POLICY "companies_select" ON "public"."companies"
AS PERMISSIVE FOR SELECT TO authenticated
USING (true);

CREATE POLICY "companies_insert" ON "public"."companies"
AS PERMISSIVE FOR INSERT TO authenticated
WITH CHECK (
  public.get_current_member_role() IN ('admin', 'manager', 'office', 'salesperson')
);

CREATE POLICY "companies_update" ON "public"."companies"
AS PERMISSIVE FOR UPDATE TO authenticated
USING (public.get_current_member_role() IN ('admin', 'manager'));

CREATE POLICY "companies_delete" ON "public"."companies"
AS PERMISSIVE FOR DELETE TO authenticated
USING (public.get_current_member_role() IN ('admin', 'manager'));
