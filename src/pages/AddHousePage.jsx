import React, { useState, useEffect } from 'react'
import { Home as HomeIcon } from 'lucide-react'
import AddHouse from '../components/AddHouse'
import LocationModal from '../components/LocationModal'
import SuccessModal from '../components/SuccessModal'
import Header from '../components/Header'

const AddHousePage = ({ user }) => {
  const [houses, setHouses] = useState([])
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header 
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        user={user}
        showBackButton={true}
        title="Add Property"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl blur-lg opacity-30"></div>
                <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-xl shadow-lg">
                  <HomeIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">Add New Property</h1>
                <p className="text-gray-600 mt-1">Record property details and capture location</p>
              </div>
            </div>
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
    </div>
  )
}

export default AddHousePage
