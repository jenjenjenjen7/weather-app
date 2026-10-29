import React, { useState, useEffect } from "react";
import { createContext, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from "./LocationContext";

export default function WeatherDashboard() {
	const { lat, lon, loading, error } = useLocation();
	if (loading) return <div className="newfont">Finding your location...</div>;
 	if (error) return <div className="newfont">Error: {error}</div>;
  
  	return (
    	<main className="main">
		<div className="newfont weather-dashboard loading-state">
		WeatherSTAR 4k Dashboard
      			<nav>
        		<Link to="/current" >Current Conditions</Link><br />
        		<Link to="/almanac" >Almanac</Link>
      			</nav>
    		</div>
    </main>
  );
}
