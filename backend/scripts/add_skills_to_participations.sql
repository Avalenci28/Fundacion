-- Add skills and availability columns to participations table (if not exists)
ALTER TABLE participations ADD COLUMN IF NOT EXISTS skills TEXT;
ALTER TABLE participations ADD COLUMN IF NOT EXISTS availability TEXT;
ALTER TABLE participations ADD COLUMN IF NOT EXISTS motivation TEXT;


