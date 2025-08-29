import React, { useState, useEffect } from 'react'
import { Home as HomeIcon } from 'lucide-react'
import AddHouse from '../components/AddHouse'
import LocationModal from '../components/LocationModal'
import SuccessModal from '../components/SuccessModal'

const AddHousePage = ({ user }) => {
  const [houses, setHouses] = useState([])
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Load houses from localStorage on component mount
  useEffect(() => {
    const savedHouses = localStorage.getItem('houses')
    if (savedHouses) {
      setHouses(JSON.parse(savedHouses))
    }
  }, [])

  // Save houses to localStorage whenever houses state changes
  useEffect(() => {
    localStorage.setItem('houses', JSON.stringify(houses))
  }, [houses])

  const addHouse = (houseData) => {
    const newHouse = {
      id: Date.now().toString(),
      ...houseData,
      createdAt: new Date().toISOString()
    }
    setHouses(prev => [newHouse, ...prev])
    setSuccessMessage(`House "${houseData.name}" has been added successfully!`)
    setShowSuccessModal(true)
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
            <h3 className="text-xl font-bold text-gray-700 mb-2">Add New Properties</h3>
            <p className="text-gray-500 mb-6">Please sign in to add new properties to your network</p>
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
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Add New Property
          </h1>
          <p className="text-lg text-white/70">
            Record property details and capture location
          </p>
        </div>
        
        <AddHouse 
          onAddHouse={addHouse}
          onShowLocationModal={() => setShowLocationModal(true)}
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

export default AddHousePage
