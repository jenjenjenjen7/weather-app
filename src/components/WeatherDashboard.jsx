import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

export default function WeatherDashboard() 
{
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
