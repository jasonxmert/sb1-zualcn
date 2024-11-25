import React from 'react';
import { MapPin } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-6 px-4 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center space-x-4">
          <MapPin size={40} className="text-blue-200" />
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight">Search By Postcode</h1>
            <p className="mt-2 text-blue-100">Find postcodes using different search methods</p>
          </div>
        </div>
      </div>
    </header>
  );
}