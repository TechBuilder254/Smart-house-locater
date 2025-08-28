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
