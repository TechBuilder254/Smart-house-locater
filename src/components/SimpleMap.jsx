import React, { useMemo } from 'react'
import { MapPin, Navigation } from 'lucide-react'

const SimpleMap = ({ houses, selectedHouse, onHouseClick }) => {
  const mapData = useMemo(() => {
    if (!houses.length) return { width: 400, height: 300, points: [] }

    // Calculate bounds with better precision
    const lats = houses.map(h => h.latitude)
    const lngs = houses.map(h => h.longitude)
    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLng = Math.min(...lngs)
    const maxLng = Math.max(...lngs)

    // Add more padding to prevent houses from being cut off
    const latPadding = Math.max((maxLat - minLat) * 0.2, 0.001) // Minimum 0.001 degrees
    const lngPadding = Math.max((maxLng - minLng) * 0.2, 0.001) // Minimum 0.001 degrees

    const width = 400
    const height = 300

    // Convert coordinates to SVG points with improved accuracy
    const points = houses.map((house, index) => {
      // Use the padded bounds for calculation
      const adjustedMinLng = minLng - lngPadding
      const adjustedMaxLng = maxLng + lngPadding
      const adjustedMinLat = minLat - latPadding
      const adjustedMaxLat = maxLat + latPadding

      // Calculate position with better precision
      const x = ((house.longitude - adjustedMinLng) / (adjustedMaxLng - adjustedMinLng)) * width
      const y = ((adjustedMaxLat - house.latitude) / (adjustedMaxLat - adjustedMinLat)) * height
      
      // Ensure points stay within visible area with more margin
      const margin = 30
      const clampedX = Math.max(margin, Math.min(width - margin, x))
      const clampedY = Math.max(margin, Math.min(height - margin, y))
      
      return {
        ...house,
        x: clampedX,
        y: clampedY,
        index: index + 1,
        originalX: x,
        originalY: y
      }
    })

    return { 
      width, 
      height, 
      points, 
      bounds: { 
        minLat: minLat - latPadding, 
        maxLat: maxLat + latPadding, 
        minLng: minLng - lngPadding, 
        maxLng: maxLng + lngPadding 
      } 
    }
  }, [houses])

  // Navigate to property location
  const navigateToLocation = (house) => {
    const { latitude, longitude, name } = house
    
    // Directly open Google Maps with directions
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`, '_blank')
  }

  // Format house name to preserve numbers
  const formatHouseName = (name) => {
    // If the name is just a number, return it as is
    if (/^\d+$/.test(name.trim())) {
      return name.trim()
    }
    // Otherwise return the name as entered
    return name
  }

  if (!houses.length) {
    return (
      <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No properties on map</h3>
          <p className="text-gray-500">Add properties to see them on the map</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Map Container */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border border-gray-200 overflow-hidden">
        <svg
          width={mapData.width}
          height={mapData.height}
          className="w-full h-auto"
          viewBox={`0 0 ${mapData.width} ${mapData.height}`}
        >
          {/* Background grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Connection lines between properties */}
          {mapData.points.length > 1 && (
            <g>
              {mapData.points.map((point, index) => {
                if (index === mapData.points.length - 1) return null
                const nextPoint = mapData.points[index + 1]
                return (
                  <line
                    key={`line-${index}`}
                    x1={point.x}
                    y1={point.y}
                    x2={nextPoint.x}
                    y2={nextPoint.y}
                    stroke="rgba(59, 130, 246, 0.3)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                )
              })}
            </g>
          )}

          {/* Property points */}
          {mapData.points.map((point) => (
            <g key={point.id}>
              {/* Point circle */}
              <circle
                cx={point.x}
                cy={point.y}
                r={selectedHouse?.id === point.id ? "12" : "8"}
                fill={selectedHouse?.id === point.id ? "#1e40af" : "#3b82f6"}
                stroke="white"
                strokeWidth="2"
                className="cursor-pointer hover:scale-110 transition-transform"
                onClick={() => onHouseClick(point)}
              />
              
              {/* Point number */}
              <text
                x={point.x}
                y={point.y}
                textAnchor="middle"
                dy="0.35em"
                fill="white"
                fontSize="10"
                fontWeight="bold"
                pointerEvents="none"
              >
                {point.index}
              </text>

              {/* Accuracy indicator */}
              {point.accuracy && (
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={Math.min(point.accuracy * 2, 20)}
                  fill="none"
                  stroke={point.accuracy <= 10 ? "#10b981" : "#f59e0b"}
                  strokeWidth="1"
                  strokeDasharray="3,3"
                  opacity="0.6"
                />
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Selected Property Details */}
      {selectedHouse && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-xs">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-gray-900 text-sm">
              {formatHouseName(selectedHouse.name)}
            </h3>
            <button
              onClick={() => onHouseClick(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3 text-gray-400" />
              <span className="text-gray-600">
                {selectedHouse.latitude.toFixed(6)}, {selectedHouse.longitude.toFixed(6)}
              </span>
            </div>
            
            {selectedHouse.agent_name && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Agent:</span>
                <span className="font-medium">{selectedHouse.agent_name}</span>
              </div>
            )}
            
            {selectedHouse.caretaker_name && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Caretaker:</span>
                <span className="font-medium">{selectedHouse.caretaker_name}</span>
              </div>
            )}
            
            {selectedHouse.accuracy && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Accuracy:</span>
                <span className={`font-medium ${selectedHouse.accuracy <= 10 ? 'text-green-600' : 'text-orange-600'}`}>
                  {selectedHouse.accuracy.toFixed(1)}m
                </span>
              </div>
            )}
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={() => navigateToLocation(selectedHouse)}
              className="w-full bg-blue-600 text-white text-xs py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Navigation className="w-3 h-3" />
              Navigate to Location
            </button>
          </div>
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-3">
        <div className="text-xs text-gray-600 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Property Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border border-green-500 rounded-full bg-transparent"></div>
            <span>High Accuracy (≤10m)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border border-orange-500 rounded-full bg-transparent"></div>
                         <span>Lower Accuracy (&gt;10m)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleMap
