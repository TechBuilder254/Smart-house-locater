# Smart House Locator - Deployment Guide

## Environment Variables Required

### For Vercel Deployment

You need to set these environment variables in your Vercel project settings:

1. **VITE_SUPABASE_URL** - Your Supabase project URL
   - Format: `https://your-project-id.supabase.co`
   - Example: `https://haczfsvknelbvlerkeox.supabase.co`

2. **VITE_SUPABASE_ANON_KEY** - Your Supabase anonymous key
   - Format: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - This is your public anon key (safe to expose in frontend)

3. **VITE_API_URL** - API base URL (usually `/api` for Vercel)
   - Value: `/api`

### For Local Development

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_API_URL=/api
VITE_API_PROXY_TARGET=http://localhost:5000
```

## Deployment Steps

### 1. Delete Existing Vercel Project
- Go to your Vercel dashboard
- Delete the existing project completely

### 2. Set Up Environment Variables in Vercel
- Create a new project in Vercel
- Go to Project Settings → Environment Variables
- Add the three environment variables listed above

### 3. Deploy to Vercel
- Connect your GitHub repository to Vercel
- Deploy the project

## Supabase Database Setup

### 1. Create the Houses Table

Run this SQL in your Supabase SQL editor:

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

-- Create policy to allow all operations (for demo purposes)
-- In production, you should create more restrictive policies
CREATE POLICY "Allow all operations" ON houses
  FOR ALL USING (true);

-- Create index for better performance
CREATE INDEX idx_houses_created_at ON houses(created_at DESC);
CREATE INDEX idx_houses_location ON houses(latitude, longitude);
```

### 2. Where to View Data in Supabase

1. **Dashboard**: Go to your Supabase project dashboard
2. **Table Editor**: Click on "Table Editor" in the left sidebar
3. **Houses Table**: Click on the "houses" table
4. **Data View**: You'll see all your saved houses with their details

### 3. Real-time Data Monitoring

- **Logs**: Go to "Logs" in the sidebar to see API requests
- **Database**: Go to "Database" → "Tables" → "houses" to view data
- **API**: Use the "API" section to test queries directly

## Testing the Deployment

### 1. Health Check
Visit: `https://your-domain.vercel.app/api/health`

### 2. Add a Test House
- Go to your deployed app
- Click "Add House"
- Fill in the details and save
- Check Supabase dashboard to confirm data is saved

### 3. View Saved Houses
- Go to "Saved Houses" page
- Verify houses are loading from Supabase

## Troubleshooting

### Common Issues

1. **Environment Variables Not Set**
   - Error: "Missing Supabase environment variables"
   - Solution: Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel

2. **CORS Issues**
   - Error: "CORS policy blocked"
   - Solution: API routes already have CORS headers configured

3. **Database Connection Issues**
   - Error: "Supabase connection failed"
   - Solution: Check your Supabase URL and key are correct

4. **Build Failures**
   - Error: Build fails during deployment
   - Solution: Check that all dependencies are in package.json

### Debug Steps

1. Check Vercel deployment logs
2. Verify environment variables are set correctly
3. Test Supabase connection in the dashboard
4. Check browser console for frontend errors

## Security Notes

- The VITE_SUPABASE_ANON_KEY is safe to expose in the frontend
- Row Level Security (RLS) is enabled but set to allow all operations for demo
- In production, create more restrictive RLS policies
- Never expose your Supabase service role key in the frontend

## Performance Optimization

- Database indexes are created for better query performance
- Pagination is implemented for large datasets
- API responses are optimized for minimal data transfer
