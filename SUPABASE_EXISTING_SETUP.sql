-- Smart House Locator - Setup for Existing Database
-- Run this SQL in your Supabase SQL Editor

-- 1. First, let's see what columns exist in the houses table
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'houses' 
ORDER BY ordinal_position;

-- 2. Add user_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'houses' AND column_name = 'user_id') THEN
        ALTER TABLE houses ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added user_id column';
    ELSE
        RAISE NOTICE 'user_id column already exists';
    END IF;
END $$;

-- 3. Add agent_name column if it doesn't exist, or modify if it exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'houses' AND column_name = 'agent_name') THEN
        ALTER TABLE houses ADD COLUMN agent_name TEXT;
        RAISE NOTICE 'Added agent_name column';
    ELSE
        -- If column exists but has NOT NULL constraint, make it nullable
        ALTER TABLE houses ALTER COLUMN agent_name DROP NOT NULL;
        RAISE NOTICE 'Made agent_name column nullable';
    END IF;
END $$;

-- 4. Add caretaker columns if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'houses' AND column_name = 'caretaker_name') THEN
        ALTER TABLE houses ADD COLUMN caretaker_name TEXT;
        RAISE NOTICE 'Added caretaker_name column';
    ELSE
        RAISE NOTICE 'caretaker_name column already exists';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'houses' AND column_name = 'caretaker_phone') THEN
        ALTER TABLE houses ADD COLUMN caretaker_phone TEXT;
        RAISE NOTICE 'Added caretaker_phone column';
    ELSE
        RAISE NOTICE 'caretaker_phone column already exists';
    END IF;
END $$;

-- 5. Enable Row Level Security (RLS)
ALTER TABLE houses ENABLE ROW LEVEL SECURITY;

-- 6. Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own houses" ON houses;
DROP POLICY IF EXISTS "Users can insert their own houses" ON houses;
DROP POLICY IF EXISTS "Users can update their own houses" ON houses;
DROP POLICY IF EXISTS "Users can delete their own houses" ON houses;
DROP POLICY IF EXISTS "Allow all operations" ON houses;

-- 7. Create new RLS policies for authenticated users
CREATE POLICY "Users can view their own houses" ON houses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own houses" ON houses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own houses" ON houses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own houses" ON houses
    FOR DELETE USING (auth.uid() = user_id);

-- 8. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_houses_user_id ON houses(user_id);
CREATE INDEX IF NOT EXISTS idx_houses_created_at ON houses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_houses_location ON houses(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_houses_agent_name ON houses(agent_name);

-- 9. Create function to automatically set user_id and agent_name on insert
CREATE OR REPLACE FUNCTION set_user_and_agent()
RETURNS TRIGGER AS $$
DECLARE
    user_name TEXT;
BEGIN
    NEW.user_id = auth.uid();
    
    -- Get user name from auth.users table
    SELECT COALESCE(raw_user_meta_data->>'name', email) INTO user_name
    FROM auth.users 
    WHERE id = auth.uid();
    
    -- Set agent_name to user name or email
    NEW.agent_name = COALESCE(user_name, 'Unknown Agent');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Create trigger to automatically set user_id and agent_name
DROP TRIGGER IF EXISTS set_user_and_agent_trigger ON houses;
CREATE TRIGGER set_user_and_agent_trigger
    BEFORE INSERT ON houses
    FOR EACH ROW
    EXECUTE FUNCTION set_user_and_agent();

-- 11. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 12. Create trigger to update updated_at
DROP TRIGGER IF EXISTS update_houses_updated_at ON houses;
CREATE TRIGGER update_houses_updated_at
    BEFORE UPDATE ON houses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 13. Update existing records to have agent_name if they don't have it
UPDATE houses 
SET agent_name = 'System Admin' 
WHERE agent_name IS NULL OR agent_name = '';

-- 14. Clear existing sample data and insert fresh sample data
DELETE FROM houses WHERE name LIKE 'Sample House%';

INSERT INTO houses (name, latitude, longitude, notes, caretaker_name, caretaker_phone) VALUES
('Sample House 1', -1.2921, 36.8219, 'Beautiful family home with garden', 'John Doe', '+254700123456'),
('Sample House 2', -1.2841, 36.8155, 'Modern apartment in city center', 'Jane Smith', '+254700654321'),
('Sample House 3', -1.2864, 36.8172, 'Cozy cottage with mountain view', 'Mike Johnson', '+254700789012');

-- 15. Verify the final setup
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'houses' 
ORDER BY ordinal_position;

-- 16. Show current policies
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

-- 17. Show sample data
SELECT 
    id,
    name,
    latitude,
    longitude,
    notes,
    agent_name,
    caretaker_name,
    caretaker_phone,
    created_at
FROM houses 
ORDER BY created_at DESC;
