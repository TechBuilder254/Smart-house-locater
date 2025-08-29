-- Smart House Locator - Fix Existing Table
-- Run this SQL in your Supabase SQL Editor

-- First, let's check what exists
SELECT table_name FROM information_schema.tables WHERE table_name = 'houses';

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'houses';

-- Enable Row Level Security (RLS) if not already enabled
ALTER TABLE houses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Allow all operations" ON houses;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations" ON houses
  FOR ALL USING (true);

-- Create indexes if they don't exist (ignore errors if they do)
CREATE INDEX IF NOT EXISTS idx_houses_created_at ON houses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_houses_location ON houses(latitude, longitude);

-- Insert a test record (only if table is empty)
INSERT INTO houses (name, agent_name, latitude, longitude, notes) 
SELECT 'Test House', 'Test Agent', 40.7128, -74.0060, 'This is a test house in New York'
WHERE NOT EXISTS (SELECT 1 FROM houses LIMIT 1);

-- Verify the table structure and data
SELECT * FROM houses;
