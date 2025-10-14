'use client'

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useLocation, Cafe } from '../contexts/LocationContext'
import { Star, MapPin, Clock, Phone, Globe, Navigation } from 'lucide-react'

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  })
}

// Custom icons
const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: '📍',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
})

const cafeIcon = L.divIcon({
  className: 'cafe-marker',
  html: '☕',
  iconSize: [25, 25],
  iconAnchor: [12, 12],
})

// Component to handle map updates
function MapUpdater() {
  const map = useMap()
  const { userLocation, selectedCafe, setMapBounds } = useLocation()

  useEffect(() => {
    if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 15)
    }
  }, [userLocation, map])

  useEffect(() => {
    if (selectedCafe) {
      map.setView([selectedCafe.lat, selectedCafe.lng], 17)
    }
  }, [selectedCafe, map])

  // Track map bounds changes
  useEffect(() => {
    const updateBounds = () => {
      const bounds = map.getBounds()
      setMapBounds({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest()
      })
    }

    // Update bounds initially
    updateBounds()

    // Listen for map events
    map.on('moveend', updateBounds)
    map.on('zoomend', updateBounds)

    return () => {
      map.off('moveend', updateBounds)
      map.off('zoomend', updateBounds)
    }
  }, [map, setMapBounds])

  return null
}

// Component to handle radius circle
function RadiusCircle() {
  const map = useMap()
  const { userLocation, searchRadius } = useLocation()
  const circleRef = useRef<L.Circle | null>(null)

  useEffect(() => {
    if (userLocation) {
      // Remove existing circle
      if (circleRef.current) {
        map.removeLayer(circleRef.current)
      }

      // Add new circle
      circleRef.current = L.circle([userLocation.lat, userLocation.lng], {
        radius: searchRadius,
        fillColor: '#8B4513',
        fillOpacity: 0.1,
        color: '#8B4513',
        weight: 2,
        opacity: 0.5,
      }).addTo(map)
    }

    return () => {
      if (circleRef.current) {
        map.removeLayer(circleRef.current)
      }
    }
  }, [userLocation, searchRadius, map])

  return null
}

function CafePopupContent({ cafe }: { cafe: Cafe }) {
  const formatRating = (rating?: number) => {
    if (!rating) return 'No rating'
    return (
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="font-medium">{rating.toFixed(1)}</span>
      </div>
    )
  }

  const formatDistance = (distance?: number) => {
    if (!distance) return ''
    return distance < 1000 ? `${Math.round(distance)}m` : `${(distance / 1000).toFixed(1)}km`
  }

  const handleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${cafe.lat},${cafe.lng}`
    window.open(url, '_blank')
  }

  return (
    <div className="min-w-[280px] max-w-[320px]">
      {/* Cafe Header */}
      <div className="mb-3">
        <h3 className="text-lg font-bold text-coffee-800 mb-1">{cafe.name}</h3>
        <div className="flex items-center justify-between">
          {formatRating(cafe.rating)}
          {cafe.distance && (
            <span className="text-sm text-gray-500">{formatDistance(cafe.distance)} away</span>
          )}
        </div>
      </div>

      {/* Cafe Details */}
      <div className="space-y-2 mb-4">
        {cafe.address && (
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-700">{cafe.address}</span>
          </div>
        )}

        {cafe.phoneNumber && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-500" />
            <a 
              href={`tel:${cafe.phoneNumber}`}
              className="text-sm text-blue-600 hover:underline"
            >
              {cafe.phoneNumber}
            </a>
          </div>
        )}

        {cafe.website && (
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-500" />
            <a 
              href={cafe.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              Visit Website
            </a>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className={`text-sm ${cafe.openNow !== false ? 'text-green-600' : 'text-red-600'}`}>
            {cafe.openNow !== false ? 'Open Now' : 'Closed'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleDirections}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Navigation className="w-4 h-4" />
          Directions
        </button>
      </div>

      {/* Reviews Preview */}
      {cafe.reviews && cafe.reviews.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-800 mb-2">Recent Review</h4>
          <div className="bg-gray-50 p-2 rounded text-xs">
            <div className="flex items-center gap-1 mb-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{cafe.reviews[0].rating}</span>
              <span className="text-gray-500">• {cafe.reviews[0].author}</span>
            </div>
            <p className="text-gray-700 line-clamp-2">{cafe.reviews[0].text}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function MapComponent() {
  const { userLocation, cafes, setSelectedCafe } = useLocation()

  // Default center (San Francisco)
  const defaultCenter: [number, number] = [37.7749, -122.4194]
  const center: [number, number] = userLocation 
    ? [userLocation.lat, userLocation.lng] 
    : defaultCenter

  // Create a unique key based on location to force map re-render
  const mapKey = userLocation 
    ? `${userLocation.lat}-${userLocation.lng}` 
    : 'default'

  return (
    <div className="h-full w-full relative" style={{ minHeight: '500px' }}>
      <MapContainer
        key={mapKey}
        center={center}
        zoom={13}
        className="h-full w-full rounded-xl"
        style={{ height: '100%', minHeight: '500px' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater />
        <RadiusCircle />

        {/* User Location Marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userLocationIcon}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-bold text-blue-800 mb-1">Your Location</h3>
                <p className="text-sm text-gray-600">{userLocation.address}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Cafe Markers */}
        {cafes.map((cafe) => (
          <Marker
            key={cafe.id}
            position={[cafe.lat, cafe.lng]}
            icon={cafeIcon}
            eventHandlers={{
              click: () => setSelectedCafe(cafe),
            }}
          >
            <Popup maxWidth={350} className="cafe-popup">
              <CafePopupContent cafe={cafe} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg z-[1000]">
        <h4 className="text-sm font-medium text-gray-800 mb-2">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-lg">📍</span>
            <span>Your Location</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">☕</span>
            <span>Café</span>
          </div>
        </div>
      </div>
    </div>
  )
}