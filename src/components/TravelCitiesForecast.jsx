import React, { useState, useEffect } from "react";

const travelCities = [
  { city: "ATLANTA", lat: 33.749, lon: -84.390 },
  { city: "BOSTON", lat: 42.360, lon: -71.058 },
  { city: "CHICAGO", lat: 41.882, lon: -87.628 },
  { city: "CLEVELAND", lat: 41.483, lon: -81.675 },
  { city: "DALLAS", lat: 32.776, lon: -96.797 },
  { city: "DENVER", lat: 39.739, lon: -104.990 },
  { city: "DETROIT", lat: 42.331, lon: -83.045 },
  { city: "HARTFORD", lat: 41.763, lon: -72.680 },
  { city: "HOUSTON", lat: 29.760, lon: -95.369 },
  { city: "INDIANAPOLIS", lat: 39.768, lon: -86.158 },
  { city: "LOS ANGELES", lat: 34.052, lon: -118.243 },
  { city: "MIAMI", lat: 25.761, lon: -80.191 },
  { city: "MINNEAPOLIS", lat: 44.977, lon: -93.265 },
  { city: "NEW YORK", lat: 40.712, lon: -74.006 },
  { city: "NORFOLK", lat: 36.847, lon: -76.286 },
  { city: "ORLANDO", lat: 28.538, lon: -81.379 },
  { city: "PHILADELPHIA", lat: 39.952, lon: -75.165 },
  { city: "PITTSBURGH", lat: 40.440, lon: -79.995 },
  { city: "ST. LOUIS", lat: 38.616, lon: -90.204 },
  { city: "SAN FRANCISCO", lat: 37.774, lon: -122.419 },
  { city: "SEATTLE", lat: 47.606, lon: -122.332 },
  { city: "SYRACUSE", lat: 43.041, lon: -76.143 },
  { city: "TAMPA", lat: 27.948, lon: -82.458 },
  { city: "WASHINGTON DC", lat: 38.907, lon: -77.036 }
];
	
  
export default function TravelCitiesForecast() {
	const [forecasts, setForecasts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	
	return (
		<main className = "travel-theme">

		</main>
	);
}
