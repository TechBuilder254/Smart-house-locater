import React, { useState, useEffect } from 'react'
import { Home as HomeIcon } from 'lucide-react'
import HousesList from '../components/HousesList'
import apiService from '../services/api'

const SavedHouses = ({ user }) => {
  const [houses, setHouses] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load houses from Supabase API (same as Home page)
  const loadHouses = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await apiService.getHouses()
      if (response.success) {
        setHouses(response.data)
      } else {
        throw new Error(response.message || 'Failed to load houses')
      }
    } catch (error) {
      console.error('Error loading houses:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadHouses()
    }
  }, [user])

  const deleteHouse = async (houseId) => {
    try {
      const response = await apiService.deleteHouse(houseId)
      if (response.success) {
        setHouses(prev => prev.filter(house => house.id !== houseId))
      } else {
        throw new Error(response.message || 'Failed to delete house')
      }
    } catch (error) {
      console.error('Error deleting house:', error)
      alert(`Error deleting house: ${error.message}`)
    }
  }

  const filteredHouses = houses.filter(house =>
    house.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    house.agent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (house.notes && house.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="relative mx-auto mb-6 w-16 h-16">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full shadow-lg">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Loading your houses...</h3>
            <p className="text-gray-500">Fetching data from cloud database</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="relative mx-auto mb-6 w-16 h-16">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-lg opacity-30"></div>
              <div className="relative bg-gradient-to-r from-red-600 to-pink-600 p-4 rounded-full shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Failed to load houses</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={loadHouses}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show authentication prompt
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center max-w-md">
            <div className="relative mx-auto mb-6 w-16 h-16">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-30"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full shadow-lg">
                <HomeIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Access Your Saved Houses</h3>
            <p className="text-gray-500 mb-6">Please sign in to view your saved properties</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Sign In to Continue
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Saved Houses
          </h1>
          <p className="text-lg text-white/70">
            Manage and view all your saved properties ({houses.length} total)
          </p>
        </div>
        
        <HousesList 
          houses={filteredHouses}
          onDeleteHouse={deleteHouse}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>
    </div>
  )
}

export default SavedHouses
