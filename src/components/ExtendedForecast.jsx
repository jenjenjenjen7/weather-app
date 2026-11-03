import React from "react";
import { useWeather } from "./WeatherContext";

export default function ExtendedForecast() {
    const { extendedForecast, loading } = useWeather();

    if (loading || !extendedForecast.length) {
        return (
            <main>
                <div className="forecast-column">
                    <span className="condition-label newfont">LOADING...</span>
                </div>
            </main>
        );
    }
	return (
		<main>
			{extendedForecast.map((item, index) => (
			<div className="forecast-column forecast-format" key={index}>
				<span className="day-title segment-name">{item.day}</span>
				<div className="weather-icon">
                        		<img 
                            	 	src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
                        		/>
                    		</div>
				<span className="condition-label newfont">{item.condition}</span>
				<div className="temp-container">
    					<div className="temp-column">
        					<span className="blufont label">Lo</span>
        					<span className="newfont value">{item.lo}</span>
    					</div>
    					<div className="temp-column">
        					<span className="segment-name label">Hi</span>
        					<span className="newfont value">{item.hi}</span>
    					</div>
				</div>
			</div>
		))}
		</main>
	);
}
