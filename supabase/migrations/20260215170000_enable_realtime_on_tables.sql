-- ================================================
-- Phase 5: Enable Realtime on all key tables
-- App subscribes to changes and auto-refreshes
-- when the agent writes data externally
-- ================================================

ALTER PUBLICATION supabase_realtime ADD TABLE contacts;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE inventory;
ALTER PUBLICATION supabase_realtime ADD TABLE vision_exams;
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE contact_notes;
ALTER PUBLICATION supabase_realtime ADD TABLE members;
