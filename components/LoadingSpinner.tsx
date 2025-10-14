'use client'

import { Coffee } from 'lucide-react'

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-50 to-coffee-100 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <Coffee className="w-16 h-16 text-coffee-600 animate-bounce mx-auto mb-4" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-coffee-200 border-t-coffee-600 rounded-full animate-spin mx-auto"></div>
        </div>
        <h2 className="text-2xl font-bold text-coffee-800 mb-2">Café Finder</h2>
        <p className="text-coffee-600">Loading your coffee adventure...</p>
      </div>
    </div>
  )
}