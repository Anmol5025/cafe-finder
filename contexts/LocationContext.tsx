'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export interface Cafe {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  rating?: number
  priceLevel?: number
  openNow?: boolean
  photos?: string[]
  distance?: number
  placeId?: string
  phoneNumber?: string
  website?: string
  reviews?: Array<{
    author: string
    rating: number
    text: string
    time: number
  }>
}

export interface MapBounds {
  north: number
  south: number
  east: number
  west: number
}

export interface UserLocation {
  lat: number
  lng: number
  address?: string
}

interface LocationContextType {
  userLocation: UserLocation | null
  setUserLocation: (location: UserLocation | null) => void
  cafes: Cafe[]
  setCafes: (cafes: Cafe[]) => void
  selectedCafe: Cafe | null
  setSelectedCafe: (cafe: Cafe | null) => void
  searchRadius: number
  setSearchRadius: (radius: number) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  error: string | null
  setError: (error: string | null) => void
  searchLocation: (query: string) => Promise<void>
  getCurrentLocation: () => Promise<void>
  searchNearbyCafes: (lat: number, lng: number, radius: number) => Promise<void>
  mapBounds: MapBounds | null
  setMapBounds: (bounds: MapBounds | null) => void
  currentPage: number
  setCurrentPage: (page: number) => void
  cafesPerPage: number
  setCafesPerPage: (count: number) => void
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

export function LocationProvider({ children }: { children: ReactNode }) {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [cafes, setCafes] = useState<Cafe[]>([])
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null)
  const [searchRadius, setSearchRadius] = useState(1000)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [cafesPerPage, setCafesPerPage] = useState(10)

  const searchNearbyCafes = useCallback(async (lat: number, lng: number, radius: number) => {
    setIsLoading(true)
    setError(null)
    setCafes([]) // Clear previous cafés immediately
    setSelectedCafe(null) // Clear selected café
    setCurrentPage(1) // Reset to first page

    try {
      const response = await fetch(
        `/api/places?lat=${lat}&lng=${lng}&radius=${radius}`
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch nearby cafes')
      }

      setCafes(data.cafes || [])
      
      // Show info message if using mock data
      if (data.message) {
        console.log('API Info:', data.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search nearby cafes')
      setCafes([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const searchLocation = useCallback(async (query: string) => {
    if (!query.trim()) return

    setIsLoading(true)
    setError(null)
    setCafes([]) // Clear previous cafés immediately
    setSelectedCafe(null) // Clear selected café

    try {
      const response = await fetch(`/api/geocode?address=${encodeURIComponent(query)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to geocode location')
      }

      const location: UserLocation = {
        lat: data.lat,
        lng: data.lng,
        address: data.address
      }

      setUserLocation(location)
      await searchNearbyCafes(location.lat, location.lng, searchRadius)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search location')
      setCafes([]) // Ensure cafés are cleared on error too
    } finally {
      setIsLoading(false)
    }
  }, [searchRadius, searchNearbyCafes])

  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser')
      return
    }

    setIsLoading(true)
    setError(null)
    setCafes([]) // Clear previous cafés immediately
    setSelectedCafe(null) // Clear selected café

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        })
      })

      const { latitude: lat, longitude: lng } = position.coords

      // Reverse geocode to get address
      const response = await fetch(`/api/reverse-geocode?lat=${lat}&lng=${lng}`)
      const data = await response.json()

      const location: UserLocation = {
        lat,
        lng,
        address: data.address || 'Current Location'
      }

      setUserLocation(location)
      await searchNearbyCafes(lat, lng, searchRadius)
    } catch (err) {
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location access denied. Please enable location permissions.')
            break
          case err.POSITION_UNAVAILABLE:
            setError('Location information unavailable.')
            break
          case err.TIMEOUT:
            setError('Location request timed out.')
            break
          default:
            setError('An unknown error occurred while retrieving location.')
        }
      } else {
        setError('Failed to get current location')
      }
      setCafes([]) // Ensure cafés are cleared on error too
    } finally {
      setIsLoading(false)
    }
  }, [searchRadius, searchNearbyCafes])

  const value: LocationContextType = {
    userLocation,
    setUserLocation,
    cafes,
    setCafes,
    selectedCafe,
    setSelectedCafe,
    searchRadius,
    setSearchRadius,
    isLoading,
    setIsLoading,
    error,
    setError,
    searchLocation,
    getCurrentLocation,
    searchNearbyCafes,
    mapBounds,
    setMapBounds,
    currentPage,
    setCurrentPage,
    cafesPerPage,
    setCafesPerPage,
  }

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}