import React, { useState, useEffect } from 'react'
import AddHouse from '../components/AddHouse'
import LocationModal from '../components/LocationModal'
import SuccessModal from '../components/SuccessModal'

const AddHousePage = () => {
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
