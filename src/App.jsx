import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from "./components/Header";
import WeatherDashboard from './components/WeatherDashboard.jsx';
import CurrentConditions from './components/CurrentConditions.jsx';
import Almanac from './components/Almanac.jsx';
import ExtendedForecast from './components/ExtendedForecast.jsx';
import Footer from "./components/Footer";
import { LocationProvider } from './components/LocationContext';
import { WeatherProvider } from './components/WeatherContext';

function MainLayout() {
  const location = useLocation();
  // check current URL, load correct layout
  const isAlmanac = location.pathname === '/almanac';
  const isExtendedForecast = location.pathname === '/extendedforecast';

  return (
	<main 
      		className={`wrapper ${
        		isAlmanac 
          		? 'almanac-theme' 
          		: isExtendedForecast 
          		? 'extendedforecast-theme' 
          		: ''
      			}`}
    	>
      <Header />
      
      <Routes>
        <Route path="/" element={<WeatherDashboard />} />
        <Route path="/current" element={<CurrentConditions />} />
        <Route path="/almanac" element={<Almanac />} />
        <Route path="/extendedforecast" element={<ExtendedForecast />} />
      </Routes>
      
      <Footer />
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
    	<LocationProvider>
    		<WeatherProvider>
        		<MainLayout />
		</WeatherProvider>
	</LocationProvider>
    </BrowserRouter>
  )
}
