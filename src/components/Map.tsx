import React, { useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import { SplitMap } from './SplitMap';

interface Location {
  name: string;
  country: string;
  postcode: string;
  coordinates: [number, number];
  timezone: string;
  currency: string;
  countryCode: string;
}

interface MapComponentProps {
  selectedLocation: Location | null;
}

export function MapComponent({ selectedLocation }: MapComponentProps) {
  const [mapInstance, setMapInstance] = useState<Map | null>(null);

  React.useEffect(() => {
    if (selectedLocation && mapInstance) {
      mapInstance.getView().animate({
        center: fromLonLat(selectedLocation.coordinates),
        zoom: 12,
        duration: 1000
      });
    }
  }, [selectedLocation, mapInstance]);

  return (
    <div className="flex-1 container mx-auto px-4 py-6">
      <div className="max-w-5xl mx-auto">
        <div className="relative rounded-xl overflow-hidden shadow-2xl border-2 border-gray-200">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/10" />
          <div 
            className="h-[600px] w-full relative z-10"
            style={{ 
              background: 'rgb(240, 243, 245)',
              transition: 'all 0.3s ease-in-out'
            }} 
          >
            <SplitMap 
              position="center"
              onMapInit={setMapInstance}
              selectedLocation={selectedLocation}
            />
          </div>
        </div>
      </div>
    </div>
  );
}