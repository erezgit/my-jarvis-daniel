-- Phase C: Rename sales → members
-- Part of Ticket 011 — Glassworks Domain Setup

-- 1. Rename the sales table to members
ALTER TABLE "public"."sales" RENAME TO "members";

-- 2. Rename sales_id columns to member_id in all referencing tables
ALTER TABLE "public"."companies" RENAME COLUMN "sales_id" TO "member_id";
ALTER TABLE "public"."contacts" RENAME COLUMN "sales_id" TO "member_id";
ALTER TABLE "public"."contact_notes" RENAME COLUMN "sales_id" TO "member_id";
ALTER TABLE "public"."tasks" RENAME COLUMN "sales_id" TO "member_id";

-- 3. Drop and recreate the init_state view to reference members
DROP VIEW IF EXISTS "public"."init_state";
CREATE VIEW "public"."init_state"
  WITH (security_invoker=off)
  AS
SELECT count(id) AS is_initialized
FROM public.members
LIMIT 1;

-- 4. Update handle_new_user() to reference members
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
declare
  member_count int;
begin
  select count(id) into member_count
  from public.members;

  insert into public.members (first_name, last_name, email, user_id, administrator)
  values (
    coalesce(new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data -> 'custom_claims' ->> 'first_name', 'Pending'),
    coalesce(new.raw_user_meta_data ->> 'last_name', new.raw_user_meta_data -> 'custom_claims' ->> 'last_name', 'Pending'),
    new.email,
    new.id,
    case when member_count > 0 then FALSE else TRUE end
  );
  return new;
end;
$$;

-- 5. Update handle_update_user() to reference members
CREATE OR REPLACE FUNCTION public.handle_update_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
begin
  update public.members
  set
    first_name = coalesce(new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data -> 'custom_claims' ->> 'first_name', 'Pending'),
    last_name = coalesce(new.raw_user_meta_data ->> 'last_name', new.raw_user_meta_data -> 'custom_claims' ->> 'last_name', 'Pending'),
    email = new.email
  where user_id = new.id;

  return new;
end;
$$;

-- 6. Replace set_sales_id_default() with set_member_id_default()
-- Drop old triggers
DROP TRIGGER IF EXISTS set_task_sales_id_trigger ON tasks;
DROP TRIGGER IF EXISTS set_contact_sales_id_trigger ON contacts;
DROP TRIGGER IF EXISTS set_contact_notes_sales_id_trigger ON contact_notes;
DROP TRIGGER IF EXISTS set_company_sales_id_trigger ON companies;

-- Drop old function
DROP FUNCTION IF EXISTS set_sales_id_default();

-- Create new function
CREATE OR REPLACE FUNCTION set_member_id_default()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.member_id IS NULL THEN
    SELECT id INTO NEW.member_id FROM members WHERE user_id = auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate triggers with new names
CREATE TRIGGER set_task_member_id_trigger
BEFORE INSERT ON tasks
FOR EACH ROW
EXECUTE FUNCTION set_member_id_default();

CREATE TRIGGER set_contact_member_id_trigger
BEFORE INSERT ON contacts
FOR EACH ROW
EXECUTE FUNCTION set_member_id_default();

CREATE TRIGGER set_contact_notes_member_id_trigger
BEFORE INSERT ON contact_notes
FOR EACH ROW
EXECUTE FUNCTION set_member_id_default();

CREATE TRIGGER set_company_member_id_trigger
BEFORE INSERT ON companies
FOR EACH ROW
EXECUTE FUNCTION set_member_id_default();

-- 7. Update merge_contacts() to use member_id
CREATE OR REPLACE FUNCTION merge_contacts(loser_id bigint, winner_id bigint)
RETURNS bigint
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  winner_contact contacts%ROWTYPE;
  loser_contact contacts%ROWTYPE;
  merged_emails jsonb;
  merged_phones jsonb;
  merged_tags bigint[];
  winner_emails jsonb;
  loser_emails jsonb;
  winner_phones jsonb;
  loser_phones jsonb;
  email_map jsonb;
  phone_map jsonb;
BEGIN
  SELECT * INTO winner_contact FROM contacts WHERE id = winner_id;
  SELECT * INTO loser_contact FROM contacts WHERE id = loser_id;

  IF winner_contact IS NULL OR loser_contact IS NULL THEN
    RAISE EXCEPTION 'Contact not found';
  END IF;

  UPDATE tasks SET contact_id = winner_id WHERE contact_id = loser_id;
  UPDATE "contact_notes" SET contact_id = winner_id WHERE contact_id = loser_id;

  winner_emails := COALESCE(winner_contact.email_jsonb, '[]'::jsonb);
  loser_emails := COALESCE(loser_contact.email_jsonb, '[]'::jsonb);

  email_map := '{}'::jsonb;

  IF jsonb_array_length(winner_emails) > 0 THEN
    FOR i IN 0..jsonb_array_length(winner_emails)-1 LOOP
      email_map := email_map || jsonb_build_object(
        winner_emails->i->>'email',
        winner_emails->i
      );
    END LOOP;
  END IF;

  IF jsonb_array_length(loser_emails) > 0 THEN
    FOR i IN 0..jsonb_array_length(loser_emails)-1 LOOP
      IF NOT email_map ? (loser_emails->i->>'email') THEN
        email_map := email_map || jsonb_build_object(
          loser_emails->i->>'email',
          loser_emails->i
        );
      END IF;
    END LOOP;
  END IF;

  merged_emails := (SELECT jsonb_agg(value) FROM jsonb_each(email_map));
  merged_emails := COALESCE(merged_emails, '[]'::jsonb);

  winner_phones := COALESCE(winner_contact.phone_jsonb, '[]'::jsonb);
  loser_phones := COALESCE(loser_contact.phone_jsonb, '[]'::jsonb);

  phone_map := '{}'::jsonb;

  IF jsonb_array_length(winner_phones) > 0 THEN
    FOR i IN 0..jsonb_array_length(winner_phones)-1 LOOP
      phone_map := phone_map || jsonb_build_object(
        winner_phones->i->>'number',
        winner_phones->i
      );
    END LOOP;
  END IF;

  IF jsonb_array_length(loser_phones) > 0 THEN
    FOR i IN 0..jsonb_array_length(loser_phones)-1 LOOP
      IF NOT phone_map ? (loser_phones->i->>'number') THEN
        phone_map := phone_map || jsonb_build_object(
          loser_phones->i->>'number',
          loser_phones->i
        );
      END IF;
    END LOOP;
  END IF;

  merged_phones := (SELECT jsonb_agg(value) FROM jsonb_each(phone_map));
  merged_phones := COALESCE(merged_phones, '[]'::jsonb);

  merged_tags := ARRAY(
    SELECT DISTINCT unnest(
      COALESCE(winner_contact.tags, ARRAY[]::bigint[]) ||
      COALESCE(loser_contact.tags, ARRAY[]::bigint[])
    )
  );

  UPDATE contacts SET
    avatar = COALESCE(winner_contact.avatar, loser_contact.avatar),
    gender = COALESCE(winner_contact.gender, loser_contact.gender),
    first_name = COALESCE(winner_contact.first_name, loser_contact.first_name),
    last_name = COALESCE(winner_contact.last_name, loser_contact.last_name),
    title = COALESCE(winner_contact.title, loser_contact.title),
    company_id = COALESCE(winner_contact.company_id, loser_contact.company_id),
    email_jsonb = merged_emails,
    phone_jsonb = merged_phones,
    linkedin_url = COALESCE(winner_contact.linkedin_url, loser_contact.linkedin_url),
    background = COALESCE(winner_contact.background, loser_contact.background),
    has_newsletter = COALESCE(winner_contact.has_newsletter, loser_contact.has_newsletter),
    first_seen = LEAST(COALESCE(winner_contact.first_seen, loser_contact.first_seen), COALESCE(loser_contact.first_seen, winner_contact.first_seen)),
    last_seen = GREATEST(COALESCE(winner_contact.last_seen, loser_contact.last_seen), COALESCE(loser_contact.last_seen, winner_contact.last_seen)),
    member_id = COALESCE(winner_contact.member_id, loser_contact.member_id),
    tags = merged_tags
  WHERE id = winner_id;

  DELETE FROM contacts WHERE id = loser_id;

  RETURN winner_id;
END;
$$;
