-- Smart House Locator - Complete Database Setup
-- Run this SQL in your NEW Supabase SQL Editor

-- 1. Create the houses table
CREATE TABLE IF NOT EXISTS houses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    notes TEXT,
    caretaker_name TEXT,
    caretaker_phone TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE houses ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policies for authenticated users
CREATE POLICY "Users can view their own houses" ON houses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own houses" ON houses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own houses" ON houses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own houses" ON houses
    FOR DELETE USING (auth.uid() = user_id);

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_houses_user_id ON houses(user_id);
CREATE INDEX IF NOT EXISTS idx_houses_created_at ON houses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_houses_location ON houses(latitude, longitude);

-- 5. Create function to automatically set user_id on insert
CREATE OR REPLACE FUNCTION set_user_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.user_id = auth.uid();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create trigger to automatically set user_id
DROP TRIGGER IF EXISTS set_user_id_trigger ON houses;
CREATE TRIGGER set_user_id_trigger
    BEFORE INSERT ON houses
    FOR EACH ROW
    EXECUTE FUNCTION set_user_id();

-- 7. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Create trigger to update updated_at
DROP TRIGGER IF EXISTS update_houses_updated_at ON houses;
CREATE TRIGGER update_houses_updated_at
    BEFORE UPDATE ON houses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 9. Insert some sample data (optional - for testing)
INSERT INTO houses (name, latitude, longitude, notes, caretaker_name, caretaker_phone) VALUES
('Sample House 1', -1.2921, 36.8219, 'Beautiful family home with garden', 'John Doe', '+254700123456'),
('Sample House 2', -1.2841, 36.8155, 'Modern apartment in city center', 'Jane Smith', '+254700654321'),
('Sample House 3', -1.2864, 36.8172, 'Cozy cottage with mountain view', 'Mike Johnson', '+254700789012')
ON CONFLICT DO NOTHING;

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

-- 12. Show sample data
SELECT 
    id,
    name,
    latitude,
    longitude,
    notes,
    caretaker_name,
    caretaker_phone,
    created_at
FROM houses 
ORDER BY created_at DESC;
