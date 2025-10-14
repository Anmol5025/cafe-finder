'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import LoadingSpinner from '../components/LoadingSpinner'
import { LocationProvider } from '../contexts/LocationContext'

// Dynamically import MapComponent to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('../components/MapComponent'), {
  ssr: false,
  loading: () => <LoadingSpinner />
})

export default function Home() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <LoadingSpinner />
  }

  return (
    <LocationProvider>
      <div className="min-h-screen">
        <Header />
        
        <main className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 h-[calc(100vh-240px)] min-h-[600px]">
            {/* Map Section */}
            <div className="xl:col-span-3 relative group animate-fade-in-up">
              <div className="absolute inset-0 bg-gradient-to-r from-coffee-400/20 to-orange-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20 luxury-card">
                <div className="absolute top-4 left-4 z-10">
                  <div className="glass-card px-4 py-2 rounded-xl">
                    <span className="text-sm font-semibold text-coffee-700">🗺️ Interactive Map</span>
                  </div>
                </div>
                <MapComponent />
              </div>
            </div>
            
            {/* Sidebar Section */}
            <div className="xl:col-span-2 animate-slide-in-right">
              <Sidebar />
            </div>
          </div>
        </main>
      </div>
    </LocationProvider>
  )
}