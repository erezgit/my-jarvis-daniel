-- Phase 9.5: Expand vision_exams with full clinical exam data
-- and add client preferences to contacts

-- Expand vision_exams with full clinical exam data
ALTER TABLE vision_exams
  ADD COLUMN IF NOT EXISTS exam_data jsonb DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS medical_history jsonb DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS recommendations jsonb DEFAULT '{}';

-- Add client preferences to contacts (DATA + LIKED + PERSONA tabs)
ALTER TABLE contacts
  ADD COLUMN IF NOT EXISTS client_preferences jsonb DEFAULT '{}';

-- Add comments for documentation
COMMENT ON COLUMN vision_exams.exam_data IS 'Full clinical exam data: vision, mobility, refractive, binocular, eye_health, additional';
COMMENT ON COLUMN vision_exams.medical_history IS 'Symptoms checklist, reason for visit, clinical notes';
COMMENT ON COLUMN vision_exams.recommendations IS 'Final prescription, lens recommendations';
COMMENT ON COLUMN contacts.client_preferences IS 'Client preferences from DATA, LIKED, PERSONA tabs';
