import React, { useState, useEffect } from 'react'
import { Home, MapPin, Plus, TrendingUp, Users, Calendar, Search, Filter, Eye, Edit, Trash2, Clock, Map, Navigation } from 'lucide-react'
import Header from '../components/Header'
import SimpleMap from '../components/SimpleMap'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'
import apiService from '../services/api'

const Dashboard = ({ user }) => {
  const [houses, setHouses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedHouse, setSelectedHouse] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, house: null })

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

  const handleDeleteClick = (house) => {
    setDeleteModal({ isOpen: true, house })
  }

  const handleDeleteConfirm = async () => {
    try {
      const response = await apiService.deleteHouse(deleteModal.house.id)
      if (response.success) {
        setHouses(prev => prev.filter(house => house.id !== deleteModal.house.id))
        alert('Property deleted successfully!')
      } else {
        throw new Error(response.message || 'Failed to delete house')
      }
    } catch (error) {
      console.error('Error deleting house:', error)
      alert(`Error deleting property: ${error.message}`)
    }
  }

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, house: null })
  }

  // Navigate to property location
  const navigateToLocation = (house) => {
    const { latitude, longitude, name } = house
    
    // Directly open Google Maps with directions
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`, '_blank')
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

  const filteredHouses = houses.filter(house =>
    house.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (house.agent_name && house.agent_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (house.caretaker_name && house.caretaker_name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const recentHouses = filteredHouses.slice(0, 5)
  const totalProperties = houses.length
  const propertiesWithCaretakers = houses.filter(h => h.caretaker_name).length
  const activeAgents = new Set(houses.filter(h => h.agent_name).map(h => h.agent_name)).size
  const latestAddition = houses.length > 0 ? houses[0] : null

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          user={user}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Loading Dashboard...</h3>
              <p className="text-gray-500">Fetching your property data</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          user={user}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Failed to load dashboard</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={loadHouses}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
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
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's an overview of your properties.</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold text-gray-900">{totalProperties}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">With Caretakers</p>
                <p className="text-2xl font-bold text-gray-900">{propertiesWithCaretakers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-teal-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Agents</p>
                <p className="text-2xl font-bold text-gray-900">{activeAgents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Latest Addition</p>
                <p className="text-lg font-bold text-gray-900">
                  {latestAddition ? formatDate(latestAddition.created_at) : 'None'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/add-house"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <Plus className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Add Property</p>
                <p className="text-sm text-gray-600">Record new property details</p>
              </div>
            </a>

            <a
              href="/saved-houses"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                <Eye className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">View All Properties</p>
                <p className="text-sm text-gray-600">Browse your property collection</p>
              </div>
            </a>

            <button
              onClick={() => setSelectedHouse(null)}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left"
            >
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                <Map className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Property Map</p>
                <p className="text-sm text-gray-600">View network overview</p>
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Property Network</h2>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search properties..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>
              
              {houses.length > 0 ? (
                <SimpleMap
                  houses={filteredHouses}
                  selectedHouse={selectedHouse}
                  onHouseClick={setSelectedHouse}
                />
              ) : (
                <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No properties yet</h3>
                    <p className="text-gray-500 mb-4">Add your first property to see it on the map</p>
                    <a
                      href="/add-house"
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Add Property
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recent Properties & Activity */}
          <div className="space-y-6">
            {/* Recent Properties */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Properties</h2>
              <div className="space-y-3">
                {recentHouses.length > 0 ? (
                  recentHouses.map((house) => (
                    <div key={house.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{formatHouseName(house.name)}</p>
                        <p className="text-sm text-gray-600">
                          {house.agent_name && `Agent: ${house.agent_name}`}
                          {house.caretaker_name && ` • Caretaker: ${house.caretaker_name}`}
                        </p>
                        <p className="text-xs text-gray-500">{formatDate(house.created_at)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => navigateToLocation(house)}
                          className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
                          title="Navigate to location"
                        >
                          <Navigation className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedHouse(house)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="View on map"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(house)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No properties found</p>
                )}
              </div>
              {houses.length > 5 && (
                <div className="mt-4 text-center">
                  <a
                    href="/saved-houses"
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    View all properties →
                  </a>
                </div>
              )}
            </div>

            {/* Activity Feed */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {houses.slice(0, 3).map((house) => (
                  <div key={house.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Property added:</span> {formatHouseName(house.name)}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(house.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        houseName={deleteModal.house ? formatHouseName(deleteModal.house.name) : ''}
      />
    </div>
  )
}

export default Dashboard
