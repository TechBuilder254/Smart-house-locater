import React, { useState, useEffect } from 'react'
import { MapPin, Home, Users, Plus, Search, Calendar, User, LogOut, Settings } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import SimpleMap from '../components/SimpleMap'

const Dashboard = ({ user }) => {
  const [houses, setHouses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedHouse, setSelectedHouse] = useState(null)
  const [mapCenter, setMapCenter] = useState({ lat: -1.2921, lng: 36.8219 })
  const navigate = useNavigate()

  useEffect(() => {
    loadHouses()
  }, [])

  const loadHouses = async () => {
    try {
      const { data, error } = await supabase
        .from('houses')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setHouses(data || [])
      if (data && data.length > 0) {
        setMapCenter({ lat: data[0].latitude, lng: data[0].longitude })
      }
    } catch (error) {
      console.error('Error loading houses:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const filteredHouses = houses.filter(house =>
    house.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (house.agent_name && house.agent_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (house.caretaker_name && house.caretaker_name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleHouseClick = (house) => {
    setSelectedHouse(house)
    setMapCenter({ lat: house.latitude, lng: house.longitude })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Loading Dashboard...</h3>
          <p className="text-gray-500">Fetching your property data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur-lg opacity-30"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <Home className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Smart House Locator</h1>
                <p className="text-sm text-gray-600">Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.user_metadata?.name || user?.email}
                  </p>
                  <p className="text-xs text-gray-500">Agent</p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{houses.length}</p>
                <p className="text-sm text-gray-600">Total Properties</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(houses.filter(h => h.agent_name).map(h => h.agent_name)).size}
                </p>
                <p className="text-sm text-gray-600">Active Agents</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {houses.filter(h => h.caretaker_name).length}
                </p>
                <p className="text-sm text-gray-600">With Caretakers</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-xl">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {houses.length > 0 ? formatDate(houses[0].created_at) : 'N/A'}
                </p>
                <p className="text-sm text-gray-600">Latest Addition</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties by name, agent, or caretaker..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
          <Link
            to="/add-house"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2 justify-center"
          >
            <Plus className="w-5 h-5" />
            Add Property
          </Link>
        </div>

        {/* Map and Properties Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Property Network</h2>
            <div className="h-96 rounded-xl overflow-hidden">
              <SimpleMap
                houses={houses}
                selectedHouse={selectedHouse}
                onHouseClick={handleHouseClick}
                center={mapCenter}
              />
            </div>
          </div>

          {/* Properties List */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Properties</h2>
              <Link
                to="/saved-houses"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View All
              </Link>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredHouses.length === 0 ? (
                <div className="text-center py-8">
                  <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    {searchTerm ? 'No properties found' : 'No properties yet'}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm ? 'Try adjusting your search terms' : 'Add your first property to get started'}
                  </p>
                  {!searchTerm && (
                    <Link
                      to="/add-house"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                    >
                      Add First Property
                    </Link>
                  )}
                </div>
              ) : (
                filteredHouses.slice(0, 5).map((house) => (
                  <div
                    key={house.id}
                    className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                      selectedHouse?.id === house.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                    onClick={() => handleHouseClick(house)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{house.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          {house.agent_name && (
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {house.agent_name}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(house.created_at)}
                          </span>
                        </div>
                        {house.notes && (
                          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{house.notes}</p>
                        )}
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div>{house.latitude.toFixed(4)}</div>
                        <div>{house.longitude.toFixed(4)}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
