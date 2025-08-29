import supabaseService from './supabase.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    console.log('🔗 API Service initialized with base URL:', this.baseURL);
  }

  // Helper method for making HTTP requests with fallback to Supabase
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      console.log('🌐 Making API request to:', url);
      const response = await fetch(url, defaultOptions);
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ API Response:', data);
      return data;
    } catch (error) {
      console.error('❌ API Request Error:', error);
      console.log('🔄 Falling back to direct Supabase connection...');
      throw error;
    }
  }

  // Health check with fallback
  async healthCheck() {
    try {
      return await this.makeRequest('/health');
    } catch (error) {
      console.log('🔄 Using Supabase fallback for health check');
      return await supabaseService.healthCheck();
    }
  }

  // Get all houses with fallback
  async getHouses(search = '', limit = 50, page = 1) {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (limit) params.append('limit', limit);
      if (page) params.append('page', page);

      const queryString = params.toString();
      const endpoint = `/houses${queryString ? `?${queryString}` : ''}`;
      
      return await this.makeRequest(endpoint);
    } catch (error) {
      console.log('🔄 Using Supabase fallback for getHouses');
      return await supabaseService.getHouses(search, limit, page);
    }
  }

  // Create new house with fallback
  async createHouse(houseData) {
    try {
      return await this.makeRequest('/houses', {
        method: 'POST',
        body: JSON.stringify(houseData),
      });
    } catch (error) {
      console.log('🔄 Using Supabase fallback for createHouse');
      return await supabaseService.createHouse(houseData);
    }
  }

  // Delete house with fallback
  async deleteHouse(id) {
    try {
      return await this.makeRequest(`/houses/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.log('🔄 Using Supabase fallback for deleteHouse');
      return await supabaseService.deleteHouse(id);
    }
  }

  // Other methods remain the same...
  async getHouse(id) {
    try {
      return await this.makeRequest(`/houses/${id}`);
    } catch (error) {
      console.log('🔄 Using Supabase fallback for getHouse');
      // For individual house, we'll get all houses and filter
      const result = await supabaseService.getHouses();
      const house = result.data.find(h => h.id === id);
      if (!house) throw new Error('House not found');
      return { success: true, data: house };
    }
  }

  async updateHouse(id, houseData) {
    try {
      return await this.makeRequest(`/houses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(houseData),
      });
    } catch (error) {
      console.log('🔄 Using Supabase fallback for updateHouse');
      throw new Error('Update not implemented in fallback');
    }
  }

  async deleteAllHouses() {
    try {
      return await this.makeRequest('/houses', {
        method: 'DELETE',
      });
    } catch (error) {
      console.log('🔄 Using Supabase fallback for deleteAllHouses');
      throw new Error('Delete all not implemented in fallback');
    }
  }

  async migrateFromLocalStorage(localData) {
    try {
      return await this.makeRequest('/migrate', {
        method: 'POST',
        body: JSON.stringify({ localData }),
      });
    } catch (error) {
      console.log('🔄 Using Supabase fallback for migrateFromLocalStorage');
      const results = [];
      
      for (const house of localData) {
        try {
          const result = await supabaseService.createHouse({
            name: house.name,
            agentName: house.agentName,
            location: {
              latitude: house.latitude,
              longitude: house.longitude
            },
            notes: house.notes || ''
          });
          results.push({ success: true, data: result.data, originalId: house.id });
        } catch (error) {
          results.push({ success: false, error: error.message, originalId: house.id });
        }
      }
      
      return {
        success: true,
        message: `Migration completed. ${results.filter(r => r.success).length} houses migrated successfully.`,
        results
      };
    }
  }
}

const apiService = new ApiService();
export default apiService;
