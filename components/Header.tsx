'use client'

import { useState } from 'react'
import { Search, MapPin, Coffee } from 'lucide-react'
import { useLocation } from '../contexts/LocationContext'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const { searchLocation, getCurrentLocation, isLoading } = useLocation()

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      await searchLocation(searchQuery.trim())
    }
  }

  const handleCurrentLocation = async () => {
    await getCurrentLocation()
  }

  return (
    <header className="relative overflow-hidden">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/90 to-white/80 backdrop-blur-xl border-b border-white/20"></div>
      
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Logo and Title */}
        <div className="flex items-center justify-center mb-8 animate-fade-in-up">
          <div className="relative">
            <Coffee className="w-12 h-12 text-coffee-600 mr-4 animate-bounce-gentle" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse"></div>
          </div>
          <h1 className="luxury-heading text-5xl md:text-6xl font-black tracking-tight">
            Café Finder
          </h1>
        </div>

        {/* Search Section */}
        <div className="max-w-4xl mx-auto animate-slide-in-right">
          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-coffee-400 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-coffee-400 w-6 h-6 z-10" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Discover amazing cafés in any city..."
                  className="w-full pl-14 pr-6 py-4 bg-white/90 backdrop-blur-sm border-2 border-white/50 rounded-2xl focus:border-coffee-400 focus:outline-none focus:ring-4 focus:ring-coffee-200/50 transition-all duration-300 text-gray-800 placeholder-gray-500 text-lg font-medium shadow-xl"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading || !searchQuery.trim()}
                className="luxury-button px-8 py-4 bg-gradient-to-r from-coffee-600 to-coffee-700 text-white rounded-2xl hover:from-coffee-700 hover:to-coffee-800 focus:outline-none focus:ring-4 focus:ring-coffee-300/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Searching...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    <span>Search</span>
                  </div>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleCurrentLocation}
                disabled={isLoading}
                className="luxury-button px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 font-semibold shadow-xl"
                title="Use current location"
              >
                <MapPin className="w-6 h-6" />
                <span className="hidden sm:inline">My Location</span>
              </button>
            </div>
          </form>

          {/* Quick Search Suggestions */}
          <div className="flex flex-wrap justify-center gap-3">
            <span className="text-sm font-medium text-gray-600 self-center mr-2">Popular:</span>
            {[
              { city: 'New York', emoji: '🗽' },
              { city: 'San Francisco', emoji: '🌉' },
              { city: 'London', emoji: '🇬🇧' },
              { city: 'Paris', emoji: '🇫🇷' },
              { city: 'Tokyo', emoji: '🇯🇵' },
              { city: 'Sydney', emoji: '🇦🇺' }
            ].map(({ city, emoji }) => (
              <button
                key={city}
                onClick={() => {
                  setSearchQuery(city)
                  searchLocation(city)
                }}
                disabled={isLoading}
                className="glass-button px-4 py-2 text-sm font-medium text-coffee-700 rounded-xl hover:bg-white/40 transition-all duration-300 disabled:opacity-50 flex items-center gap-2 shadow-lg"
              >
                <span>{emoji}</span>
                <span>{city}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}