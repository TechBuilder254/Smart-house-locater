import React, { useState } from 'react'
import { MapPin, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react'

const LocationModal = ({ onClose, onLocationGranted }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [accuracy, setAccuracy] = useState(null)
  const [attempts, setAttempts] = useState(0)

  const getHighAccuracyLocation = () => {
    setIsLoading(true)
    setError(null)
    setAccuracy(null)
    setAttempts(prev => prev + 1)

    const options = {
      enableHighAccuracy: true,  // Request highest accuracy
      timeout: 30000,           // 30 second timeout
      maximumAge: 0             // Don't use cached position
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLoading(false)
          const accuracy = position.coords.accuracy
          setAccuracy(accuracy)
          
          console.log('📍 GPS Accuracy:', accuracy, 'meters')
          console.log('📍 Coordinates:', position.coords.latitude, position.coords.longitude)
          
          // If accuracy is poor (>50m), suggest retry
          if (accuracy > 50) {
            setError(`Location accuracy is ${Math.round(accuracy)}m. For better results, try moving to an open area or retry.`)
            return
          }
          
          onLocationGranted({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: accuracy
          })
        },
        (error) => {
          setIsLoading(false)
          console.error('Location error:', error)
          
          let errorMessage = 'Location access denied.'
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location access in your browser settings.'
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable. Please check your GPS settings.'
              break
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again in an open area.'
              break
            default:
              errorMessage = 'Unable to get your location. Please try again.'
          }
          
          setError(errorMessage)
        },
        options
      )
    } else {
      setIsLoading(false)
      setError('Geolocation is not supported by this browser.')
    }
  }

  const handleRetry = () => {
    if (attempts < 3) {
      getHighAccuracyLocation()
    } else {
      setError('Maximum attempts reached. Please try again later or use manual coordinates.')
    }
  }

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <MapPin className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold text-secondary-800">High-Accuracy Location</h3>
        </div>
        
        <p className="text-secondary-600 mb-6 leading-relaxed">
          This app needs precise GPS coordinates for accurate house location recording. 
          For best results, please:
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-800 mb-2">📱 Tips for Better Accuracy:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Move to an open area (away from buildings)</li>
            <li>• Wait 10-15 seconds for GPS to stabilize</li>
            <li>• Ensure GPS is enabled on your device</li>
            <li>• Try multiple times if accuracy is poor</li>
          </ul>
        </div>

        {isLoading && (
          <div className="text-center py-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-2" />
            <p className="text-secondary-600">Getting precise location...</p>
            <p className="text-sm text-secondary-500">Please wait and stay still</p>
          </div>
        )}

        {accuracy && (
          <div className={`p-3 rounded-lg mb-4 ${accuracy <= 20 ? 'bg-green-50 border border-green-200' : accuracy <= 50 ? 'bg-yellow-50 border border-yellow-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center gap-2">
              {accuracy <= 20 ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              )}
              <span className={`font-semibold ${accuracy <= 20 ? 'text-green-800' : accuracy <= 50 ? 'text-yellow-800' : 'text-red-800'}`}>
                Accuracy: {Math.round(accuracy)}m
              </span>
            </div>
            <p className={`text-sm mt-1 ${accuracy <= 20 ? 'text-green-700' : accuracy <= 50 ? 'text-yellow-700' : 'text-red-700'}`}>
              {accuracy <= 20 ? 'Excellent accuracy!' : accuracy <= 50 ? 'Good accuracy' : 'Poor accuracy - consider retrying'}
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="font-semibold text-red-800">Location Error</span>
            </div>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
        <div className="flex gap-3">
          {!isLoading && (
            <>
              <button
                onClick={getHighAccuracyLocation}
                className="btn btn-primary flex-1"
                disabled={attempts >= 3}
              >
                <MapPin className="w-5 h-5" />
                {attempts === 0 ? 'Get Precise Location' : `Retry (${attempts}/3)`}
              </button>
              <button
                onClick={onClose}
                className="btn btn-secondary"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            </>
          )}
        </div>

        {attempts > 0 && (
          <p className="text-xs text-secondary-500 mt-3 text-center">
            Attempts: {attempts}/3
          </p>
        )}
      </div>
    </div>
  )
}

export default LocationModal

