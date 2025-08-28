import React, { useState, useEffect } from 'react'
import HousesList from '../components/HousesList'

const SavedHouses = () => {
  const [houses, setHouses] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

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

  const deleteHouse = (houseId) => {
    setHouses(prev => prev.filter(house => house.id !== houseId))
  }

  const filteredHouses = houses.filter(house =>
    house.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    house.agent.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Saved Houses
          </h1>
          <p className="text-lg text-white/70">
            Manage and view all your saved properties
          </p>
        </div>
        
        <HousesList 
          houses={filteredHouses}
          onDeleteHouse={deleteHouse}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>
    </div>
  )
}

export default SavedHouses
