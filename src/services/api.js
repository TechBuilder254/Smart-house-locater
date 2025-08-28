const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method for making HTTP requests
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.makeRequest('/health');
  }

  // Get all houses with optional search and pagination
  async getHouses(search = '', limit = 50, page = 1) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (limit) params.append('limit', limit);
    if (page) params.append('page', page);

    const queryString = params.toString();
    const endpoint = `/houses${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest(endpoint);
  }

  // Get single house by ID
  async getHouse(id) {
    return this.makeRequest(`/houses/${id}`);
  }

  // Create new house
  async createHouse(houseData) {
    return this.makeRequest('/houses', {
      method: 'POST',
      body: JSON.stringify(houseData),
    });
  }

  // Update house
  async updateHouse(id, houseData) {
    return this.makeRequest(`/houses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(houseData),
    });
  }

  // Delete house
  async deleteHouse(id) {
    return this.makeRequest(`/houses/${id}`, {
      method: 'DELETE',
    });
  }

  // Delete all houses
  async deleteAllHouses() {
    return this.makeRequest('/houses', {
      method: 'DELETE',
    });
  }

  // Migrate data from localStorage to MongoDB
  async migrateFromLocalStorage(localData) {
    try {
      const results = [];
      
      for (const house of localData) {
        try {
          const result = await this.createHouse({
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
    } catch (error) {
      throw new Error(`Migration failed: ${error.message}`);
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
