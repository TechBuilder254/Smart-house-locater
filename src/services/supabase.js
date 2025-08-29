import { createClient } from '@supabase/supabase-js';

// Supabase configuration - using environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

const supabase = createClient(supabaseUrl, supabaseKey);

class SupabaseService {
  constructor() {
    this.supabase = supabase;
    console.log('🔗 Supabase client initialized');
  }

  // Health check
  async healthCheck() {
    try {
      const { data, error } = await this.supabase.from('houses').select('count').limit(1);
      if (error) throw error;
      return { status: 'OK', message: 'Supabase connected successfully', database: 'Supabase' };
    } catch (error) {
      throw new Error(`Supabase connection failed: ${error.message}`);
    }
  }

  // Get all houses with optional search and pagination
  async getHouses(search = '', limit = 50, page = 1) {
    try {
      let query = this.supabase
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
      
      if (error) throw error;
      
      return {
        success: true,
        data: houses || [],
        pagination: {
          total: count || 0,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil((count || 0) / parseInt(limit))
        }
      };
    } catch (error) {
      console.error('Error fetching houses:', error);
      throw new Error(`Failed to fetch houses: ${error.message}`);
    }
  }

  // Create new house
  async createHouse(houseData) {
    try {
      const { name, agentName, location, notes } = houseData;
      
      // Validation
      if (!name || !agentName || !location || !location.latitude || !location.longitude) {
        throw new Error('Missing required fields: name, agentName, and location (latitude, longitude)');
      }
      
      const data = {
        name: name.trim(),
        agent_name: agentName.trim(),
        latitude: parseFloat(location.latitude),
        longitude: parseFloat(location.longitude),
        notes: notes ? notes.trim() : ''
      };
      
      const { data: house, error } = await this.supabase
        .from('houses')
        .insert([data])
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        success: true,
        message: 'House saved successfully',
        data: house
      };
    } catch (error) {
      console.error('Error creating house:', error);
      throw new Error(`Failed to save house: ${error.message}`);
    }
  }

  // Delete house
  async deleteHouse(id) {
    try {
      const { error } = await this.supabase
        .from('houses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return {
        success: true,
        message: 'House deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting house:', error);
      throw new Error(`Failed to delete house: ${error.message}`);
    }
  }
}

const supabaseService = new SupabaseService();
export default supabaseService;
