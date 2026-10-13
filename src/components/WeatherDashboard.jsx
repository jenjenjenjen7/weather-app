import React, { useState, useEffect } from "react";

function getCardinalDirection(angle) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return directions[Math.round(angle / 45) % 8];
}
function calculateDewPointFahrenheit(tempF, humidity) {
  // Prevent Math.log(0) crashing the app if humidity is 0
  const rh = humidity === 0 ? 1 : humidity; 
  
  // Convert Fahrenheit to Celsius for the formula
  const tempC = (tempF - 32) * (5 / 9);
  
  const a = 17.625;
  const b = 243.04;

  const alpha = Math.log(rh / 100) + (a * tempC) / (b + tempC);
  const dewPointC = (b * alpha) / (a - alpha);

  // Convert resulting Celsius dew point back to Fahrenheit
  const dewPointF = (dewPointC * (9 / 5)) + 32;
  
  return Math.round(dewPointF);
}

function calculateCloudCeiling(tempF, dewPointF) {
  const spread = tempF - dewPointF;
  
  // If the spread is 0 or negative, it means clouds/fog are at ground level
  if (spread <= 0) return 0; 
  
  // Standard aviation lapse rate math
  const ceilingFeet = (spread / 4.4) * 1000;
  
  // Round to the nearest 100 feet for standard display
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
    613: "Rain / Sleet",
    615: "Rain / Snow",
    616: "Wintry Mix",
  };

  if (specificMap[id]) return specificMap[id];

  if (id >= 200 && id < 300) return "T'Storms";
  if (id >= 300 && id < 400) return "Showers";
  if (id >= 500 && id < 600) return "Rain";
  if (id >= 600 && id < 700) return "Snow / Flurries";
  if (id >= 700 && id < 800) return "Fog / Haze";
  if (id === 801 || id === 802) return "P. Cloudy";
  if (id === 803) return "M. Cloudy";

  return "Clear";
}

export default function WeatherDashboard() {
  const [locationName, setLocationName] = useState("Locating...");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by browser.");
      return;
    }

    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lon } = position.coords;

        try {
          const [geoRes, weatherRes] = await Promise.all([
            fetch(
              `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
            ),
            fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
            ),
          ]);

          const geoData = await geoRes.json();
          const weatherData = await weatherRes.json();
          
	  const rawTemp = weatherData.main.temp;
	  const rawHumidity = weatherData.main.humidity;
	
	  const calculatedDewPoint = calculateDewPointFahrenheit(rawTemp, rawHumidity);
	  const calculatedCeiling = calculateCloudCeiling(rawTemp, calculatedDewPoint);
          
          if (geoData[0]?.name) setLocationName(geoData[0].name);

          setWeather({
            temp: Math.round(rawTemp),
	    sky: getWeatherStarDescription(weatherData.weather[0].id),
            icon: weatherData.weather[0].icon,
            windSpeed: weatherData.wind.speed.toFixed(0),
            windDir: weatherData.wind.speed === 0 ? "" : getCardinalDirection(weatherData.wind.deg),
            humidity: rawHumidity,
            dewpoint: calculatedDewPoint,
            ceiling: calculatedCeiling,
            pressure: (weatherData.main.pressure * 0.0295301).toFixed(2),
            visibility: (weatherData.visibility / 1609.34).toFixed(0),
          });
        } catch (err) {
          console.error("API Fetch Error:", err);
          setError("Failed to fetch weather data.");
        }
      },
      (geoErr) => {
        console.error("Geolocation Error:", geoErr);
        setError("Location permission denied.");
      }
    );
  }, []);

  return (
    <main className="main">
      {weather ? (
        <>
			<div className="weather-grid">
				<div id="conditions_left">
    					<div className="temp">{weather.temp}°</div>
    
    					<div className="newfont">
        					{weather.sky}
    					</div>
    
    					<div className="weather-icon-container">
						{weather.icon && (
        						<img 
            						id="weather-icon"
            						src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
            						alt={weather.sky || "Weather Icon"} 
        						/>
    						)}
    					</div>
    
    					<div className="wind">
        					Wind: {weather.windSpeed < 1 ? "Calm" : `${weather.windDir} ${weather.windSpeed}`}
    					</div>
				</div>

				<div id="conditions_right" className="newfont">
					<div className="newfontyellow"> {error || locationName} </div>
						<div className="indented">
        						<div>Humidity: {weather.humidity}%</div>
        						<div>Dewpoint: {weather.dewpoint}°</div>
        						<div>Ceiling: {weather.sky.includes("Clear") || weather.ceiling > 25000 ? "Unlimited" : 
        						`${weather.ceiling.toLocaleString()} ft.`}</div>
        						<div>Visibility: {weather.visibility >= 10 ? "UNLIMITED" : `${weather.visibility}mi.`}</div>
                                                        <div>Pressure: {weather.pressure}</div>
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
