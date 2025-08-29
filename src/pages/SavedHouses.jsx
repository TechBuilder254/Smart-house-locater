import React, { useState, useEffect } from 'react'
import { Home as HomeIcon, Search, Filter, Grid, List, Eye, Edit, Trash2, MapPin, User, Calendar, Phone, Navigation } from 'lucide-react'
import Header from '../components/Header'
import apiService from '../services/api'

const SavedHouses = ({ user }) => {
  const [houses, setHouses] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAll, setShowAll] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [filterBy, setFilterBy] = useState('all') // 'all', 'with-caretaker', 'without-caretaker'

  // Load houses from Supabase API
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
    if (window.confirm('Are you sure you want to delete this property?')) {
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
  }

  // Navigate to property location
  const navigateToLocation = (house) => {
    const { latitude, longitude, name } = house
    
    // Ask for permission before navigating
    const confirmed = confirm(
      `Navigate to ${formatHouseName(name)}?\n\n` +
      `This will open Google Maps with directions to:\n` +
      `📍 ${latitude.toFixed(6)}, ${longitude.toFixed(6)}\n\n` +
      `Click OK to continue to Google Maps.`
    )
    
    if (!confirmed) return
    
    // Check if device supports navigation
    if (navigator.share) {
      // Use native sharing on mobile devices
      navigator.share({
        title: `Navigate to ${name}`,
        text: `Navigate to ${name}`,
        url: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
      }).catch(() => {
        // Fallback to opening in new tab
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`, '_blank')
      })
    } else {
      // Fallback for desktop browsers
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`, '_blank')
    }
  }

  // Filter houses based on search and filter criteria
  const filteredHouses = houses.filter(house => {
    const matchesSearch = house.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (house.agent_name && house.agent_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (house.caretaker_name && house.caretaker_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (house.notes && house.notes.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesFilter = filterBy === 'all' ||
      (filterBy === 'with-caretaker' && house.caretaker_name) ||
      (filterBy === 'without-caretaker' && !house.caretaker_name)

    return matchesSearch && matchesFilter
  })

  // Show only first 6 houses unless "see more" is clicked
  const displayedHouses = showAll ? filteredHouses : filteredHouses.slice(0, 6)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Format house name to preserve numbers
  const formatHouseName = (name) => {
    // If the name is just a number, return it as is
    if (/^\d+$/.test(name.trim())) {
      return name.trim()
    }
    // Otherwise return the name as entered
    return name
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          user={user}
          showBackButton={true}
          title="Properties"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
      <div className="min-h-screen bg-gray-50">
        <Header 
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          user={user}
          showBackButton={true}
          title="Properties"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Failed to load properties</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={loadHouses}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
    <div className="min-h-screen bg-gray-50">
      <Header 
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        user={user}
        showBackButton={true}
        title="Properties"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
              <p className="text-gray-600 mt-2">Manage your property collection</p>
            </div>
            <a
              href="/add-house"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <HomeIcon className="w-4 h-4" />
              Add Property
            </a>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <HomeIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold text-gray-900">{houses.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">With Caretakers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {houses.filter(h => h.caretaker_name).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Agents</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(houses.filter(h => h.agent_name).map(h => h.agent_name)).size}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {houses.filter(h => {
                    const created = new Date(h.created_at)
                    const now = new Date()
                    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search properties by name, agent, or caretaker..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Properties</option>
                <option value="with-caretaker">With Caretakers</option>
                <option value="without-caretaker">Without Caretakers</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Grid/List */}
        {displayedHouses.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {displayedHouses.map((house) => (
              <div
                key={house.id}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${
                  viewMode === 'list' ? 'flex items-center p-6' : 'p-6'
                }`}
              >
                {viewMode === 'grid' ? (
                  // Grid View
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{formatHouseName(house.name)}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{house.latitude.toFixed(4)}, {house.longitude.toFixed(4)}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => navigateToLocation(house)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          title="Navigate to location"
                        >
                          <Navigation className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          onClick={() => deleteHouse(house.id)}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {house.agent_name && (
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Agent: <span className="font-medium">{house.agent_name}</span></span>
                        </div>
                      )}
                      
                      {house.caretaker_name && (
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Caretaker: <span className="font-medium">{house.caretaker_name}</span></span>
                        </div>
                      )}

                      {house.caretaker_phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{house.caretaker_phone}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>Added {formatDate(house.created_at)}</span>
                      </div>

                      {house.notes && (
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          {house.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  // List View
                  <>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{formatHouseName(house.name)}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {house.latitude.toFixed(4)}, {house.longitude.toFixed(4)}
                        </span>
                        {house.agent_name && (
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            Agent: {house.agent_name}
                          </span>
                        )}
                        {house.caretaker_name && (
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            Caretaker: {house.caretaker_name}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(house.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigateToLocation(house)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        title="Navigate to location"
                      >
                        <Navigation className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        onClick={() => deleteHouse(house.id)}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <HomeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterBy !== 'all' ? 'No properties found' : 'No properties yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterBy !== 'all' ? 'Try adjusting your search or filter criteria' : 'Start by adding your first property'}
            </p>
            {!searchTerm && filterBy === 'all' && (
              <a
                href="/add-house"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Property
              </a>
            )}
          </div>
        )}

        {/* See More Button */}
        {filteredHouses.length > 6 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(!showAll)}
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {showAll ? 'Show Less' : `See More (${filteredHouses.length - 6} more)`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SavedHouses
