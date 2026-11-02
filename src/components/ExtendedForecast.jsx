import React, { useState, useEffect } from "react";
import { createContext, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from "./LocationContext";

const forecastData = [
  { day: 'MON', icon: '', condition: 'Clear', hi: '900', lo: '52' },
  { day: 'TUE', icon: '', condition: 'Partly Cloudy', hi: '70', lo: '-140' },
  { day: 'WED', icon: '', condition: 'Showers', hi: '62', lo: '45' },
];

export default function ExtendedForecast() {
	return (
		<main>
			{forecastData.map((item, index) => (
			<div className="forecast-column" key={index}>
				<span className="day-title segment-name">{item.day}</span>
				<div className="weather-icon">{item.icon}</div>
				<span className="condition-label newfont">{item.condition}</span>
					<div className="temp-box">
						<span className="blufont label">Lo </span> 
						<span className="newfont value">{item.lo} </span>
					</div>
					<div className="temp-box">
						<span className = "segment-name label">Hi </span>
						<span className= "newfont value">{item.hi} </span>
					</div>
			</div>
		))}
		</main>
	);
}
