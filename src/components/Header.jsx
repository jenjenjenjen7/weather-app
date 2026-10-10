import React from 'react';
import { useState, useEffect } from "react";

export default function Header() {
  const [dateStr, setDateStr] = useState("");
  const [timeStr, setTimeStr] = useState("");
  
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
        <div className="segment newfontyellow">Local Forecast</div>
        <div className="clock">
          <div id="clockone" className="block">{timeStr}</div>
          <div id="calendar" className="block">{dateStr}</div>
        </div>
      </header>
  );
}
