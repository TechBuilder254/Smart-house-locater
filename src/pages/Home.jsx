import React, { useState, useEffect } from 'react'
import AddHouse from '../components/AddHouse'
import HousesList from '../components/HousesList'
import LocationModal from '../components/LocationModal'
import SuccessModal from '../components/SuccessModal'
import apiService from '../services/api'

const Home = () => {
  const [houses, setHouses] = useState([])
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load houses from MongoDB API on component mount
  useEffect(() => {
    loadHouses()
  }, [])

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

  const addHouse = (houseData) => {
    // Add the new house to the beginning of the list
    setHouses(prev => [houseData, ...prev])
    setSuccessMessage(`House "${houseData.name}" has been saved to cloud database!`)
    setShowSuccessModal(true)
  }

  const deleteHouse = (houseId) => {
    // This is now handled in the HousesList component via API
    // We just need to update the local state
    setHouses(prev => prev.filter(house => house.id !== houseId))
  }

  const updateHouses = (updatedHouses) => {
    setHouses(updatedHouses)
  }

  // Filter houses based on search term
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-8">
        <AddHouse 
          onAddHouse={addHouse}
          onShowLocationModal={() => setShowLocationModal(true)}
        />
        
        <HousesList 
          houses={filteredHouses}
          onDeleteHouse={deleteHouse}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onHousesUpdate={updateHouses}
        />
      </div>

      {showLocationModal && (
        <LocationModal 
          onClose={() => setShowLocationModal(false)}
          onLocationGranted={(location) => {
            setShowLocationModal(false)
            // Handle location data if needed
          }}
        />
      )}

      {showSuccessModal && (
        <SuccessModal 
          message={successMessage}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </div>
  )
}

export default Home
