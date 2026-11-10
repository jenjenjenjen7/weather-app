import React, { useEffect, useRef, useState } from 'react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocation } from "./LocationContext";

export default function LocalRadar() {
  const { lat, lon, loading, error } = useLocation();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [leafletReady, setLeafletReady] = useState(false);

useEffect(() => {
    const checkLeaflet = setInterval(() => {
      if (typeof window.L !== 'undefined') {
        setLeafletReady(true);
        clearInterval(checkLeaflet);
      }
    }, 50);
    return () => clearInterval(checkLeaflet);
  }, []);

  // Main map initialization effect (no extra timers needed)
  useEffect(() => {
    if (loading || !leafletReady || !mapRef.current) return;
	const currentLat = lat ?? 47.6588;
    	const currentLon = lon ?? -117.4260;

(async () => {
      try {
        if (!mapInstanceRef.current && mapRef.current) {
          // Initialize Map using window.L from CDN
          const map = window.L.map(mapRef.current, {
            zoomControl: false,
            attributionControl: false,
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            boxZoom: false,
            touchZoom: false,
            keyboard: false
          }).setView([currentLat, currentLon], 7);

          const maptilerKey = import.meta.env.VITE_MAPTILER_KEY;
               
	if (window.L.maplibreGL && maptilerKey) {
            window.L.maplibreGL({
              style: {
                version: 8,
                sources: {
                  'openmaptiles': {
                    type: 'vector',
                    url: `https://api.maptiler.com/tiles/v3/tiles.json?key=${maptilerKey}` 
                  }
                },
                glyphs: `https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=${maptilerKey}`,
                layers: [
                  {
                    id: 'background',
                    type: 'background',
                    paint: { 'background-color': '#5a5a5a' } 
                  },
                  {
                    id: 'water-layer',
                    type: 'fill',
                    source: 'openmaptiles',
                    'source-layer': 'water',
                    paint: { 'fill-color': '#103c8a' } // Retro water blue
                  },
                  {
                    id: 'land-layer',
                    type: 'fill',
                    source: 'openmaptiles',
                    'source-layer': 'landuse',
                    paint: { 'fill-color': '#5a5a5a' } 
                  },
                  {
                    id: 'boundary-state',
                    type: 'line',
                    source: 'openmaptiles',
                    'source-layer': 'boundary',
                    filter: ['==', 'admin_level', 4],
                    paint: {
                      'line-color': '#222222', // Subtle dark state borders
                      'line-width': 1.2
                    }
                  }, 
                  {
                    id: 'road-interstate',
                    type: 'line',
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['==', 'class', 'motorway'],
                    paint: {
                      'line-color': '#B8B8B8', 
                      'line-width': 1
                    }
                  },
                  {
                    id: 'place-label',
                    type: 'symbol',
                    source: 'openmaptiles',
                    'source-layer': 'place',
                    filter: ['in', 'class', 'city', 'town'],
                    layout: {
                      'text-field': ['get', 'name'],
                      'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
                      'text-size': 11,
                      'text-transform': 'uppercase'
                    },
                    paint: {
                      'text-color': '#ffffff',
                      'text-halo-color': '#000000',
                      'text-halo-width': 1.5
                    }
                  }
                ]
              }
            }).addTo(map);
    } else {
            console.error("no map, womp womp!");
          } 
          
      try {
            const response = await fetch('https://api.rainviewer.com/public/weather-maps.json');
            const data = await response.json();
            
            console.log("RainViewer API data loaded:", data);

            if (data && data.radar && data.radar.past && data.radar.past.length > 0) {
              // Grab the most recent past radar frame
              const latestFrame = data.radar.past[data.radar.past.length - 1];
              const host = data.host || 'https://tilecache.rainviewer.com';
              // Construct the tile layer URL using RainViewer's official path format
              const radarUrl = `${host}${latestFrame.path}/256/{z}/{x}/{y}/2/1_1.png`;
              
              console.log("Adding RainViewer tile layer URL:", radarUrl);

              window.L.tileLayer(radarUrl, {
                opacity: 0.75,
                maxZoom: 19,
                zIndex: 100
              }).addTo(map);
            } else {
              console.warn("RainViewer metadata returned no past radar frames.");
            }
          } catch (radarErr) {
            console.error("Failed to load RainViewer radar overlay:", radarErr);
          }
          mapInstanceRef.current = map;

          // CRITICAL: Force Leaflet to recalculate container dimensions immediately after mount
          setTimeout(() => {
            map.invalidateSize();
          }, 100);

        } else if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([currentLat, currentLon], 7);
          mapInstanceRef.current.invalidateSize();
        }
      } catch (err) {
        console.error("Map initialization error:", err);
      }
    })();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lon, loading, leafletReady]);

  if (loading) {
    return <div className="radar-loading-text">SCANNING LOCAL RADAR DATA...</div>;
  }     
  return (
    <>
      <header className="header radar-theme">
        <div className="radar-header-banner"></div>
        <div className="segment">
          <span className="wind">Local Radar</span>
        </div>
      </header>

      <main className="main radar">
        {error && (
          <div className="radar-error-notice">
            Notice: {error} (Using Default Radar Station)
          </div>
        )}
        <div ref={mapRef} className="radar-map-container" />

      </main>
    </>
  );
}
