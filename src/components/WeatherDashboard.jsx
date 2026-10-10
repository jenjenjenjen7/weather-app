import React, { useState, useEffect } from "react";

function getCardinalDirection(angle) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return directions[Math.round(angle / 45) % 8];
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

          if (geoData[0]?.name) setLocationName(geoData[0].name);

          setWeather({
            temp: Math.round(weatherData.main.temp),
            sky: weatherData.weather[0].description,
            windSpeed: weatherData.wind.speed,
            windDir: getCardinalDirection(weatherData.wind.deg),
            humidity: weatherData.main.humidity,
            pressure: weatherData.main.pressure,
            visibility: (weatherData.visibility / 1609.34).toFixed(1),
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
					<p className="wind">Wind: {weather.windDir} {weather.windSpeed} </p>
				</div>

				<div className="cond" id="conditions_left" >
					<p className="newfontyellow" id="location"> {error || locationName} </p>
					<p className="newfont">Humidity: {weather.humidity}%</p>
					<p className="newfont">Pressure: {weather.pressure} Hg</p>
					<p className="newfont">Visibility: {weather.visibility} mi</p>
				</div>
			</div>
        </>
      ) : (
        <div className="newfont">
          <p>{error || "No Report Available"}</p>
        </div>
      )}
    </main>
  );
}
