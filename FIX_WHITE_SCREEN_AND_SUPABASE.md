# 🔧 Fix White Screen & Supabase Data Issues

## Issue 1: White Screen Locally

### Problem:
The app shows a white screen because environment variables are missing for local development.

### Solution:

1. **Copy the environment file** (already created):
   ```bash
   # The file env.local has been created with your Supabase credentials
   ```

2. **Rename the file** to `.env.local`:
   ```bash
   mv env.local .env.local
   ```

3. **Restart your development server**:
   ```bash
   npm run dev
   ```

4. **Check the debug info** at the top of your app - all environment variables should show "✅ Set"

## Issue 2: No Data in Supabase

### Problem:
The `houses` table doesn't exist in your Supabase database.

### Solution:

1. **Go to your Supabase Dashboard**:
   - URL: https://supabase.com/dashboard/project/haczfsvknelbvlerkeox
   - Click on "SQL Editor" in the left sidebar

2. **Run the SQL setup script**:
   - Copy the contents of `SUPABASE_SETUP_SQL.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute

3. **Verify the table was created**:
   - Go to "Table Editor" in the left sidebar
   - You should see a "houses" table
   - Click on it to view the data

## Step-by-Step Fix Process

### Step 1: Fix Local Development
```bash
# Stop the current dev server (Ctrl+C)
# Rename the environment file
mv env.local .env.local

# Start the dev server again
npm run dev
```

### Step 2: Set Up Supabase Database
1. Open https://supabase.com/dashboard/project/haczfsvknelbvlerkeox
2. Click "SQL Editor" in the left sidebar
3. Copy and paste this SQL:

```sql
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

-- Create policy to allow all operations
CREATE POLICY "Allow all operations" ON houses
  FOR ALL USING (true);

-- Create indexes for performance
CREATE INDEX idx_houses_created_at ON houses(created_at DESC);
CREATE INDEX idx_houses_location ON houses(latitude, longitude);

-- Insert test data
INSERT INTO houses (name, agent_name, latitude, longitude, notes) 
VALUES ('Test House', 'Test Agent', 40.7128, -74.0060, 'This is a test house in New York');
```

4. Click "Run" to execute the SQL

### Step 3: Test the Application
1. **Local Testing**:
   - Visit http://localhost:3000
   - You should see the app with debug info at the top
   - All environment variables should show "✅ Set"
   - Connection test should show "✅ Supabase connected successfully"

2. **Add a Test House**:
   - Click "Add House"
   - Fill in the form with test data
   - Save the house
   - Check Supabase Table Editor to see the data

3. **View Data in Supabase**:
   - Go to Table Editor → houses
   - You should see your saved houses

## Where to View Data in Supabase

### Real-time Data Location:
1. **Dashboard**: https://supabase.com/dashboard/project/haczfsvknelbvlerkeox
2. **Table Editor**: Dashboard → Table Editor → houses
3. **API Logs**: Dashboard → Logs (to see API requests)
4. **Database**: Dashboard → Database → Tables → houses

### Data Structure:
```sql
houses table:
- id (UUID, Primary Key)
- name (VARCHAR) - House name
- agent_name (VARCHAR) - Agent name
- latitude (DECIMAL) - Location latitude
- longitude (DECIMAL) - Location longitude
- notes (TEXT) - Additional notes
- created_at (TIMESTAMP) - When created
- updated_at (TIMESTAMP) - When last updated
```

## Troubleshooting

### If Still White Screen:
1. **Check file name**: Make sure the file is named `.env.local` (with the dot)
2. **Check file location**: The file should be in the project root (same level as package.json)
3. **Restart dev server**: Stop and start `npm run dev` again
4. **Check browser console**: Look for any JavaScript errors

### If No Data in Supabase:
1. **Check SQL execution**: Make sure the SQL ran without errors
2. **Check Table Editor**: Verify the "houses" table exists
3. **Check RLS policies**: Make sure the policy allows all operations
4. **Check API logs**: Look at Supabase logs for any errors

### If Connection Test Fails:
1. **Check environment variables**: Verify all are set correctly
2. **Check Supabase project**: Ensure the project is active
3. **Check network**: Make sure you can access Supabase

## Success Indicators

✅ **Local Development Working**:
- App loads without white screen
- Debug info shows all variables "✅ Set"
- Connection test shows "✅ Supabase connected successfully"

✅ **Supabase Data Working**:
- "houses" table exists in Table Editor
- Can add new houses and see them in Supabase
- No errors in browser console or Supabase logs

## Cleanup After Fixing

Once everything is working:
1. Remove the `DebugInfo` component from `src/pages/Home.jsx`
2. Remove the import statement for `DebugInfo`
3. The `TestConnection` component can stay for deployment testing
