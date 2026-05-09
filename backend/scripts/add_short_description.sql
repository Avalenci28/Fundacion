-- Add missing short_description column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS short_description TEXT DEFAULT '';