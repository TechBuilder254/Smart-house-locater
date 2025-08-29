# 🚀 Deployment Checklist - Smart House Locator

## ✅ Pre-Deployment Fixes Completed

- [x] **Removed hardcoded Supabase credentials** from `src/services/supabase.js`
- [x] **Updated environment variables** to use `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- [x] **Fixed Vite configuration** to use environment variables for API proxy
- [x] **Updated Vercel configuration** to include environment variables
- [x] **Added connection test component** for debugging
- [x] **Verified build process** works correctly

## 🔧 Environment Variables to Set in Vercel

### Required Variables:
1. **VITE_SUPABASE_URL** = `https://haczfsvknelbvlerkeox.supabase.co`
2. **VITE_SUPABASE_ANON_KEY** = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhY3pmc3ZrbmVsYnZsZXJrZW94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzODUzMzQsImV4cCI6MjA3MTk2MTMzNH0.xSX9yt6iv734UqTnMdx3LoA5lGRYugPPEzPqEYRuiYY`
3. **VITE_API_URL** = `/api`

## 📋 Deployment Steps

### Step 1: Delete Existing Vercel Project
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Find your existing Smart House Locator project
3. Click on the project settings (gear icon)
4. Scroll down to "Delete Project"
5. Confirm deletion

### Step 2: Create New Vercel Project
1. Click "New Project" in Vercel dashboard
2. Import your GitHub repository
3. **IMPORTANT**: Before deploying, go to "Environment Variables"

### Step 3: Set Environment Variables
1. In project settings, go to "Environment Variables"
2. Add these variables:
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: `https://haczfsvknelbvlerkeox.supabase.co`
   - **Environment**: Production, Preview, Development

   - **Name**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhY3pmc3ZrbmVsYnZsZXJrZW94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzODUzMzQsImV4cCI6MjA3MTk2MTMzNH0.xSX9yt6iv734UqTnMdx3LoA5lGRYugPPEzPqEYRuiYY`
   - **Environment**: Production, Preview, Development

   - **Name**: `VITE_API_URL`
   - **Value**: `/api`
   - **Environment**: Production, Preview, Development

### Step 4: Deploy
1. Click "Deploy" button
2. Wait for build to complete
3. Check deployment logs for any errors

## 🧪 Testing After Deployment

### 1. Connection Test
- Visit your deployed app
- Look for the "Connection Test" component at the top
- Should show "✅ Supabase connected successfully"
- Environment variables should show "✅ Set"

### 2. Add a Test House
- Click "Add House"
- Fill in the form with test data
- Save the house
- Should show success message

### 3. View Data in Supabase
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `haczfsvknelbvlerkeox`
3. Click "Table Editor" in left sidebar
4. Click on "houses" table
5. You should see your test data

## 📊 Where to View Data in Supabase

### Real-time Data Location:
1. **Dashboard**: https://supabase.com/dashboard/project/haczfsvknelbvlerkeox
2. **Table Editor**: Dashboard → Table Editor → houses
3. **API Logs**: Dashboard → Logs (to see API requests)
4. **Database**: Dashboard → Database → Tables → houses

### Data Structure:
```sql
houses table:
- id (UUID, Primary Key)
- name (VARCHAR)
- agent_name (VARCHAR)
- latitude (DECIMAL)
- longitude (DECIMAL)
- notes (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## 🔍 Troubleshooting

### If Connection Test Fails:
1. **Check Environment Variables**: Verify all 3 variables are set in Vercel
2. **Check Supabase**: Ensure your Supabase project is active
3. **Check Build Logs**: Look for any build errors in Vercel

### If Data Not Saving:
1. **Check Supabase RLS**: Ensure Row Level Security allows operations
2. **Check API Logs**: Look at Supabase logs for errors
3. **Check Browser Console**: Look for JavaScript errors

### If Build Fails:
1. **Check Dependencies**: All required packages are in package.json
2. **Check Environment Variables**: All required variables are set
3. **Check Vercel Logs**: Look for specific build errors

## 🧹 Post-Deployment Cleanup

After successful deployment and testing:
1. Remove the `TestConnection` component from `src/pages/Home.jsx`
2. Remove the import statement for `TestConnection`
3. Commit and push the changes
4. Redeploy to remove the test component

## ✅ Success Indicators

Your deployment is successful when:
- [ ] Connection test shows "✅ Supabase connected successfully"
- [ ] You can add a new house and see success message
- [ ] Data appears in Supabase Table Editor
- [ ] No console errors in browser
- [ ] All environment variables show "✅ Set"

## 🆘 Need Help?

If you encounter issues:
1. Check the deployment logs in Vercel
2. Check browser console for errors
3. Verify environment variables are set correctly
4. Test Supabase connection in dashboard
5. Check the `DEPLOYMENT_GUIDE.md` for detailed troubleshooting
