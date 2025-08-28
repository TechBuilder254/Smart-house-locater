import React from 'react'
import { MapPin, X } from 'lucide-react'

const LocationModal = ({ onClose, onLocationGranted }) => {
  const handleEnableLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onLocationGranted({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => {
          console.error('Location permission denied:', error)
          onClose()
        }
      )
    } else {
      alert('Geolocation is not supported by this browser.')
      onClose()
    }
  }

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <MapPin className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold text-secondary-800">Location Access Required</h3>
        </div>
        
        <p className="text-secondary-600 mb-6 leading-relaxed">
          This app needs access to your location to record house coordinates. 
          Please allow location access to continue adding houses with their exact GPS coordinates.
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={handleEnableLocation}
            className="btn btn-primary flex-1"
          >
            <MapPin className="w-5 h-5" />
            Enable Location
          </button>
          <button
            onClick={onClose}
            className="btn btn-secondary"
          >
            <X className="w-5 h-5" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default LocationModal

