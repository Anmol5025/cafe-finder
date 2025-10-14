# ☕ Café Finder - Next.js Application

A modern, full-stack web application built with Next.js to help users discover nearby cafés with advanced features including real-time location detection, interactive maps, and comprehensive café information.

## 🚀 Features

### Core Functionality
- **🎯 Real-Time Location Detection**: Automatically identifies user location with permission
- **🔍 Nearby Café Search**: Finds cafés within customizable radius (500m - 5km)
- **🗺️ Interactive Map Interface**: Displays cafés as markers with smooth navigation
- **💬 Info Windows**: Detailed café information on marker clicks
- **📱 Responsive Design**: Seamless experience on desktop and mobile

### Advanced Features
- **🎛️ Smart Filtering**: Sort by distance or rating, filter by minimum rating
- **📍 Dual Location Input**: Search by address or use GPS detection
- **🔄 Real-time Updates**: Dynamic search radius adjustment
- **📞 Direct Actions**: Call cafés, get directions, visit websites
- **⭐ Rich Data**: Ratings, reviews, opening hours, price levels
- **🎨 Modern UI**: Beautiful design with Tailwind CSS and custom animations

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Leaflet** - Interactive maps
- **Lucide React** - Modern icons

### Backend
- **Next.js API Routes** - Server-side functionality
- **Google Places API** - Primary café data source
- **Google Geocoding API** - Location services
- **OpenStreetMap/Nominatim** - Fallback services

### APIs & Services
- **Google Maps Platform** (Primary)
  - Places API for café data
  - Geocoding API for address resolution
- **OpenStreetMap** (Fallback)
  - Nominatim for geocoding
  - Overpass API for café data

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Maps API keys (recommended)

### 1. Clone Repository
```bash
git clone <repository-url>
cd cafe-finder-nextjs
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
Create `.env.local` file:
```env
# Google Maps API Configuration (Recommended)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Get Google API Keys
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create credentials (API Keys)
5. Add keys to `.env.local`

### 5. Run Development Server
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000`

## 🏗️ Project Structure

```
cafe-finder-nextjs/
├── app/
│   ├── api/                    # Backend API routes
│   │   ├── geocode/           # Address to coordinates
│   │   ├── reverse-geocode/   # Coordinates to address
│   │   └── places/            # Café search functionality
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
├── components/
│   ├── Header.tsx             # Search interface
│   ├── MapComponent.tsx       # Interactive map
│   ├── Sidebar.tsx            # Café list & filters
│   └── LoadingSpinner.tsx     # Loading states
├── contexts/
│   └── LocationContext.tsx    # Global state management
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## 🎯 How It Works

### 1. Location Detection
- **Manual Search**: Enter city, address, or landmark
- **GPS Detection**: Click "Use Current Location" for automatic detection
- **Geocoding**: Converts addresses to coordinates using Google/Nominatim APIs

### 2. Café Discovery
- **Primary**: Google Places API for rich, real-time data
- **Fallback**: OpenStreetMap Overpass API for basic café information
- **Radius Control**: Adjustable search area (500m to 5km)

### 3. Interactive Features
- **Map Navigation**: Zoom, pan, click markers for details
- **Filtering**: Sort by distance/rating, filter by minimum rating
- **Actions**: Get directions, call cafés, visit websites
- **Real-time Updates**: Instant results when changing search parameters

## 🔧 Configuration Options

### API Fallback System
The app gracefully falls back to free APIs if Google APIs aren't configured:
- Google Places API → OpenStreetMap Overpass API
- Google Geocoding → Nominatim API

### Customization
- Modify search radius limits in `contexts/LocationContext.tsx`
- Adjust map styling in `components/MapComponent.tsx`
- Customize UI colors in `tailwind.config.js`

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Other Platforms
```bash
npm run build
npm start
```

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_MAPS_API_KEY` | Optional | Google Maps JavaScript API key |
| `GOOGLE_PLACES_API_KEY` | Optional | Google Places API key |
| `NEXT_PUBLIC_APP_URL` | Optional | Application URL for production |

## 🌟 Key Features Explained

### Real-Time Location Detection
- Automatic GPS detection with user permission
- Fallback to manual location entry
- Address resolution for both methods

### Advanced Filtering
- Sort by distance or rating
- Minimum rating filter
- Real-time search radius adjustment

### Rich Café Information
- Name, address, rating, distance
- Phone numbers, websites, reviews
- Opening hours and price levels
- Direct action buttons (call, directions)

### Responsive Design
- Mobile-first approach
- Touch-friendly interface
- Optimized for all screen sizes

## 🔮 Future Enhancements

- **Favorites System**: Save preferred cafés
- **Route Planning**: Multi-stop café tours  
- **Social Features**: Share café discoveries
- **Offline Mode**: Cached maps and data
- **Advanced Filters**: WiFi, outdoor seating, etc.
- **User Reviews**: Community-driven ratings
- **Push Notifications**: New cafés in area

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- Check the [Issues](https://github.com/your-repo/issues) page
- Review API documentation for Google Maps Platform
- Ensure proper API key configuration and permissions