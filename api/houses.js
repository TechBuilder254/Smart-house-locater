import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getHouses(req, res);
      case 'POST':
        return await createHouse(req, res);
      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
}

async function getHouses(req, res) {
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
}

async function createHouse(req, res) {
  const { name, agentName, location, notes } = req.body;
  
  // Validation
  if (!name || !agentName || !location || !location.latitude || !location.longitude) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: name, agentName, and location (latitude, longitude)'
    });
  }
  
  // Additional validation for coordinates
  const lat = parseFloat(location.latitude);
  const lng = parseFloat(location.longitude);
  
  if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return res.status(400).json({
      success: false,
      message: 'Invalid coordinates provided'
    });
  }
  
  const houseData = {
    name: name.trim(),
    agent_name: agentName.trim(),
    latitude: lat,
    longitude: lng,
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
}


