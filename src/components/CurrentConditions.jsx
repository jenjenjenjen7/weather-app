import React, { useState, useEffect } from "react";
import { useLocation } from "./LocationContext";

function getCardinalDirection(angle) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return directions[Math.round(angle / 45) % 8];
}

function calculateDewPointFahrenheit(tempF, humidity) {
  const rh = humidity === 0 ? 1 : humidity; 
  const tempC = (tempF - 32) * (5 / 9);
  const a = 17.625;
  const b = 243.04;

  const alpha = Math.log(rh / 100) + (a * tempC) / (b + tempC);
  const dewPointC = (b * alpha) / (a - alpha);
  const dewPointF = (dewPointC * (9 / 5)) + 32;
  
  return Math.round(dewPointF);
}

function calculateCloudCeiling(tempF, dewPointF) {
  const spread = tempF - dewPointF;
  if (spread <= 0) return 0; 
  const ceilingFeet = (spread / 4.4) * 1000;
  return Math.round(ceilingFeet / 100) * 100;
}

function getWeatherStarDescription(id) {
  const specificMap = {
    800: "Clear",
    804: "Cloudy",
    741: "Fog",
    500: "Light Rain",
    511: "Freezing Rain",
    611: "Sleet",
    600: "Light Snow",
    602: "Heavy Snow",
    612: "Sleet",
    613: "Rain Sleet",
    615: "Rain Snow",
    616: "Wintry Mix",
  };

  if (specificMap[id]) return specificMap[id];

  if (id >= 200 && id < 300) return "T'Storms";
  if (id >= 300 && id < 400) return "Showers";
  if (id >= 500 && id < 600) return "Rain";
  if (id >= 600 && id < 700) return "Snow Flurries";
  if (id >= 700 && id < 800) return "Fog";
  if (id === 801 || id === 802) return "Partly Cloudy";
  if (id === 803) return "Mostly Cloudy";

  return "Clear";
}

function getApparentTemperature(tempF, windMph, humidityPercent) {
    if (tempF <= 50 && windMph > 3) {
        let windChill = 35.74 + (0.6215 * tempF) - (35.75 * Math.pow(windMph, 0.16)) + (0.4275 * tempF * Math.pow(windMph, 0.16));
        return { label: "Wind Chill", value: Math.round(windChill)};
    }
    if (tempF >= 80) {
        let heatIndex = 0.5 * (tempF + 61.0 + ((tempF - 68.0) * 1.2) + (humidityPercent * 0.094));
        return { label: "Heat Index", value: Math.round(heatIndex)};
    }
    return null; 
}

function isValidGust(gust, speed){
    if(!gust) return false; 
    if((gust - speed >= 5) && (gust >= 15)) {
        return true;
    }
}

export default function CurrentConditions() {
  // 1. Pull latitude, longitude, and optional name from your LocationContext
  // (Adjust variable names below like lat, lon, city if your Context uses slightly different naming)
  const { lat, lon, locationName: contextLocationName } = useLocation();
  
  const [locationName, setLocationName] = useState("Locating...");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 2. If the context doesn't have coordinates yet, wait or handle gracefully
    if (lat == null || lon == null) {
      setError("Waiting for location...");
      return;
    }

    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    if (!apiKey) {
      setError("Missing Weather API Key.");
      return;
    }

    // 3. Fetch data directly using the context coordinates (No navigator.geolocation blocking!)
    async function fetchWeatherData() {
      try {
        const [geoRes, weatherRes] = await Promise.all([
          fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`),
          fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`),
        ]);

        const geoData = await geoRes.json();
        const weatherData = await weatherRes.json();
        
        const rawTemp = weatherData.main.temp;
        const rawHumidity = weatherData.main.humidity;
        
        const calculatedDewPoint = calculateDewPointFahrenheit(rawTemp, rawHumidity);
        const calculatedCeiling = calculateCloudCeiling(rawTemp, calculatedDewPoint);
        const apparentInfo = getApparentTemperature(rawTemp, weatherData.wind.speed, rawHumidity);
        const gustVal = weatherData.wind?.gust;
        const validGust = isValidGust(gustVal, weatherData.wind.speed) ? Math.round(gustVal) : null;

        // Fallback to geocoding API name if context didn't provide one
        if (contextLocationName) {
          setLocationName(contextLocationName);
        } else if (geoData[0]?.name) {
          setLocationName(geoData[0].name);
        }

        setWeather({
          temp: Math.round(rawTemp),
          sky: getWeatherStarDescription(weatherData.weather[0].id),
          icon: weatherData.weather[0].icon,
          windSpeed: weatherData.wind.speed.toFixed(0),
          windDir: weatherData.wind.speed === 0 ? "" : getCardinalDirection(weatherData.wind.deg),
          windGust: validGust,
          humidity: rawHumidity,
          dewpoint: calculatedDewPoint,
          ceiling: calculatedCeiling,
          pressure: (weatherData.main.pressure * 0.0295301).toFixed(2),
          visibility: (weatherData.visibility / 1609.34).toFixed(0),
          apparent: apparentInfo,
        });
        setError(null); // Clear any pending errors on success
      } catch (err) {
        console.error("API Fetch Error:", err);
        setError("Failed to fetch weather data.");
      }
    }

    fetchWeatherData();
  }, [lat, lon, contextLocationName]); // Re-fetch whenever the location changes in context!

  return (
    <main className="main">
      {weather ? (
        <>
        <div className="weather-grid">
            <div id="conditions_left">
                <div className="temp">{weather.temp}°</div>
                <div className="sky">{weather.sky}</div>
                <div className="weather-icon-container">
                    {weather.icon && (
                        <img id="weather-icon"
                            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
                            alt={weather.sky || "Weather Icon"} />
                    )}
                </div>
    
                <div className="wind">Wind: {weather.windSpeed < 1 ? "Calm" : `${weather.windDir} ${weather.windSpeed}`}</div>
                {weather.windGust && (
                  <div>Gusts to {weather.windGust}</div>
              )}
            </div>

            <div id="conditions_right" className="newfont">
                <div className="location"> {error || locationName} </div>
                <div className="indented">
                    <div>Humidity: {weather.humidity}%</div>
                    <div>Dewpoint: {weather.dewpoint}°</div>
                    <div>Ceiling: {weather.sky.includes("Clear") || weather.ceiling > 25000 ? "Unlimited" : 
                                            `${weather.ceiling.toLocaleString()} ft.`}</div>
                    <div>Visibility: {weather.visibility >= 10 ? "UNLIMITED" : `${weather.visibility}mi.`}</div>
                    <div>Pressure: {weather.pressure}</div>
                    {weather.apparent && (
                    <div>{weather.apparent.label}: {weather.apparent.value}°</div>
                    )}
                </div>    
            </div>
        </div>
        </>
      ) : (
        <div className="newfont loading-state">
          <p>{error || "No Report Available"}</p>
        </div>
      )}
    </main>
  );
}
