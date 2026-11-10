import React, { useState, useEffect, useRef} from "react";
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocation } from "./LocationContext";

export default function RegionalObservations() {
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
                    filter: ['in', 'class', 'ocean', 'lake'], 
                    paint: { 'fill-color': '#103c8a' }
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
  	
	return (
	<main className="regional-observations-map" >
      		{error && (
        		<div className="regional-error-notice">
          		Notice: {error} (Using Default Location)
        		</div>
      		)}
      		<div ref={mapRef} className="regional-map-container"/>
    	</main>
	);
}
