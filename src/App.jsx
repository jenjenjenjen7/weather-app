import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from "./components/Header";
import WeatherDashboard from './components/WeatherDashboard.jsx';
import CurrentConditions from './components/CurrentConditions.jsx';
import Almanac from './components/Almanac.jsx';
import Footer from "./components/Footer";
import { LocationProvider } from './components/LocationContext';


function MainLayout() {
  const location = useLocation();
  // Check if current URL route is /almanac
  const isAlmanac = location.pathname === '/almanac';

  return (
    <main className={`wrapper ${isAlmanac ? 'almanac-theme' : ''}`}>
      <Header />
      
      <Routes>
        <Route path="/" element={<WeatherDashboard />} />
        <Route path="/current" element={<CurrentConditions />} />
        <Route path="/almanac" element={<Almanac />} />
      </Routes>
      
      <Footer />
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
    	<LocationProvider>
        	<MainLayout />
	</LocationProvider>
    </BrowserRouter>
  )
}
