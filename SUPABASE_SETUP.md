# 🚀 Supabase Setup Guide for Smart House Locator

## 📋 Overview
This guide will help you set up Supabase as your database for the Smart House Locator application.

## 🎯 Step-by-Step Setup

### Step 1: Create Supabase Account
1. **Go to**: https://supabase.com
2. **Click**: "Start your project"
3. **Sign up** with GitHub (recommended) or create an account
4. **Create a new project**

### Step 2: Set Up Database Table
1. **Go to "SQL Editor"** in the left sidebar
2. **Run this SQL** to create the houses table:

```sql
-- Create houses table
CREATE TABLE houses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  agent_name VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_houses_name ON houses(name);
CREATE INDEX idx_houses_agent_name ON houses(agent_name);
CREATE INDEX idx_houses_created_at ON houses(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE houses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for development)
CREATE POLICY "Allow all operations" ON houses FOR ALL USING (true);
```

### Step 3: Get Your Credentials
1. **Go to "Settings" → "API"** in the left sidebar
2. **Copy these values:**
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public key** (starts with `eyJ...`)

### Step 4: Update Environment File
Update your `server/.env` file with Supabase credentials:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Security
JWT_SECRET=your_jwt_secret_here
```

### Step 5: Install Dependencies
The Supabase client is already installed. If not, run:
```bash
cd server
npm install @supabase/supabase-js
```

### Step 6: Create Supabase Server
Replace your `server/server.js` with the Supabase version:

```javascript
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Supabase Configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!');
  console.error('Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Test Supabase connection
const testSupabaseConnection = async () => {
  try {
    console.log('🔗 Testing Supabase connection...');
    const { data, error } = await supabase.from('houses').select('count').limit(1);
    
    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connected successfully!');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection error:', error.message);
    return false;
  }
};

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Smart House Locator API is running with Supabase',
    database: 'Supabase',
    timestamp: new Date().toISOString()
  });
});

// Get all houses
app.get('/api/houses', async (req, res) => {
  try {
    const { search, limit = 50, page = 1 } = req.query;
    
    let query = supabase
      .from('houses')
      .select('*', { count: 'exact' });
    
    // Search functionality
    if (search) {
      query = query.or(`name.ilike.%${search}%,agent_name.ilike.%${search}%,notes.ilike.%${search}%`);
    }
    
    // Pagination
    const from = (parseInt(page) - 1) * parseInt(limit);
    const to = from + parseInt(limit) - 1;
    
    const { data: houses, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (error) {
      throw error;
    }
    
    res.json({
      success: true,
      data: houses || [],
      pagination: {
        total: count || 0,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil((count || 0) / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching houses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch houses',
      error: error.message
    });
  }
});

// Create new house
app.post('/api/houses', async (req, res) => {
  try {
    const { name, agentName, location, notes } = req.body;
    
    // Validation
    if (!name || !agentName || !location || !location.latitude || !location.longitude) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, agentName, and location (latitude, longitude)'
      });
    }
    
    const houseData = {
      name: name.trim(),
      agent_name: agentName.trim(),
      latitude: parseFloat(location.latitude),
      longitude: parseFloat(location.longitude),
      notes: notes ? notes.trim() : ''
    };
    
    const { data: house, error } = await supabase
      .from('houses')
      .insert([houseData])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    res.status(201).json({
      success: true,
      message: 'House saved successfully',
      data: house
    });
  } catch (error) {
    console.error('Error creating house:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save house',
      error: error.message
    });
  }
});

// Delete house
app.delete('/api/houses/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('houses')
      .delete()
      .eq('id', req.params.id);
    
    if (error) {
      throw error;
    }
    
    res.json({
      success: true,
      message: 'House deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting house:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete house',
      error: error.message
    });
  }
});

// Migration endpoint for localStorage data
app.post('/api/migrate', async (req, res) => {
  try {
    const { localData } = req.body;
    
    if (!Array.isArray(localData)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format'
      });
    }
    
    const housesToInsert = localData.map(house => ({
      name: house.name,
      agent_name: house.agentName || house.agent,
      latitude: house.location.latitude,
      longitude: house.location.longitude,
      notes: house.notes || ''
    }));
    
    const { data, error } = await supabase
      .from('houses')
      .insert(housesToInsert)
      .select();
    
    if (error) {
      throw error;
    }
    
    res.json({
      success: true,
      message: `Successfully migrated ${data.length} houses`,
      data: data
    });
  } catch (error) {
    console.error('Error migrating data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to migrate data',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const startServer = async () => {
  console.log('🚀 Starting Smart House Locator API with Supabase...');
  
  // Test Supabase connection
  const isConnected = await testSupabaseConnection();
  if (!isConnected) {
    console.error('❌ Failed to connect to Supabase. Please check your credentials.');
    process.exit(1);
  }
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 API Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🏠 Smart House Locator API ready with Supabase!`);
  });
};

startServer();
```

### Step 7: Update Frontend API Service
Update your `src/services/api.js` to work with Supabase:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async healthCheck() {
    return this.makeRequest('/health');
  }

  async getHouses(search = '', limit = 50, page = 1) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (limit) params.append('limit', limit);
    if (page) params.append('page', page);
    
    return this.makeRequest(`/houses?${params.toString()}`);
  }

  async createHouse(houseData) {
    return this.makeRequest('/houses', {
      method: 'POST',
      body: JSON.stringify(houseData),
    });
  }

  async deleteHouse(id) {
    return this.makeRequest(`/houses/${id}`, {
      method: 'DELETE',
    });
  }

  async migrateFromLocalStorage(localData) {
    return this.makeRequest('/migrate', {
      method: 'POST',
      body: JSON.stringify({ localData }),
    });
  }
}

const apiService = new ApiService();
export default apiService;
```

### Step 8: Test the Setup
1. **Start the server**: `cd server && npm run dev`
2. **Test the API**: Visit `http://localhost:5000/api/health`
3. **Start the frontend**: `npm run dev`

## 🎉 Benefits of Supabase

- ✅ **Better connectivity** - No DNS issues like MongoDB Atlas
- ✅ **Real-time features** - Built-in subscriptions
- ✅ **Built-in authentication** - User management included
- ✅ **Auto-generated APIs** - REST and GraphQL
- ✅ **Database dashboard** - Easy to manage data
- ✅ **Free tier** - Generous limits

## 🔧 Troubleshooting

### Connection Issues
- Check your Supabase URL and API key
- Ensure the table was created correctly
- Verify RLS policies are set up

### Data Issues
- Check the table structure matches the expected format
- Verify data types (latitude/longitude as decimals)

## 📞 Support

Once you've set up Supabase, let me know and I'll help you test the connection and get everything working!
