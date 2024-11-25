import React, { useState } from 'react';
import { Header } from './components/Header';
import { MapComponent } from './components/Map';
import { Footer } from './components/Footer';
import { SearchBar } from './components/SearchBar';

interface Location {
  name: string;
  country: string;
  postcode: string;
  coordinates: [number, number];
  timezone: string;
  currency: string;
  countryCode: string;
}

function App() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const handleLocationSelect = async (locationData: any) => {
    const coordinates: [number, number] = [parseFloat(locationData.lon), parseFloat(locationData.lat)];
    
    // Get timezone data
    const tzResponse = await fetch(
      `https://api.timezonedb.com/v2.1/get-time-zone?key=YOUR_TIMEZONE_API_KEY&format=json&by=position&lat=${locationData.lat}&lng=${locationData.lon}`
    ).then(res => res.json()).catch(() => ({ zoneName: 'UTC' }));

    // Get currency data based on country code
    const currencyMap: { [key: string]: string } = {
      'US': 'USD',
      'GB': 'GBP',
      'EU': 'EUR',
      'AU': 'AUD',
      'CA': 'CAD',
      // Add more mappings as needed
    };

    const countryCode = locationData.address?.country_code?.toUpperCase() || '';
    const currency = currencyMap[countryCode] || 'USD';

    setSelectedLocation({
      name: locationData.display_name.split(',')[0], // Get just the city/location name
      country: locationData.address?.country || '',
      postcode: locationData.address?.postcode || '',
      coordinates,
      timezone: tzResponse.zoneName || 'UTC',
      currency,
      countryCode
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4">
          <SearchBar onLocationSelect={handleLocationSelect} />
        </div>
      </div>
      <main className="flex-1 flex flex-col">
        <MapComponent selectedLocation={selectedLocation} />
      </main>
      <Footer />
    </div>
  );
}

export default App;