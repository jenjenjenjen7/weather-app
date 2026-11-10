import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from "./components/Header";
import WeatherDashboard from './components/WeatherDashboard.jsx';
import CurrentConditions from './components/CurrentConditions.jsx';
import LatestObservations from './components/LatestObservations.jsx';
import RegionalObservations from './components/RegionalObservations.jsx';
import Almanac from './components/Almanac.jsx';
import ExtendedForecast from './components/ExtendedForecast.jsx';
import TravelCitiesForecast from './components/TravelCitiesForecast.jsx';
import LocalRadar from './components/LocalRadar.jsx';
import Footer from "./components/Footer";
import { LocationProvider } from './components/LocationContext';
import { WeatherProvider } from './components/WeatherContext';

function MainLayout() {
  const location = useLocation();
  // check current URL, load correct layout
  const isAlmanac = location.pathname === '/almanac';
  const isExtendedForecast = location.pathname === '/extendedforecast';
  const isRadar = location.pathname === '/radar';

  return (
	<main 
		className={`wrapper ${
        		isAlmanac 
          		? 'almanac-theme' 
          		: isExtendedForecast 
          		? 'extendedforecast-theme' 
          		: isRadar 
          		? 'radar-theme'
          		: ''
      			}`}
    	>
    	{/*hide the header on the radar page*/}
      {!isRadar && <Header />}
      
      <Routes>
        <Route path="/" element={<WeatherDashboard />} />
        <Route path="/current" element={<CurrentConditions />} />
        <Route path="/latestobservations" element={<LatestObservations />} />
        <Route path="/regionalobservations" element={<RegionalObservations />} />
        <Route path="/travel" element={<TravelCitiesForecast />} />
        <Route path="/almanac" element={<Almanac />} />
        <Route path="/extendedforecast" element={<ExtendedForecast />} />
        <Route path="/radar" element={<LocalRadar/>}/>
      </Routes>
      
      {!isRadar && <Footer />}
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
