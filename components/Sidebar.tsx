'use client'

import { useState, useEffect } from 'react'
import { useLocation, Cafe } from '../contexts/LocationContext'
import { 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  Globe, 
  Navigation,
  Filter,
  SlidersHorizontal,
  Coffee,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  List
} from 'lucide-react'

export default function Sidebar() {
  const {
    userLocation,
    cafes,
    selectedCafe,
    setSelectedCafe,
    searchRadius,
    setSearchRadius,
    isLoading,
    error,
    searchNearbyCafes,
    mapBounds,
    currentPage,
    setCurrentPage,
    cafesPerPage,
    setCafesPerPage
  } = useLocation()

  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<'distance' | 'rating'>('distance')
  const [minRating, setMinRating] = useState(0)
  const [viewMode, setViewMode] = useState<'visible' | 'all'>('visible')

  const handleRadiusChange = async (newRadius: number) => {
    setSearchRadius(newRadius)
    if (userLocation) {
      await searchNearbyCafes(userLocation.lat, userLocation.lng, newRadius)
    }
  }

  const formatDistance = (distance?: number) => {
    if (!distance) return ''
    return distance < 1000 ? `${Math.round(distance)}m` : `${(distance / 1000).toFixed(1)}km`
  }

  const formatRating = (rating?: number) => {
    if (!rating) return 'No rating'
    return rating.toFixed(1)
  }

  const handleDirections = (cafe: Cafe) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${cafe.lat},${cafe.lng}`
    window.open(url, '_blank')
  }

  // Helper function to check if cafe is within map bounds
  const isCafeInBounds = (cafe: Cafe) => {
    if (!mapBounds) return true
    return (
      cafe.lat <= mapBounds.north &&
      cafe.lat >= mapBounds.south &&
      cafe.lng <= mapBounds.east &&
      cafe.lng >= mapBounds.west
    )
  }

  // Filter and sort cafes
  const filteredAndSortedCafes = cafes
    .filter((cafe: Cafe) => {
      // Apply rating filter
      if (minRating && (!cafe.rating || cafe.rating < minRating)) return false
      
      // Apply view mode filter
      if (viewMode === 'visible' && !isCafeInBounds(cafe)) return false
      
      return true
    })
    .sort((a: Cafe, b: Cafe) => {
      if (sortBy === 'distance') {
        return (a.distance || 0) - (b.distance || 0)
      } else {
        return (b.rating || 0) - (a.rating || 0)
      }
    })

  // Pagination calculations
  const totalCafes = filteredAndSortedCafes.length
  const totalPages = Math.ceil(totalCafes / cafesPerPage)
  const startIndex = (currentPage - 1) * cafesPerPage
  const endIndex = startIndex + cafesPerPage
  const paginatedCafes = filteredAndSortedCafes.slice(startIndex, endIndex)

  // Reset to first page if current page is out of bounds
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1)
    }
  }, [totalPages, currentPage, setCurrentPage])

  return (
    <div className="h-full flex flex-col">
      {/* Main Sidebar Card */}
      <div className="glass-card rounded-3xl shadow-2xl h-full flex flex-col border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-coffee-600/10 to-orange-500/10 border-b border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="luxury-heading text-2xl font-bold flex items-center gap-3">
              <div className="relative">
                <Coffee className="w-7 h-7 text-coffee-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
              </div>
              Nearby Cafés
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`luxury-button p-3 rounded-xl transition-all duration-300 ${
                showFilters 
                  ? 'bg-coffee-600 text-white shadow-lg' 
                  : 'glass-button text-coffee-600 hover:bg-white/30'
              }`}
              title="Toggle filters"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Search Radius Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-coffee-700 flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-coffee-500 to-orange-500 rounded-full"></div>
                Search Radius
              </label>
              <span className="glass-button px-3 py-1 rounded-lg text-sm font-bold text-coffee-600">
                {searchRadius < 1000 ? `${searchRadius}m` : `${(searchRadius / 1000).toFixed(1)}km`}
              </span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="500"
                max="5000"
                step="100"
                value={searchRadius}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRadiusChange(parseInt(e.target.value))}
                className="w-full h-3 bg-gradient-to-r from-coffee-200 to-orange-200 rounded-full appearance-none cursor-pointer slider-thumb"
                disabled={isLoading}
                style={{
                  background: `linear-gradient(to right, #8B4513 0%, #D2691E ${((searchRadius - 500) / 4500) * 100}%, #f3f4f6 ${((searchRadius - 500) / 4500) * 100}%, #f3f4f6 100%)`
                }}
              />
            </div>
            <div className="flex justify-between text-xs font-medium text-gray-500">
              <span className="glass-button px-2 py-1 rounded">500m</span>
              <span className="glass-button px-2 py-1 rounded">5km</span>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="mt-4 pt-4 border-t border-white/20">
            <label className="text-sm font-semibold text-coffee-700 mb-3 block flex items-center gap-2">
              <Eye className="w-4 h-4" />
              View Mode
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setViewMode('visible')
                  setCurrentPage(1)
                }}
                className={`flex-1 p-3 rounded-xl text-sm font-semibold transition-all ${
                  viewMode === 'visible'
                    ? 'bg-coffee-600 text-white shadow-lg'
                    : 'glass-button text-coffee-600 hover:bg-white/30'
                }`}
              >
                <Eye className="w-4 h-4 mx-auto mb-1" />
                Map Area Only
              </button>
              <button
                onClick={() => {
                  setViewMode('all')
                  setCurrentPage(1)
                }}
                className={`flex-1 p-3 rounded-xl text-sm font-semibold transition-all ${
                  viewMode === 'all'
                    ? 'bg-coffee-600 text-white shadow-lg'
                    : 'glass-button text-coffee-600 hover:bg-white/30'
                }`}
              >
                <List className="w-4 h-4 mx-auto mb-1" />
                All Cafés
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-white/20 space-y-4 animate-fade-in-up">
              <div>
                <label className="text-sm font-semibold text-coffee-700 mb-2 block flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as 'distance' | 'rating')}
                  className="w-full p-3 glass-button rounded-xl text-sm focus:ring-2 focus:ring-coffee-300 focus:outline-none font-medium text-coffee-700 cursor-pointer"
                >
                  <option value="distance">📍 Nearest First</option>
                  <option value="rating">⭐ Highest Rated</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-coffee-700 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Minimum Rating
                  </label>
                  <span className="glass-button px-3 py-1 rounded-lg text-sm font-bold text-coffee-600">
                    {minRating > 0 ? `${minRating.toFixed(1)}⭐` : 'Any'}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={minRating}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinRating(parseFloat(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-yellow-200 to-yellow-400 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #FCD34D 0%, #F59E0B ${(minRating / 5) * 100}%, #f3f4f6 ${(minRating / 5) * 100}%, #f3f4f6 100%)`
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs font-medium text-gray-500 mt-1">
                  <span className="glass-button px-2 py-1 rounded">Any</span>
                  <span className="glass-button px-2 py-1 rounded">5.0⭐</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-coffee-700 mb-2 block flex items-center gap-2">
                  <List className="w-4 h-4" />
                  Cafés per page
                </label>
                <select
                  value={cafesPerPage}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setCafesPerPage(parseInt(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="w-full p-3 glass-button rounded-xl text-sm focus:ring-2 focus:ring-coffee-300 focus:outline-none font-medium text-coffee-700 cursor-pointer"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={15}>15 per page</option>
                  <option value={20}>20 per page</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto luxury-scrollbar">
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-400 m-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Show data source info */}
          {cafes.length > 0 && !isLoading && (
            <div className="mx-6 mb-4">
              <div className="glass-card p-4 rounded-xl border border-green-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                  <p className="text-sm font-medium text-green-700">
                    {cafes[0]?.id?.startsWith('osm_') 
                      ? '🗺️ Real café data from OpenStreetMap + Enhanced features'
                      : cafes[0]?.id?.startsWith('enhanced_mock_')
                      ? '📍 Enhanced demo data with realistic café information'
                      : '📍 Showing café data'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Skeleton Loading */}
          {isLoading && (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card p-5 rounded-2xl animate-pulse">
                  <div className="flex justify-between items-start mb-3">
                    <div className="skeleton h-6 w-32 rounded"></div>
                    <div className="skeleton h-5 w-16 rounded-full"></div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="skeleton h-4 w-4 rounded"></div>
                    <div className="skeleton h-4 w-12 rounded"></div>
                    <div className="skeleton h-4 w-16 rounded"></div>
                  </div>
                  <div className="skeleton h-4 w-full rounded mb-2"></div>
                  <div className="skeleton h-4 w-3/4 rounded mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="skeleton h-6 w-20 rounded-full"></div>
                    <div className="skeleton h-8 w-24 rounded-xl"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isLoading && (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 border-4 border-coffee-200 border-t-coffee-600 rounded-full animate-spin mx-auto"></div>
                  <Coffee className="w-8 h-8 text-coffee-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <h3 className="luxury-text text-lg font-semibold text-coffee-700 mb-2">Discovering Amazing Cafés</h3>
                <p className="text-gray-600">Finding the perfect coffee spots near you...</p>
                <div className="mt-4 flex justify-center space-x-1">
                  <div className="w-2 h-2 bg-coffee-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-coffee-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-coffee-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}

          {!isLoading && !error && filteredAndSortedCafes.length === 0 && userLocation && (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="relative mb-6">
                  <Coffee className="w-20 h-20 mx-auto text-gray-300 animate-float" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                </div>
                <h3 className="luxury-text text-xl font-bold text-gray-700 mb-3">No Cafés Found</h3>
                <p className="text-gray-500 mb-4">We couldn't find any cafés in this area.</p>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>💡 Try increasing the search radius</p>
                  <p>🔍 Search a different location</p>
                  <p>📍 Check a nearby city center</p>
                </div>
              </div>
            </div>
          )}

          {!userLocation && !isLoading && (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="relative mb-6">
                  <MapPin className="w-20 h-20 mx-auto text-coffee-300 animate-bounce-gentle" />
                  <div className="absolute inset-0 w-20 h-20 border-4 border-coffee-200 rounded-full animate-pulse mx-auto"></div>
                </div>
                <h3 className="luxury-text text-xl font-bold text-coffee-700 mb-3">Ready to Explore?</h3>
                <p className="text-gray-600 mb-6">Search for a location or use your current position to discover amazing cafés nearby.</p>
                <div className="space-y-3">
                  <div className="glass-card p-4 rounded-xl">
                    <div className="flex items-center gap-3 text-sm text-coffee-600">
                      <Search className="w-4 h-4" />
                      <span>Search any city or address</span>
                    </div>
                  </div>
                  <div className="glass-card p-4 rounded-xl">
                    <div className="flex items-center gap-3 text-sm text-blue-600">
                      <MapPin className="w-4 h-4" />
                      <span>Use your current location</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pagination Info */}
          {!isLoading && totalCafes > 0 && (
            <div className="px-6 py-3 border-t border-white/20 bg-gradient-to-r from-coffee-50/30 to-orange-50/30">
              <div className="flex items-center justify-between text-sm">
                <span className="luxury-text font-medium text-coffee-700">
                  {viewMode === 'visible' ? 'Visible in map' : 'Total'}: {totalCafes} café{totalCafes !== 1 ? 's' : ''}
                </span>
                <span className="glass-button px-3 py-1 rounded-full text-xs font-semibold text-coffee-600">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            </div>
          )}

          {/* Cafe List */}
          {!isLoading && paginatedCafes.length > 0 && (
            <div className="flex-1 p-6 space-y-4 luxury-scrollbar overflow-y-auto">
              {paginatedCafes.map((cafe: Cafe, index: number) => (
                <div
                  key={cafe.id}
                  onClick={() => setSelectedCafe(cafe)}
                  className={`luxury-card p-5 rounded-2xl cursor-pointer transition-all duration-300 ${
                    selectedCafe?.id === cafe.id
                      ? 'bg-gradient-to-r from-coffee-50 to-orange-50 border-2 border-coffee-400 shadow-xl scale-105'
                      : 'glass-card hover:bg-white/40 border border-white/30'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Cafe Header */}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="luxury-text font-bold text-coffee-800 text-lg leading-tight">
                      {cafe.name}
                    </h3>
                    {cafe.distance && (
                      <div className="glass-button px-3 py-1 rounded-full text-xs font-semibold text-coffee-600 ml-2 flex-shrink-0">
                        📍 {formatDistance(cafe.distance)}
                      </div>
                    )}
                  </div>

                  {/* Rating and Price */}
                  <div className="flex items-center justify-between mb-3">
                    {cafe.rating && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 rating-star" />
                          <span className="text-sm font-bold text-gray-800">{formatRating(cafe.rating)}</span>
                        </div>
                        {cafe.priceLevel && (
                          <div className="flex items-center">
                            <span className="text-green-600 font-bold">
                              {'💰'.repeat(cafe.priceLevel)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  {cafe.address && (
                    <div className="flex items-start gap-3 mb-4 p-3 glass-card rounded-xl">
                      <MapPin className="w-4 h-4 text-coffee-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 leading-relaxed font-medium">{cafe.address}</span>
                    </div>
                  )}

                  {/* Status and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                        cafe.openNow !== false 
                          ? 'status-open text-white' 
                          : 'status-closed text-white'
                      }`}>
                        <Clock className="w-3 h-3" />
                        {cafe.openNow !== false ? 'Open Now' : 'Closed'}
                      </div>
                      
                      {cafe.phoneNumber && (
                        <a 
                          href={`tel:${cafe.phoneNumber}`}
                          className="glass-button px-3 py-1 rounded-full text-xs font-semibold text-blue-600 hover:bg-blue-50 flex items-center gap-1 transition-all"
                          onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        >
                          <Phone className="w-3 h-3" />
                          Call
                        </a>
                      )}
                    </div>

                    <button
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation()
                        handleDirections(cafe)
                      }}
                      className="luxury-button flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                    >
                      <Navigation className="w-4 h-4" />
                      Directions
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && !isLoading && (
          <div className="p-4 border-t border-white/20 bg-gradient-to-r from-coffee-50/30 to-orange-50/30">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="luxury-button flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-coffee-600 to-coffee-700 text-white rounded-xl hover:from-coffee-700 hover:to-coffee-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <div className="flex items-center gap-2">
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all ${
                        currentPage === pageNum
                          ? 'bg-coffee-600 text-white shadow-lg'
                          : 'glass-button text-coffee-600 hover:bg-white/40'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="luxury-button flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-coffee-600 to-coffee-700 text-white rounded-xl hover:from-coffee-700 hover:to-coffee-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Footer Stats */}
        {totalCafes > 0 && !isLoading && (
          <div className="p-4 border-t border-white/20 bg-gradient-to-r from-coffee-50/50 to-orange-50/50 rounded-b-3xl">
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-coffee-500 to-orange-500 rounded-full animate-pulse"></div>
                <span className="luxury-text font-bold text-coffee-700">
                  Showing {startIndex + 1}-{Math.min(endIndex, totalCafes)} of {totalCafes}
                </span>
              </div>
              {userLocation && (
                <div className="glass-button px-3 py-1 rounded-full text-xs font-semibold text-coffee-600">
                  📍 {searchRadius < 1000 ? `${searchRadius}m` : `${(searchRadius / 1000).toFixed(1)}km`} radius
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}