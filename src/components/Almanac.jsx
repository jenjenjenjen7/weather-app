import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "./LocationContext";
import * as SunCalc from "suncalc";

const today = new Date();

function getDays(currentDate = new Date()) {
  
  const tomorrow = new Date();
  tomorrow.setDate(currentDate.getDate() + 1);
  
  return [
     {name: currentDate.toLocaleDateString('en-US', { weekday: 'long' }), date: currentDate},
     {name: tomorrow.toLocaleDateString('en-US', { weekday: 'long' }), date: tomorrow },
  ]
}

export function useSunTimes() {
  const { lat, lon } = useLocation();
  
  //if no lat or no lon, return nothing
  if (!lat || !lon) return [];
  
  const days = getDays();
  
  return days.map(day => {
  	const times = SunCalc.getTimes(day.date, lat, lon);
  	
	return {
		dayName: day.name,
        	sunrise: times.sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        	sunset: times.sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
	};
  });
}
function getNextFourPhases(currentDate) {
  const phases = [
  //array to store moon data. target is the phase
    { name: "New", target: 0, className: "phase-new" },
    { name: "First", target: 0.25, className: "phase-first" },
    { name: "Full", target: 0.5, className: "phase-full" },
    { name: "Last", target: 0.75, className: "phase-last" }
  ];
  // Find the upcoming date for each phase
  const calculated = phases.map((phase) => {
    let bestDate = new Date(currentDate);
    let smallestDiff = 1;

    for (let i = 0; i < 30; i++) {
      const testDate = new Date(currentDate);
      testDate.setDate(currentDate.getDate() + i);

      const illumination = SunCalc.getMoonIllumination(testDate);
      const diff = Math.abs(illumination.phase - phase.target);

      if (diff < smallestDiff) {
        smallestDiff = diff;
        bestDate = testDate;
      }
    }

    return {
      name: phase.name,
      className: phase.className,
      rawDate: bestDate,
      formattedDate: bestDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    };
  });

  // Sort them chronologically from earliest to latest
  calculated.sort((a, b) => a.rawDate - b.rawDate);

  return calculated;
}
export default function Almanac() {
  const [moonData, setMoonData] = useState([]);
  const [error, setError] = useState(null);
  
  const sunTimes = useSunTimes();

   useEffect(() => {
    try {
      // get the next last, new, first, and full phases
      const calculatedPhases = getNextFourPhases(new Date());
      setMoonData(calculatedPhases);
    } 
    catch (err) {
      console.error("Moon Calculation Error:", err);
      setError("Could not calculate moon phases.");
    }
   }, []);

if (error) return <div className="newfont">{error}</div>;

  return (
    <main>
    <div className="segment-name weather-dashboard loading-state">
  	<div className="newfontyellow">
    		{sunTimes.map((item, index) => (
      		<span key={index} className="newfontyellow">{item.dayName} </span>
                ))}
         </div>
  	<div className="rise-row">
    		<span className="newfont">Sunrise:</span>
    		{sunTimes.map((item, index) => (
      		<span key={index} className="newfont">{item.sunrise} </span>
    		))}
        </div>
  	<div className="set-row">
   		<span className="newfont">Sunset:</span>
    		{sunTimes.map((item, index) => (
      		<span key={index} className="newfont">{item.sunset} </span>
    		))}
  	</div>    
    Moon Data:
        <div className="moon-data newfont">
          {moonData.map((item, index) => (
              <div key={index} className={`phases ${item.className}`}>
              	<div className="phase-name">{item.name}</div>
              	<span className="phase-date">{item.formattedDate}</span>
              </div>
          ))}
        </div>
    </div>
    </main>
  );
}
