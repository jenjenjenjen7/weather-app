import React, { useState, useEffect, useRef } from "react";
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocation } from "./LocationContext";

export default function LatestObservations() {
  const { lat, lon, loading } = useLocation();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [observations, setObservations] = useState([]);
  const [fetchingWeather, setFetchingWeather] = useState(false);

  // 1. Initialize map (using your working setup)
  useEffect(() => {
    if (loading || !mapRef.current) return;
    const currentLat = lat ?? 47.6588;
    const currentLon = lon ?? -117.4260;

    if (!mapInstanceRef.current) {
      const map = window.L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
        dragging: true, // Let users pan around to change observations!
        scrollWheelZoom: false,
      }).setView([currentLat, currentLon], 7);

      const maptilerKey = import.meta.env.VITE_MAPTILER_KEY;
      if (window.L.maplibreGL && maptilerKey) {
        window.L.maplibreGL({
          style: {
            version: 8,
            glyphs: `https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=${maptilerKey}`,
            sources: {
              'openmaptiles': {
                type: 'vector',
                url: `https://api.maptiler.com/tiles/v3/tiles.json?key=${maptilerKey}`
              }
            },
            layers: [
              { id: 'background', type: 'background', paint: { 'background-color': '#5a5a5a' } },
              { id: 'water-layer', type: 'fill', source: 'openmaptiles', 'source-layer': 'water', filter: ['in', 'class', 'ocean', 'lake'], paint: { 'fill-color': '#103c8a' } },
              { id: 'land-layer', type: 'fill', source: 'openmaptiles', 'source-layer': 'landuse', paint: { 'fill-color': '#5a5a5a' } },
              { 
                id: 'place-label', 
                type: 'symbol', 
                source: 'openmaptiles', 
                'source-layer': 'place', 
                filter: ['in', 'class', 'city', 'town'],
                layout: { 'text-field': ['get', 'name'] } 
              }
            ]
          }
        }).addTo(map);
      }

      mapInstanceRef.current = map;

      // 2. When map finishes moving or loading, grab visible cities and fetch weather
      const fetchVisibleCitiesWeather = async () => {
        const maplibreMap = map.getContainer()._leaflet_maplibre_layer?.getMap(); 
        if (!maplibreMap) return;

        // Query rendered place features currently visible on screen
        const features = maplibreMap.queryRenderedFeatures({ layers: ['place-label'] });
        
        // Extract unique city names and coordinates
        const uniqueCities = [];
        const seenNames = new Set();

        for (const f of features) {
          const name = f.properties.name;
          if (name && !seenNames.has(name) && uniqueCities.length < 6) {
            seenNames.add(name);
            uniqueCities.push({
              name: name.toUpperCase(),
              lat: f.geometry.coordinates[1],
              lon: f.geometry.coordinates[0]
            });
          }
        }

        if (uniqueCities.length === 0) return;

        setFetchingWeather(true);
        try {
          // Fetch live weather for each visible city concurrently using Open-Meteo
          const weatherPromises = uniqueCities.map(async (city) => {
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,weathercode,wind_speed_10m`);
            const data = await res.json();
            
            // Convert Celsius to Fahrenheit for retro WeatherStar vibes
            const tempF = Math.round((data.current.temperature_2m * 9/5) + 32);
            const conditionCode = data.current.weathercode;
            
            // Map simple weather codes to retro strings
            let cond = "FAIR";
            if (conditionCode > 0 && conditionCode < 4) cond = "PCLDY";
            if (conditionCode >= 50 && conditionCode < 70) cond = "RAIN";
            if (conditionCode >= 70) cond = "SNOW";

            return {
              city: city.name,
              temp: tempF,
              cond: cond,
              wind: `${Math.round(data.current.wind_speed_10m)} MPH`
            };
          });

          const results = await Promise.all(weatherPromises);
          setObservations(results);
        } catch (err) {
          console.error("Failed to fetch dynamic weather observations:", err);
        } finally {
          setFetchingWeather(false);
        }
      };

      map.on('moveend', fetchVisibleCitiesWeather);
      setTimeout(fetchVisibleCitiesWeather, 1000); // Initial fetch after map renders
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lon, loading]);

  return (
    <div className="latest-observations-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Hidden map instance running behind the scenes to harvest data */}
      <div ref={mapRef} style={{ display: 'none' }} />

      <div className="retro-table" style={{ padding: '20px', color: '#ffb000', fontFamily: 'monospace' }}>
        <h2>LATEST OBSERVATIONS {fetchingWeather && "(SCANNING REGION...)"}</h2>
        <table style={{ width: '100%', marginTop: '15px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ffb000' }}>
              <th style={{ textAlign: 'left' }}>CITY</th>
              <th style={{ textAlign: 'center' }}>TEMP</th>
              <th style={{ textAlign: 'center' }}>COND</th>
              <th style={{ textAlign: 'right' }}>WIND</th>
            </tr>
          </thead>
          <tbody>
            {observations.map((obs, idx) => (
              <tr key={idx} style={{ lineHeight: '2' }}>
                <td>{obs.city}</td>
                <td style={{ textAlign: 'center' }}>{obs.temp}°F</td>
                <td style={{ textAlign: 'center' }}>{obs.cond}</td>
                <td style={{ textAlign: 'right' }}>{obs.wind}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
