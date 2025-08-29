import React, { useEffect, useRef, useState } from 'react'
import { MapPin, Navigation, Info } from 'lucide-react'

const GoogleMap = ({ houses, selectedHouse, onHouseClick, center }) => {
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const [markers, setMarkers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load Google Maps API
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap()
        return
      }

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&libraries=geometry`
      script.async = true
      script.defer = true
      script.onload = initializeMap
      script.onerror = () => {
        console.error('Failed to load Google Maps API')
        setIsLoading(false)
      }
      document.head.appendChild(script)
    }

    const initializeMap = () => {
      if (!mapRef.current) return

      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: center || { lat: -1.2921, lng: 36.8219 }, // Nairobi center
        zoom: 12,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ],
        mapTypeId: window.google.maps.MapTypeId.ROADMAP
      })

      setMap(mapInstance)
      setIsLoading(false)
    }

    loadGoogleMaps()
  }, [center])

  useEffect(() => {
    if (!map || !houses.length) return

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null))

    const newMarkers = houses.map((house, index) => {
      const position = { lat: house.latitude, lng: house.longitude }
      
      // Create marker with custom icon
      const marker = new window.google.maps.Marker({
        position,
        map,
        title: house.name,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="${selectedHouse?.id === house.id ? '#3B82F6' : '#10B981'}" stroke="white" stroke-width="2"/>
              <text x="20" y="25" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">${index + 1}</text>
            </svg>
          `)}`,
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 20)
        },
        animation: selectedHouse?.id === house.id ? window.google.maps.Animation.BOUNCE : null
      })

      // Create info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #1F2937; font-size: 14px; font-weight: bold;">${house.name}</h3>
            <p style="margin: 0 0 4px 0; color: #6B7280; font-size: 12px;"><strong>Agent:</strong> ${house.agent_name}</p>
            <p style="margin: 0 0 4px 0; color: #6B7280; font-size: 12px;"><strong>Coordinates:</strong></p>
            <p style="margin: 0 0 8px 0; color: #374151; font-size: 11px; font-family: monospace;">${house.latitude.toFixed(6)}, ${house.longitude.toFixed(6)}</p>
            ${house.notes ? `<p style="margin: 0; color: #6B7280; font-size: 12px;"><strong>Notes:</strong> ${house.notes}</p>` : ''}
          </div>
        `
      })

      // Add click listener
      marker.addListener('click', () => {
        onHouseClick(house)
        infoWindow.open(map, marker)
      })

      return { marker, infoWindow }
    })

    setMarkers(newMarkers)

    // Fit bounds to show all markers
    if (newMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds()
      newMarkers.forEach(({ marker }) => bounds.extend(marker.getPosition()))
      map.fitBounds(bounds)
      
      // If only one marker, zoom in more
      if (newMarkers.length === 1) {
        map.setZoom(15)
      }
    }

    return () => {
      newMarkers.forEach(({ marker }) => marker.setMap(null))
    }
  }, [map, houses, selectedHouse, onHouseClick])

  // Center map on selected house
  useEffect(() => {
    if (map && selectedHouse) {
      const position = { lat: selectedHouse.latitude, lng: selectedHouse.longitude }
      map.panTo(position)
      map.setZoom(16)
    }
  }, [map, selectedHouse])

  if (isLoading) {
    return (
      <div className="relative h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl overflow-hidden border-2 border-blue-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading Map...</h3>
            <p className="text-gray-500 text-sm">Initializing Google Maps</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-2xl overflow-hidden border-2 border-blue-200 shadow-lg"
      />
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button 
          onClick={() => {
            if (map && houses.length > 0) {
              const bounds = new window.google.maps.LatLngBounds()
              markers.forEach(({ marker }) => bounds.extend(marker.getPosition()))
              map.fitBounds(bounds)
            }
          }}
          className="p-2 bg-white/90 rounded-lg shadow-lg hover:bg-white transition-colors"
          title="Fit all properties"
        >
          <Navigation className="w-4 h-4 text-gray-600" />
        </button>
        
        <button 
          onClick={() => {
            if (map) {
              map.setMapTypeId(
                map.getMapTypeId() === window.google.maps.MapTypeId.SATELLITE 
                  ? window.google.maps.MapTypeId.ROADMAP 
                  : window.google.maps.MapTypeId.SATELLITE
              )
            }
          }}
          className="p-2 bg-white/90 rounded-lg shadow-lg hover:bg-white transition-colors"
          title="Toggle satellite view"
        >
          <MapPin className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-semibold text-gray-700">Legend</span>
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Property</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Selected</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GoogleMap
