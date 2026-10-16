import React from 'react';
import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const [dateStr, setDateStr] = useState("");
  const [timeStr, setTimeStr] = useState("");
  
  const getHeaderTitle = (pathname) => {
    switch (pathname) {
      case '/current':
        return 'Current Conditions';
      case `/almanac`:
      	return `Almanac`;
      default:
        return 'Focal Lorecast'; // Default title for the main dashboard
    }
  }  
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const formattedDate = new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "2-digit",
      })
        .format(now)
        .toUpperCase()
        .replace(/,/g, "");
 
 const formattedTime = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(now);

      setDateStr(formattedDate);
      setTimeStr(formattedTime);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);

    return () => clearInterval(timer);
  }, []);
        
 
  return (
      <header className="header">
        <div className="header-banner"></div>
        <div className="segment segment-name">
        	{getHeaderTitle(location.pathname)}
        </div>
        <div className="clock">
          <div id="clockone" className="block">{timeStr}</div>
          <div id="calendar" className="block">{dateStr}</div>
        </div>
      </header>
  );
}
