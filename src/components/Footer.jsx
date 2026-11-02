import React from 'react';
import { useWeather } from './WeatherContext';

export default function Footer() {
  const { weather, locationName } = useWeather();
  
  const currentMonth = new Date().toLocaleString('en-US', { month: 'long' }).toUpperCase();
  
  return (
	<footer className="footer">
 
        </footer>		
  );
}
