'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Search } from 'lucide-react';

// Dynamically import the map component
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

interface Location {
  lat: number;
  lng: number;
  formattedAddress?: string;
}

interface LocationPickerProps {
  location: Location | null;
  onLocationChange: (location: Location) => void;
}

export default function LocationPicker({ location, onLocationChange }: LocationPickerProps) {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<[number, number] | null>(
    location ? [location.lat, location.lng] : null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  
  // Default to Kathmandu, Nepal
  const defaultCenter: [number, number] = [27.7172, 85.3240];
  const center = position || defaultCenter;

  useEffect(() => {
    setMounted(true);
    
    // Try to get user's current location
    if (!location && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setPosition(newPos);
          reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        },
        (error) => {
          console.log('Location access denied or unavailable');
        }
      );
    }
  }, [location]);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `/api/geocode/reverse?lat=${lat}&lon=${lng}`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding failed');
      }
      
      const data = await response.json();
      
      if (data.display_name) {
        onLocationChange({
          lat,
          lng,
          formattedAddress: data.display_name,
        });
      } else {
        onLocationChange({ lat, lng });
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      onLocationChange({ lat, lng });
    }
  };

  const handlePositionChange = (newPosition: [number, number]) => {
    setPosition(newPosition);
    reverseGeocode(newPosition[0], newPosition[1]);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const response = await fetch(
        `/api/geocode/search?q=${encodeURIComponent(searchQuery + ', Nepal')}`
      );
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const newPos: [number, number] = [parseFloat(result.lat), parseFloat(result.lon)];
        setPosition(newPos);
        onLocationChange({
          lat: newPos[0],
          lng: newPos[1],
          formattedAddress: result.display_name,
        });
      } else {
        alert('Location not found. Please try a different search term.');
      }
    } catch (error) {
      console.error('Search failed:', error);
      alert('Failed to search location. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setPosition(newPos);
          reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        },
        (error) => {
          alert('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  if (!mounted) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search location (e.g., Thamel, Kathmandu)"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={searching}
          className="px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {searching ? 'Searching...' : 'Search'}
        </button>
        <button
          onClick={handleCurrentLocation}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          title="Use my current location"
        >
          <MapPin className="w-5 h-5" />
        </button>
      </div>

      {/* Map */}
      <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-300 relative">
        <MapComponent 
          center={center}
          position={position}
          onPositionChange={handlePositionChange}
        />
      </div>

      {/* Selected Location Display */}
      {location?.formattedAddress && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm font-semibold text-blue-900 mb-1">Selected Location:</p>
          <p className="text-sm text-blue-800">{location.formattedAddress}</p>
          <p className="text-xs text-blue-600 mt-1">
            Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
          </p>
        </div>
      )}

      <p className="text-xs text-gray-500">
        💡 Click on the map to select your delivery location, or search for a place
      </p>
    </div>
  );
}
