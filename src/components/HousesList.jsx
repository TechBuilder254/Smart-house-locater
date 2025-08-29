import React, { useState, useEffect } from 'react'
import { Search, MapPin, User, Calendar, Trash2, Navigation, FileText, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'
import apiService from '../services/api'

const HousesList = ({ houses, onDeleteHouse, searchTerm, onSearchChange, onHousesUpdate }) => {
  const [showAll, setShowAll] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Show only 4 houses initially, or all if showAll is true
  const displayedHouses = showAll ? houses : houses.slice(0, 4)
  const hasMoreHouses = houses.length > 4

  const openInGoogleMaps = (latitude, longitude) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`
    window.open(url, '_blank')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDeleteHouse = async (houseId) => {
    if (!confirm('Are you sure you want to delete this house?')) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await apiService.deleteHouse(houseId)
      
      if (response.success) {
        // Remove the house from the local state
        const updatedHouses = houses.filter(house => house.id !== houseId)
        onHousesUpdate(updatedHouses)
        alert('House deleted successfully from cloud database!')
      } else {
        throw new Error(response.message || 'Failed to delete house')
      }
    } catch (error) {
      console.error('Error deleting house:', error)
      setError(error.message)
      alert(`Error deleting house: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl"></div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-lg opacity-30"></div>
            <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl shadow-lg">
              <span className="text-white font-bold text-lg">{houses.length}</span>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold gradient-text">Saved Houses</h2>
            <p className="text-gray-600">Manage your property locations</p>
          </div>
        </div>
        
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search houses by name or caretaker..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input pl-12 bg-white/90"
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {houses.length === 0 ? (
          <div className="text-center py-16">
            <div className="relative mx-auto mb-6 w-24 h-24">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full blur-lg opacity-30"></div>
              <div className="relative bg-gradient-to-r from-gray-500 to-gray-600 p-6 rounded-full shadow-lg">
                <MapPin className="w-12 h-12 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-3">No houses found</h3>
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'Try adjusting your search terms' : 'Add your first house to get started'}
            </p>
            {!searchTerm && (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
                <p className="text-blue-700 text-sm">
                  💡 <strong>Get started:</strong> Use the form on the left to add your first property location
                </p>
              </div>
            )}
          </div>
        ) : (
          displayedHouses.map((house, index) => (
            <div
              key={house.id}
              className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-purple-300 relative"
            >
              {/* House Number Badge */}
              <div className="absolute -top-3 -left-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg opacity-30"></div>
                  <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    {index + 1}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-secondary-800 mb-1">
                    {house.name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-secondary-600">
                    {house.caretaker_name && (
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>Caretaker: {house.caretaker_name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(house.created_at)}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDeleteHouse(house.id)}
                  disabled={isLoading}
                  className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete house"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                </button>
              </div>

              {house.notes && (
                <div className="flex items-start gap-2 mb-3 text-sm text-secondary-600">
                  <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p className="italic">{house.notes}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-secondary-500">
                  <MapPin className="w-4 h-4" />
                  <div>
                    <div>{house.latitude.toFixed(6)}, {house.longitude.toFixed(6)}</div>
                    <div className="text-xs text-secondary-400">
                      Saved to cloud database
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => openInGoogleMaps(house.latitude, house.longitude)}
                  className="btn btn-primary text-sm"
                  title="Open in Google Maps"
                >
                  <Navigation className="w-4 h-4" />
                  Navigate
                </button>
              </div>
            </div>
          ))
        )}
        
        {/* See More/Less Button */}
        {hasMoreHouses && (
          <div className="text-center mt-6">
            <button
              onClick={() => setShowAll(!showAll)}
              className="btn btn-secondary"
            >
              {showAll ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  See More ({houses.length - 4} more)
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default HousesList

