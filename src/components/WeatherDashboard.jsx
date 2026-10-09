import React from 'react';

export default function WeatherDashboard() {
  return (
    <div className="wrapper">
      <header className="header">
        <div className="header-banner"></div>
        <div className="segment newfontyellow">
          Current<br />Conditions
        </div>
        <div className="clock">
          <div id="clockone" className="block"></div>
          <div id="calendar" className="block"></div>
        </div>
      </header>

      <main className="main">
        <div className="cond" id="conditions_right"></div>
        <div className="div5">
          <div id="location" className="newfontyellow"></div>
          <div id="conditions_left" className="newfont">No Report Available</div>
        </div>
      </main>

      <footer className="footer">Scrolly text...</footer>
    </div>
  );
}
