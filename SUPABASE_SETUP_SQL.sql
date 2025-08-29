-- Smart House Locator Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Create houses table
CREATE TABLE houses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  agent_name VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE houses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for demo purposes)
-- In production, you should create more restrictive policies
CREATE POLICY "Allow all operations" ON houses
  FOR ALL USING (true);

-- Create index for better performance
CREATE INDEX idx_houses_created_at ON houses(created_at DESC);
CREATE INDEX idx_houses_location ON houses(latitude, longitude);

-- Insert a test record to verify the table works
INSERT INTO houses (name, agent_name, latitude, longitude, notes) 
VALUES ('Test House', 'Test Agent', 40.7128, -74.0060, 'This is a test house in New York');

-- Verify the table was created
SELECT * FROM houses;
