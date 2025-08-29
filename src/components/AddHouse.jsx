import React, { useState, useEffect } from 'react'
import { PlusCircle, MapPin, User, FileText, Navigation, AlertCircle, Phone } from 'lucide-react'
import apiService from '../services/api'

const AddHouse = ({ onAddHouse, onShowLocationModal }) => {
  const [formData, setFormData] = useState({
    name: '',
    notes: '',
    caretaker_name: '',
    caretaker_phone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [locationAccuracy, setLocationAccuracy] = useState(null)
  const [isCapturingLocation, setIsCapturingLocation] = useState(false)
  const [locationError, setLocationError] = useState(null)
  const [apiError, setApiError] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          }
          resolve(location)
        },
        (error) => {
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 0
        }
      )
    })
  }

  const captureLocation = async () => {
    setIsCapturingLocation(true)
    setLocationError(null)
    
    try {
      const location = await getCurrentLocation()
      setCurrentLocation(location)
      setLocationAccuracy(location.accuracy)
      
      // Provide detailed accuracy feedback
      let accuracyMessage = ''
      if (location.accuracy <= 10) {
        accuracyMessage = '🎯 Excellent accuracy!'
      } else if (location.accuracy <= 25) {
        accuracyMessage = '✅ Good accuracy'
      } else if (location.accuracy <= 50) {
        accuracyMessage = '⚠️ Fair accuracy - consider retrying'
      } else {
        accuracyMessage = '❌ Poor accuracy - please retry in open area'
      }
      
      alert(`${accuracyMessage}\n\nAccuracy: ${location.accuracy.toFixed(1)} meters\nCoordinates: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}\n\n${location.accuracy > 50 ? 'Tip: Move to an open area and try again for better accuracy.' : 'Location captured successfully!'}`)
      
    } catch (error) {
      console.error('Error getting location:', error)
      setLocationError(error.message)
      onShowLocationModal()
    } finally {
      setIsCapturingLocation(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!currentLocation) {
      alert('Please capture your current location first by clicking "Capture Current Location"')
      return
    }
    
    setIsSubmitting(true)
    setApiError(null)

    try {
      // Prepare house data for API
      const houseData = {
        name: formData.name,
        location: {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude
        },
        notes: formData.notes || '',
        caretaker_name: formData.caretaker_name || null,
        caretaker_phone: formData.caretaker_phone || null
      }

      // Save to MongoDB via API
      const response = await apiService.createHouse(houseData)
      
      if (response.success) {
        // Call the parent callback with the saved house data
        onAddHouse(response.data)
        
        // Reset form and location
        setFormData({
          name: '',
          notes: '',
          caretaker_name: '',
          caretaker_phone: ''
        })
        setCurrentLocation(null)
        setLocationAccuracy(null)
        
        alert('House saved successfully to cloud database!')
      } else {
        throw new Error(response.message || 'Failed to save house')
      }
      
    } catch (error) {
      console.error('Error adding house:', error)
      setApiError(error.message)
      alert(`Error saving house: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="card relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl"></div>
      
      <div className="flex items-center gap-4 mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-lg opacity-30"></div>
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
            <PlusCircle className="w-7 h-7 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold gradient-text">Add New House</h2>
          <p className="text-gray-600 mt-1">Record property details and location</p>
        </div>
      </div>

      {/* API Error Display */}
      {apiError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700 text-sm">{apiError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-2">
            House Name/Address
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter house name or address"
              className="input pl-10"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="caretaker_name" className="block text-sm font-medium text-secondary-700 mb-2">
            Caretaker Name (Optional)
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="text"
              id="caretaker_name"
              name="caretaker_name"
              value={formData.caretaker_name}
              onChange={handleInputChange}
              placeholder="Enter caretaker name"
              className="input pl-10"
            />
          </div>
        </div>

        <div>
          <label htmlFor="caretaker_phone" className="block text-sm font-medium text-secondary-700 mb-2">
            Caretaker Phone (Optional)
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="tel"
              id="caretaker_phone"
              name="caretaker_phone"
              value={formData.caretaker_phone}
              onChange={handleInputChange}
              placeholder="Enter caretaker phone number"
              className="input pl-10"
            />
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-secondary-700 mb-2">
            Notes (Optional)
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-5 h-5 text-secondary-400" />
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Add any additional notes about the property"
              className="input pl-10 resize-none"
              rows="3"
            />
          </div>
        </div>

        {/* Location Capture Section */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg blur-lg opacity-30"></div>
              <div className="relative bg-gradient-to-r from-green-600 to-blue-600 p-2 rounded-lg shadow-lg">
                <Navigation className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Capture Current Location</h3>
              <p className="text-gray-600 text-sm">Get precise GPS coordinates</p>
            </div>
          </div>
          
          {locationError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 text-sm">{locationError}</span>
            </div>
          )}

          {currentLocation ? (
            <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500 rounded-full blur-lg opacity-30"></div>
                  <div className="relative bg-green-500 p-2 rounded-full shadow-lg">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <span className="font-bold text-green-800 text-lg">Location Captured!</span>
                  <p className="text-green-600 text-sm">GPS coordinates recorded successfully</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white/50 p-3 rounded-xl">
                  <p className="text-gray-600 font-medium">Coordinates</p>
                  <p className="text-gray-800 font-mono">{currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}</p>
                </div>
                <div className="bg-white/50 p-3 rounded-xl">
                  <p className="text-gray-600 font-medium">Accuracy</p>
                  <div className="flex items-center gap-2">
                    <p className={`font-bold ${locationAccuracy <= 10 ? 'text-green-600' : locationAccuracy <= 25 ? 'text-blue-600' : locationAccuracy <= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {locationAccuracy?.toFixed(1)}m
                    </p>
                    {locationAccuracy <= 10 && <span className="text-green-600">🎯</span>}
                    {locationAccuracy > 10 && locationAccuracy <= 25 && <span className="text-blue-600">✅</span>}
                    {locationAccuracy > 25 && locationAccuracy <= 50 && <span className="text-yellow-600">⚠️</span>}
                    {locationAccuracy > 50 && <span className="text-red-600">❌</span>}
                  </div>
                  <p className={`text-xs mt-1 ${locationAccuracy <= 10 ? 'text-green-600' : locationAccuracy <= 25 ? 'text-blue-600' : locationAccuracy <= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {locationAccuracy <= 10 ? 'Excellent' : locationAccuracy <= 25 ? 'Good' : locationAccuracy <= 50 ? 'Fair' : 'Poor'}
                  </p>
                </div>
                <div className="bg-white/50 p-3 rounded-xl">
                  <p className="text-gray-600 font-medium">Captured</p>
                  <p className="text-gray-800">{new Date(currentLocation.timestamp).toLocaleString()}</p>
                </div>
              </div>
              
              {/* Retry button for poor accuracy */}
              {locationAccuracy > 50 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm mb-2">
                    ⚠️ Accuracy is poor ({locationAccuracy.toFixed(1)}m). For better results:
                  </p>
                  <ul className="text-yellow-700 text-xs space-y-1 mb-3">
                    <li>• Move to an open area away from buildings</li>
                    <li>• Wait 10-15 seconds for GPS to stabilize</li>
                    <li>• Ensure GPS is enabled on your device</li>
                  </ul>
                  <button
                    type="button"
                    onClick={captureLocation}
                    disabled={isCapturingLocation}
                    className="btn btn-secondary text-sm"
                  >
                    {isCapturingLocation ? 'Retrying...' : 'Retry Location Capture'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl shadow-lg">
              <div className="flex items-start gap-3">
                <div className="relative mt-1">
                  <div className="absolute inset-0 bg-blue-500 rounded-full blur-lg opacity-30"></div>
                  <div className="relative bg-blue-500 p-2 rounded-full shadow-lg">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-blue-800 font-semibold mb-2">
                    📍 Ready to Capture Location
                  </p>
                  <p className="text-blue-700 text-sm mb-3">
                    Make sure you are physically at the house location before capturing coordinates.
                  </p>
                  <p className="text-blue-600 text-xs bg-blue-100 p-2 rounded-lg">
                    💡 <strong>Pro Tip:</strong> For best accuracy, stand outside the house with a clear view of the sky.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* GPS Capture Progress */}
          {isCapturingLocation && (
            <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
                  <div className="relative bg-blue-500 p-3 rounded-full shadow-lg">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-blue-800 text-lg">Capturing GPS Location...</h4>
                  <p className="text-blue-600 text-sm">Getting your exact coordinates</p>
                </div>
              </div>
              <div className="bg-white/50 p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-blue-700 font-medium">Please wait while we get your exact location...</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={captureLocation}
            disabled={isCapturingLocation}
            className="btn btn-primary w-full mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCapturingLocation ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Capturing Location...
              </>
            ) : (
              <>
                <MapPin className="w-5 h-5" />
                {currentLocation ? 'Recapture Location' : 'Capture Current Location'}
              </>
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !currentLocation}
          className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving to Cloud...
            </>
          ) : (
            <>
              <PlusCircle className="w-5 h-5" />
              Save House to Cloud Database
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default AddHouse

