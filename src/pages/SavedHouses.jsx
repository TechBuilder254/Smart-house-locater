import React, { useState, useEffect } from 'react'
import { Home as HomeIcon, ArrowLeft } from 'lucide-react'
import HousesList from '../components/HousesList'
import Header from '../components/Header'
import apiService from '../services/api'

const SavedHouses = ({ user }) => {
  const [houses, setHouses] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAll, setShowAll] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
    (house.agent_name && house.agent_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (house.caretaker_name && house.caretaker_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (house.notes && house.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Show only first 3 houses unless "see more" is clicked
  const displayedHouses = showAll ? filteredHouses : filteredHouses.slice(0, 3)

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header 
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          user={user}
          showBackButton={true}
          title="Saved Properties"
        />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="relative mx-auto mb-6 w-16 h-16">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full shadow-lg">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Loading your properties...</h3>
              <p className="text-gray-500">Fetching data from cloud database</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header 
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          user={user}
          showBackButton={true}
          title="Saved Properties"
        />
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
              <h3 className="text-xl font-bold text-gray-700 mb-2">Failed to load properties</h3>
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
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header 
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        user={user}
        showBackButton={true}
        title="Saved Properties"
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl blur-lg opacity-30"></div>
              <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-xl shadow-lg">
                <HomeIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Saved Properties</h1>
              <p className="text-gray-600 mt-1">Manage your property collection</p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <HomeIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Properties</p>
                  <p className="text-2xl font-bold text-gray-900">{houses.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">With Caretakers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {houses.filter(h => h.caretaker_name).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Agents</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(houses.filter(h => h.agent_name).map(h => h.agent_name)).size}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Houses List */}
        <HousesList
          houses={displayedHouses}
          onDeleteHouse={deleteHouse}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* See More Button */}
        {filteredHouses.length > 3 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(!showAll)}
              className="btn btn-secondary"
            >
              {showAll ? 'Show Less' : `See More (${filteredHouses.length - 3} more)`}
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredHouses.length === 0 && houses.length > 0 && (
          <div className="text-center mt-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No properties found</h3>
            <p className="text-gray-500">Try adjusting your search terms</p>
          </div>
        )}

        {houses.length === 0 && (
          <div className="text-center mt-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HomeIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No properties yet</h3>
            <p className="text-gray-500 mb-4">Start by adding your first property</p>
            <a href="/add-house" className="btn btn-primary">
              Add Property
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default SavedHouses
