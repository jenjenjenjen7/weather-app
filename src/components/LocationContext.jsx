import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const [location, setLocation] = useState({
    lat: null,
    lon: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({
        lat: null,
        lon: null,
        loading: false,
        error: 'Geolocation is not supported by your browser.',
      });
      return;
    }

    // Requests browser location permission
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          loading: false,
          error: null,
        });
      },
      (error) => {
        console.error("Geolocation Error:", error);
        setLocation({
          lat: null,
          lon: null,
          loading: false,
          error: "Location permission denied or unavailable.",
        });
      }
    );
  }, []);

  return (
    <LocationContext.Provider value={location}>
      {children}
    </LocationContext.Provider>
  );
}

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
