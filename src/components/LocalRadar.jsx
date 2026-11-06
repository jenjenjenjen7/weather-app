import React, { useState, useEffect } from "react";
import { createContext, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from "./LocationContext";

export default function LocalRadar() {
  return (
    <header className="radar-header">
        <div className="radar-header-banner"></div>
    </header>
  );
}
