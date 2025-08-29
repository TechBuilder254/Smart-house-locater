import { supabase } from './supabase'

const apiService = {
  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Get houses for current user
  getHouses: async () => {
    try {
      const { data, error } = await supabase
        .from('houses')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error('Error fetching houses:', error)
      return { success: false, message: error.message }
    }
  },

  // Create a new house
  createHouse: async (houseData) => {
    try {
      const { data, error } = await supabase
        .from('houses')
        .insert([{
          name: houseData.name,
          latitude: houseData.location.latitude,
          longitude: houseData.location.longitude,
          notes: houseData.notes,
          caretaker_name: houseData.caretaker_name,
          caretaker_phone: houseData.caretaker_phone
        }])
        .select()
        .single()

      if (error) {
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error('Error creating house:', error)
      return { success: false, message: error.message }
    }
  },

  // Delete a house
  deleteHouse: async (houseId) => {
    try {
      const { error } = await supabase
        .from('houses')
        .delete()
        .eq('id', houseId)

      if (error) {
        throw error
      }

      return { success: true }
    } catch (error) {
      console.error('Error deleting house:', error)
      return { success: false, message: error.message }
    }
  },

  // Update a house
  updateHouse: async (houseId, updates) => {
    try {
      const { data, error } = await supabase
        .from('houses')
        .update(updates)
        .eq('id', houseId)
        .select()
        .single()

      if (error) {
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error('Error updating house:', error)
      return { success: false, message: error.message }
    }
  },

  // Sign out user
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
      return { success: true }
    } catch (error) {
      console.error('Error signing out:', error)
      return { success: false, message: error.message }
    }
  }
}

export default apiService
