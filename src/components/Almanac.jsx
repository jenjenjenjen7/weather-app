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
  	<section className="sun-section top-margin">
  	<table className="sun-table">
        <thead>
          	<tr>
            	<th></th>
            	{sunTimes.map((item, i) => (
              	<th key={i} className="segment-name sun-fontyellow">{item.dayName}</th>
        	))}
          	</tr>
        </thead>
        <tbody>
          	<tr>
            		<td className="newfont sun-font">Sunrise:</td>
           		{sunTimes.map((item, i) => (
              		<td className="newfont sun-font" key={i}> {item.sunrise} </td>
            		))}
          	</tr>
          	<tr>
            		<td className="newfont sun-font">Sunset:</td>
            		{sunTimes.map((item, i) => (
              		<td className="newfont sun-font" key={i}> {item.sunset} </td>
           		))}
          	</tr>
        </tbody>
      	</table>
        </section>
	<section className="moon-section top-margin">
			<div className="segment-name left-margin">Moon Data:</div>
  			<div className="moon-data newfont">
    				{moonData.map((item, index) => (
      					<div key={index} className="moon-item">
        					<div className="phase-name">{item.name}</div>
        					<div className={`phases ${item.className}`}></div>
        					<div className="phase-date">{item.formattedDate}</div>
      					</div>
    				))}
  			</div>
        	</section>
    </main>
  );
}
