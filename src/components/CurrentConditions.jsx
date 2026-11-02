import React from "react";
import { useWeather } from "./WeatherContext";

export default function CurrentConditions() {
  const { weather, locationName, error, loading } = useWeather();

  if (loading) {
    return (
      <main className="main">
        <div className="newfont loading-state">
          <p>FETCHING CONDITIONS...</p>
        </div>
      </main>
    );
  }

  return (
	<main className="main">
      		{weather ? (
        	<div className="weather-grid">
          		<div id="conditions_left">
            				<div className="temp">{weather.temp}°</div>
            				<div className="conditions">{weather.sky}</div>
            				<div className="weather-icon-container">
              				{weather.icon && (
                			<img id="weather-icon"
                  			src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
                  			alt={weather.sky || "Weather Icon"} />
              				)}
            				</div>
            			<div className="wind">
              			Wind: {weather.windSpeed < 1 ? "Calm" : `${weather.windDir} ${weather.windSpeed}`}
            			</div>
            			{weather.windGust && (
              			<div className="wind">Gusts to {weather.windGust}</div>
            			)}
         		</div>

          		<div id="conditions_right" className="newfont">
            			<div className="location"> {error || locationName} </div>
            				<div className="indented">
              					<div>Humidity: {weather.humidity}%</div>
             			 	<div>Dewpoint: {weather.dewpoint}°</div>
              				<div>Ceiling: {weather.sky.includes("Clear") || weather.ceiling > 25000 ? "Unlimited" : `${weather.ceiling.toLocaleString()} ft.`}</div>
              				<div>Visibility: {weather.visibility >= 10 ? "UNLIMITED" : `${weather.visibility}mi.`}</div>
              				<div>Pressure: {weather.pressure}</div>
              				{weather.apparent && (
                			<div>{weather.apparent.label}: {weather.apparent.value}°</div>
              				)}
            				</div>    
          			</div>
        		</div>) : (
        
        <div className="newfont loading-state">
          <p>{error || "No Report Available"}</p>
        </div>
      )}
    </main>
  );
}
