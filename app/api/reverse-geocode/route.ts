import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')

  if (!lat || !lng) {
    return NextResponse.json(
      { error: 'Latitude and longitude parameters are required' },
      { status: 400 }
    )
  }

  try {
    // Using Google Reverse Geocoding API if available, fallback to Nominatim
    const googleApiKey = process.env.GOOGLE_MAPS_API_KEY

    if (googleApiKey) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleApiKey}`
      )
      
      const data = await response.json()
      
      if (data.status === 'OK' && data.results.length > 0) {
        return NextResponse.json({
          address: data.results[0].formatted_address,
        })
      }
    }

    // Fallback to Nominatim (OpenStreetMap)
    const nominatimResponse = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'CafeFinder/1.0 (contact@example.com)'
        }
      }
    )

    if (!nominatimResponse.ok) {
      throw new Error('Reverse geocoding service unavailable')
    }

    const nominatimData = await nominatimResponse.json()

    return NextResponse.json({
      address: nominatimData.display_name || 'Unknown location',
    })

  } catch (error) {
    console.error('Reverse geocoding error:', error)
    return NextResponse.json(
      { address: 'Current Location' },
      { status: 200 }
    )
  }
}