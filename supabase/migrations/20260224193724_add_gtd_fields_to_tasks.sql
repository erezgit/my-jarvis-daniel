-- Add GTD fields to existing tasks table
-- GTD status: which bucket does this task belong to
ALTER TABLE public.tasks
  ADD COLUMN gtd_status text NOT NULL DEFAULT 'inbox';

-- Priority level
ALTER TABLE public.tasks
  ADD COLUMN priority text NOT NULL DEFAULT 'medium';

-- Context / project area (e.g. עירייה, פעמון, קליניקה, אישי)
ALTER TABLE public.tasks
  ADD COLUMN context text;

-- Who we're waiting on (for waiting_for status)
ALTER TABLE public.tasks
  ADD COLUMN waiting_for_person text;

-- Make contact_id optional so inbox items can be quick brain dumps
ALTER TABLE public.tasks
  ALTER COLUMN contact_id DROP NOT NULL;

-- Add check constraints for valid values
ALTER TABLE public.tasks
  ADD CONSTRAINT tasks_gtd_status_check
  CHECK (gtd_status IN ('inbox', 'next_action', 'waiting_for', 'project', 'someday_maybe', 'done'));

ALTER TABLE public.tasks
  ADD CONSTRAINT tasks_priority_check
  CHECK (priority IN ('urgent', 'high', 'medium', 'low'));
