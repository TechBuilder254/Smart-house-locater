import React, { useMemo } from 'react'
import { MapPin, Navigation, Info, Home } from 'lucide-react'

const SimpleMap = ({ houses, selectedHouse, onHouseClick, center }) => {
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

  const handlePointClick = (house) => {
    onHouseClick(house)
  }

  if (!houses.length) {
    return (
      <div className="relative h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl overflow-hidden border-2 border-blue-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Properties Yet</h3>
            <p className="text-gray-500 text-sm mb-4">Add your first property to see it on the map</p>
            <a href="/add-house" className="btn btn-primary text-sm">
              Add Property
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl overflow-hidden border-2 border-blue-200 shadow-lg">
        <svg 
          width={mapData.width} 
          height={mapData.height} 
          className="w-full h-96"
          viewBox={`0 0 ${mapData.width} ${mapData.height}`}
        >
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Connection lines between houses */}
          {mapData.points.length > 1 && (
            <g>
              {mapData.points.map((point, i) => {
                if (i === 0) return null
                const prevPoint = mapData.points[i - 1]
                return (
                  <line
                    key={`line-${i}`}
                    x1={prevPoint.x}
                    y1={prevPoint.y}
                    x2={point.x}
                    y2={point.y}
                    stroke="#3b82f6"
                    strokeWidth="2"
                    opacity="0.6"
                    strokeDasharray="5,5"
                  />
                )
              })}
            </g>
          )}

          {/* House location points */}
          {mapData.points.map((point) => {
            const isSelected = selectedHouse?.id === point.id
            return (
              <g key={point.id}>
                {/* Connection point */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isSelected ? 12 : 8}
                  fill={isSelected ? "#3b82f6" : "#10b981"}
                  stroke="white"
                  strokeWidth="3"
                  className="cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => handlePointClick(point)}
                />
                
                {/* House number */}
                <text
                  x={point.x}
                  y={point.y + 4}
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                  className="pointer-events-none"
                >
                  {point.index}
                </text>

                {/* House name label - positioned to avoid overlap */}
                <text
                  x={point.x}
                  y={point.y - 20}
                  textAnchor="middle"
                  fill="#374151"
                  fontSize="10"
                  fontWeight="600"
                  className="pointer-events-none"
                >
                  {point.name.length > 15 ? point.name.substring(0, 15) + '...' : point.name}
                </text>

                {/* Accuracy indicator */}
                <text
                  x={point.x}
                  y={point.y + 25}
                  textAnchor="middle"
                  fill="#6b7280"
                  fontSize="8"
                  className="pointer-events-none"
                >
                  {point.accuracy ? `${point.accuracy.toFixed(1)}m` : ''}
                </text>
              </g>
            )
          })}

          {/* Selected house highlight */}
          {selectedHouse && (
            <g>
              <circle
                cx={mapData.points.find(p => p.id === selectedHouse.id)?.x}
                cy={mapData.points.find(p => p.id === selectedHouse.id)?.y}
                r="20"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                opacity="0.3"
                className="animate-pulse"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button 
          className="p-2 bg-white/90 rounded-lg shadow-lg hover:bg-white transition-colors"
          title="Network Overview"
        >
          <Navigation className="w-4 h-4 text-gray-600" />
        </button>
        
        <button 
          className="p-2 bg-white/90 rounded-lg shadow-lg hover:bg-white transition-colors"
          title="Property Details"
        >
          <MapPin className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-semibold text-gray-700">Property Network</span>
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
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full opacity-60"></div>
            <span className="text-gray-600">Connection</span>
          </div>
        </div>
      </div>

      {/* Map Info */}
      <div className="absolute bottom-4 right-4 bg-white/90 rounded-lg p-2 shadow-lg">
        <div className="text-xs text-gray-600">
          <div>Properties: {houses.length}</div>
          <div>Scale: {mapData.bounds ? `${((mapData.bounds.maxLat - mapData.bounds.minLat) * 111000).toFixed(0)}m` : ''}</div>
        </div>
      </div>
    </div>
  )
}

export default SimpleMap
