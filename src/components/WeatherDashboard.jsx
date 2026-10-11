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
            sky: weatherData.weather[0].description,
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
				<div className="cond" id="conditions_right">
					<p className="temp">{weather.temp}°</p>
					<p className="sky">{weather.sky}</p>
					<p className="wind">
                                            WIND: {weather.windSpeed === 0 ? "CALM" : `${weather.windDir} ${weather.windSpeed}`}
                                        </p>

				</div>

				<div className="cond" id="conditions_left" >
					<p className="newfontyellow" id="location"> {error || locationName} </p>
					<p className="newfont">Humidity: {weather.humidity}%</p>
					<p className="newfont">Dewpoint: {weather.dewpoint}°</p>
					<p className="newfont">
    						Ceiling: {weather.sky.includes("clear") || weather.ceiling > 25000 ? "CLEAR" : 
    						`${weather.ceiling.toLocaleString()} ft.`}
  					</p>
					<p className="newfont"> 
						Visibility: {weather.visibility >= 10 ? "UNLIMITED" : `${weather.visibility}mi.`}
					</p>
					<p className="newfont">Pressure: {weather.pressure}</p>
					
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
