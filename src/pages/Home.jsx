import React, { useState, useEffect } from 'react'
import { MapPin, Home as HomeIcon, Users, Network, Plus, Search, Filter } from 'lucide-react'
import TestConnection from '../components/TestConnection'
import SimpleMap from '../components/SimpleMap'
import apiService from '../services/api'

const Home = ({ user }) => {
  const [houses, setHouses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedHouse, setSelectedHouse] = useState(null)
  const [mapCenter, setMapCenter] = useState({ lat: -1.2921, lng: 36.8219 }) // Nairobi center

  // Load houses from API
  const loadHouses = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await apiService.getHouses()
      if (response.success) {
        setHouses(response.data)
        
        // Set map center to first house if available
        if (response.data.length > 0) {
          setMapCenter({
            lat: response.data[0].latitude,
            lng: response.data[0].longitude
          })
        }
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
    loadHouses()
  }, [])

  // Filter houses based on search term
  const filteredHouses = houses.filter(house =>
    house.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (house.agent_name && house.agent_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (house.caretaker_name && house.caretaker_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (house.notes && house.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleHouseClick = (house) => {
    setSelectedHouse(house)
    setMapCenter({ lat: house.latitude, lng: house.longitude })
  }

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
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
            <h3 className="text-xl font-bold text-gray-700 mb-2">Welcome to Smart House Locator</h3>
            <p className="text-gray-500 mb-6">Please sign in to view and manage your property network</p>
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
            <h3 className="text-xl font-bold text-gray-700 mb-2">Loading your house network...</h3>
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Connection Test - Keep for deployment verification */}
      <div className="mb-6">
        <TestConnection />
      </div>

      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          🏠 Smart House Network
        </h1>
        <p className="text-xl text-white/80 mb-6">
          Visualize your property network and discover new opportunities
        </p>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-center mb-3">
              <HomeIcon className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{houses.length}</h3>
            <p className="text-white/70">Total Properties</p>
          </div>
          
                     <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
             <div className="flex items-center justify-center mb-3">
               <Users className="w-8 h-8 text-green-400" />
             </div>
             <h3 className="text-2xl font-bold text-white mb-1">
               {new Set(houses.filter(h => h.agent_name).map(h => h.agent_name)).size}
             </h3>
             <p className="text-white/70">Agents</p>
           </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-center mb-3">
              <Network className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {houses.length > 1 ? Math.round(houses.reduce((acc, house, i) => {
                if (i === 0) return 0
                return acc + calculateDistance(
                  houses[i-1].latitude, houses[i-1].longitude,
                  house.latitude, house.longitude
                )
              }, 0)) : 0}
            </h3>
            <p className="text-white/70">Network Coverage (km)</p>
          </div>
        </div>
      </div>

      {/* Map and List Section */}
      <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Map Section */}
        <div className="card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl"></div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-lg opacity-30"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
                <MapPin className="w-7 h-7 text-white" />
              </div>
            </div>
                         <div>
               <h2 className="text-2xl font-bold gradient-text">Property Network Visualization</h2>
               <p className="text-gray-600">Interactive network showing all properties with connections</p>
             </div>
          </div>

          {/* Simple Network Map */}
          <SimpleMap 
            houses={houses}
            selectedHouse={selectedHouse}
            onHouseClick={handleHouseClick}
            center={mapCenter}
          />

          {/* Selected House Info */}
          {selectedHouse && (
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-gray-800 mb-2">{selectedHouse.name}</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {selectedHouse.agent_name && (
                  <div>
                    <p className="text-gray-600">Agent</p>
                    <p className="font-medium">{selectedHouse.agent_name}</p>
                  </div>
                )}
                {selectedHouse.caretaker_name && (
                  <div>
                    <p className="text-gray-600">Caretaker</p>
                    <p className="font-medium">{selectedHouse.caretaker_name}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-600">Coordinates</p>
                  <p className="font-mono text-xs">{selectedHouse.latitude.toFixed(6)}, {selectedHouse.longitude.toFixed(6)}</p>
                </div>
              </div>
              {selectedHouse.notes && (
                <div className="mt-2">
                  <p className="text-gray-600 text-sm">Notes</p>
                  <p className="text-sm">{selectedHouse.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Properties List */}
        <div className="card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-2xl"></div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl blur-lg opacity-30"></div>
                <div className="relative bg-gradient-to-r from-green-600 to-blue-600 p-3 rounded-xl shadow-lg">
                  <HomeIcon className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold gradient-text">All Properties</h2>
                <p className="text-gray-600">Browse and manage your properties</p>
              </div>
            </div>
            <a
              href="/add-house"
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Property
            </a>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
        />
      </div>

          {/* Properties List */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredHouses.length === 0 ? (
              <div className="text-center py-8">
                <HomeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  {searchTerm ? 'No properties found' : 'No properties yet'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm ? 'Try adjusting your search terms' : 'Add your first property to get started'}
                </p>
                {!searchTerm && (
                  <a href="/add-house" className="btn btn-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Property
                  </a>
                )}
              </div>
            ) : (
              filteredHouses.map((house) => (
                <div
                  key={house.id}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedHouse?.id === house.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                  }`}
                  onClick={() => handleHouseClick(house)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{house.name}</h3>
                                             {house.caretaker_name && (
                         <p className="text-sm text-gray-600 mb-2">Caretaker: {house.caretaker_name}</p>
                       )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>📍 {house.latitude.toFixed(4)}, {house.longitude.toFixed(4)}</span>
                        <span>📅 {new Date(house.created_at).toLocaleDateString()}</span>
                      </div>
                      {house.notes && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{house.notes}</p>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* View All Button */}
          {houses.length > 0 && (
            <div className="mt-6 text-center">
              <a href="/saved-houses" className="btn btn-secondary">
                View All Properties ({houses.length})
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
