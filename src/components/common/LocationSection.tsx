"use client";

import { useState } from 'react';

export default function LocationSection() {
  const [distance, setDistance] = useState<string>('--');
  const [locationStatus, setLocationStatus] = useState<string>('');
  const [showNearestLocation, setShowNearestLocation] = useState<boolean>(false);

  const handleFindLocation = () => {
    setLocationStatus("Locating...");
    
    if (!navigator.geolocation) {
      setLocationStatus("Geolocation is not supported by your browser");
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Our location coordinates (Phuentsholing)
        const washXpressLat = 26.867141;
        const washXpressLng = 89.394196;
        
        // User's coordinates
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        
        // Calculate distance (simplified calculation)
        const calculatedDistance = calculateDistance(
          userLat, userLng, 
          washXpressLat, washXpressLng
        );
        
        // Update UI
        setDistance(calculatedDistance.toFixed(1));
        setLocationStatus("Location found!");
        setShowNearestLocation(true);
      },
      () => {
        setLocationStatus("Unable to retrieve your location");
      }
    );
  };

  // Helper function to calculate distance between two coordinates (in km)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c)*2;
  };

  return (
    <section id="locations" className="py-16 bg-gray-800 text-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Location</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Visit our premium car wash facility in Phuentsholing
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Location Info Card */}
          <div className="bg-gray-700 rounded-xl p-8 shadow-xl lg:w-1/3">
            <div className="flex items-center mb-6">
              <div className="bg-blue-600 rounded-full p-3 mr-4">
                <i className="fas fa-map-marker-alt text-white text-xl" />
              </div>
              <h3 className="text-2xl font-bold">WashXpress HQ</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <i className="fas fa-map-marker-alt text-blue-400 mt-1 mr-4 text-lg" />
                <div>
                  <h4 className="font-medium mb-1">Address</h4>
                  <p className="text-gray-400">Norgay Lam, Phuentsholing, Bhutan</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <i className="fas fa-clock text-blue-400 mt-1 mr-4 text-lg" />
                <div>
                  <h4 className="font-medium mb-1">Opening Hours</h4>
                  <p className="text-gray-400">Monday - Sunday: 7:00 AM - 10:00 PM</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <i className="fas fa-phone-alt text-blue-400 mt-1 mr-4 text-lg" />
                <div>
                  <h4 className="font-medium mb-1">Contact</h4>
                  <p className="text-gray-400">+975 77884488</p>
                </div>
              </div>
              
              <div className="pt-4">
                <a 
                  href="https://maps.google.com/?q=26.867141,89.394196" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  <i className="fas fa-directions mr-2" /> Get Directions
                </a>
              </div>
            </div>
          </div>
          
          {/* Map Container */}
          <div className="lg:w-2/3 rounded-xl overflow-hidden shadow-xl">
            <iframe 
              src="https://maps.google.com/maps?q=26.867141,89.394196&z=16&output=embed" 
              width="100%" 
              height="400" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy"
            />
          </div>
        </div>

        {/* Location Finder */}
        <div className="mt-12 bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Find Us Easily</h3>
            <p className="text-gray-300 mb-6">Get precise directions to our location using your current position</p>
            <button 
              id="find-me-btn" 
              onClick={handleFindLocation}
              className="bg-white text-blue-800 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg inline-flex items-center"
            >
              <i className="fas fa-location-arrow mr-2" /> Use My Current Location
            </button>
            <p id="location-status" className="mt-3 text-blue-200 text-sm">{locationStatus}</p>
            <div id="nearest-location" className={`mt-4 ${showNearestLocation ? 'block' : 'hidden'} bg-blue-950 bg-opacity-50 p-4 rounded-lg`}>
              <p className="text-white font-medium">Distance from you: Around <span id="distance-text" className="text-blue-300">{distance}</span> km</p>
              <a 
                id="nearest-location-link" 
                href={`https://www.google.com/maps/dir/?api=1&destination=26.867141,89.394196`} 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-white hover:text-blue-300 mt-2"
              >
                <i className="fas fa-directions mr-2" /> Get Turn-by-Turn Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}