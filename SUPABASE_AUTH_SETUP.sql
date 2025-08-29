-- Smart House Locator - Authentication & Schema Setup
-- Run this SQL in your Supabase SQL Editor

-- 1. Enable Row Level Security (RLS) on houses table
ALTER TABLE houses ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies
DROP POLICY IF EXISTS "Allow all operations" ON houses;

-- 3. Create new policies for authenticated users only
CREATE POLICY "Users can view their own houses" ON houses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own houses" ON houses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own houses" ON houses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own houses" ON houses
  FOR DELETE USING (auth.uid() = user_id);

-- 4. Add user_id column to houses table (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'houses' AND column_name = 'user_id') THEN
        ALTER TABLE houses ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 5. Add caretaker columns (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'houses' AND column_name = 'caretaker_name') THEN
        ALTER TABLE houses ADD COLUMN caretaker_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'houses' AND column_name = 'caretaker_phone') THEN
        ALTER TABLE houses ADD COLUMN caretaker_phone TEXT;
    END IF;
END $$;

-- 6. Remove agent_name column (if exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'houses' AND column_name = 'agent_name') THEN
        ALTER TABLE houses DROP COLUMN agent_name;
    END IF;
END $$;

-- 7. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_houses_user_id ON houses(user_id);
CREATE INDEX IF NOT EXISTS idx_houses_created_at ON houses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_houses_location ON houses(latitude, longitude);

-- 8. Create function to automatically set user_id on insert
CREATE OR REPLACE FUNCTION set_user_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.user_id = auth.uid();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Create trigger to automatically set user_id
DROP TRIGGER IF EXISTS set_user_id_trigger ON houses;
CREATE TRIGGER set_user_id_trigger
    BEFORE INSERT ON houses
    FOR EACH ROW
    EXECUTE FUNCTION set_user_id();

-- 10. Verify the setup
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'houses' 
ORDER BY ordinal_position;

-- 11. Show current policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'houses';
