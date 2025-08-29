import React, { useState, useEffect } from 'react'
import { PlusCircle, MapPin, User, FileText, Navigation, AlertCircle, Phone, Check, ArrowRight, ArrowLeft, Camera } from 'lucide-react'
import apiService from '../services/api'

const AddHouse = ({ onAddHouse, onShowLocationModal }) => {
  const [currentStep, setCurrentStep] = useState(1)
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

  const totalSteps = 4

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

      // High accuracy options
      const options = {
        enableHighAccuracy: true,  // Request highest possible accuracy
        timeout: 60000,           // 60 seconds timeout for high accuracy
        maximumAge: 0             // Don't use cached position
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
        options
      )
    })
  }

  const captureLocation = async () => {
    setIsCapturingLocation(true)
    setLocationError(null)
    
    try {
      const location = await getCurrentLocation()
      
      // Check if accuracy meets our high standards (10 meters or better)
      if (location.accuracy > 10) {
        const retry = confirm(
          `⚠️ Location accuracy is ${location.accuracy.toFixed(1)} meters (we need 10m or better)\n\n` +
          `Current accuracy: ${location.accuracy.toFixed(1)}m\n` +
          `Required accuracy: ≤10m\n\n` +
          `For better accuracy:\n` +
          `• Move to an open area\n` +
          `• Stay away from buildings\n` +
          `• Wait a few seconds\n\n` +
          `Would you like to try again?`
        )
        
        if (retry) {
          setIsCapturingLocation(false)
          setTimeout(() => captureLocation(), 1000) // Retry after 1 second
          return
        } else {
          // User chose not to retry, but we'll still use the location
          setCurrentLocation(location)
          setLocationAccuracy(location.accuracy)
          alert(
            `Location captured with ${location.accuracy.toFixed(1)}m accuracy\n\n` +
            `Coordinates: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}\n\n` +
            `Note: Accuracy is above recommended 10m threshold`
          )
        }
      } else {
        // Excellent accuracy (≤10m)
        setCurrentLocation(location)
        setLocationAccuracy(location.accuracy)
        alert(
          `🎯 Perfect! High accuracy location captured\n\n` +
          `Accuracy: ${location.accuracy.toFixed(1)} meters\n` +
          `Coordinates: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}\n\n` +
          `This location meets our high accuracy standards!`
        )
      }
      
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
        setCurrentStep(1)
        
        alert('Property saved successfully to cloud database!')
      } else {
        throw new Error(response.message || 'Failed to save house')
      }
      
    } catch (error) {
      console.error('Error adding house:', error)
      setApiError(error.message)
      alert(`Error saving property: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() !== ''
      case 2:
        return currentLocation !== null
      case 3:
        return true // Optional step
      case 4:
        return formData.name.trim() !== '' && currentLocation !== null
      default:
        return false
    }
  }

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              index + 1 < currentStep
                ? 'bg-green-600 text-white'
                : index + 1 === currentStep
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {index + 1 < currentStep ? <Check className="w-4 h-4" /> : index + 1}
            </div>
            {index < totalSteps - 1 && (
              <div className={`w-16 h-1 mx-2 ${
                index + 1 < currentStep ? 'bg-green-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Step {currentStep} of {totalSteps}
        </p>
      </div>
    </div>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Property Name/Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter property name or address"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Add any additional notes about the property"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  rows="3"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Navigation className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Capture Location</h3>
              <p className="text-gray-600">Get precise GPS coordinates for this property</p>
            </div>

            {locationError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700 text-sm">{locationError}</span>
              </div>
            )}

            {currentLocation ? (
              <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800">Location Captured!</h4>
                    <p className="text-green-600 text-sm">GPS coordinates recorded successfully</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 font-medium">Coordinates</p>
                    <p className="font-mono text-gray-900">{currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Accuracy</p>
                    <p className={`font-bold ${locationAccuracy <= 10 ? 'text-green-600' : 'text-red-600'}`}>
                      {locationAccuracy?.toFixed(1)}m
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <p className="text-blue-800 font-medium mb-4">
                  📍 Ready to Capture Location
                </p>
                <p className="text-blue-700 text-sm mb-4">
                  Make sure you are physically at the property location before capturing coordinates.
                </p>
                <p className="text-blue-600 text-xs bg-blue-100 p-2 rounded-lg">
                  🎯 <strong>High Accuracy Required:</strong> We need ≤10m accuracy. Stand outside with clear sky view.
                </p>
              </div>
            )}

            {isCapturingLocation && (
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800">Capturing High-Accuracy GPS...</h4>
                    <p className="text-blue-600 text-sm">Getting precise coordinates (≤10m accuracy)</p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={captureLocation}
              disabled={isCapturingLocation}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCapturingLocation ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Capturing Location...
                </>
              ) : (
                <>
                  <Navigation className="w-5 h-5" />
                  {currentLocation ? 'Recapture Location' : 'Capture Current Location'}
                </>
              )}
            </button>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Caretaker Information</h3>
              <p className="text-gray-600">Add caretaker details (optional)</p>
            </div>

            <div>
              <label htmlFor="caretaker_name" className="block text-sm font-medium text-gray-700 mb-2">
                Caretaker Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="caretaker_name"
                  name="caretaker_name"
                  value={formData.caretaker_name}
                  onChange={handleInputChange}
                  placeholder="Enter caretaker name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="caretaker_phone" className="block text-sm font-medium text-gray-700 mb-2">
                Caretaker Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  id="caretaker_phone"
                  name="caretaker_phone"
                  value={formData.caretaker_phone}
                  onChange={handleInputChange}
                  placeholder="Enter caretaker phone number"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Review & Save</h3>
              <p className="text-gray-600">Review your property details before saving</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Property Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  {formData.notes && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Notes:</span>
                      <span className="font-medium">{formData.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coordinates:</span>
                    <span className="font-mono">{currentLocation?.latitude.toFixed(6)}, {currentLocation?.longitude.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Accuracy:</span>
                    <span className={`font-medium ${locationAccuracy <= 10 ? 'text-green-600' : 'text-red-600'}`}>
                      {locationAccuracy?.toFixed(1)}m
                    </span>
                  </div>
                </div>
              </div>

              {(formData.caretaker_name || formData.caretaker_phone) && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Caretaker</h4>
                  <div className="space-y-2 text-sm">
                    {formData.caretaker_name && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{formData.caretaker_name}</span>
                      </div>
                    )}
                    {formData.caretaker_phone && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{formData.caretaker_phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PlusCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Add New Property</h2>
          <p className="text-gray-600 mt-2">Follow the steps to add your property</p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* API Error Display */}
        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 text-sm">{apiError}</span>
          </div>
        )}

        {/* Step Content */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid()}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || !isStepValid()}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Save Property
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddHouse

