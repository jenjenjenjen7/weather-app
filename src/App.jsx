import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from "./components/Header";
import WeatherDashboard from './components/WeatherDashboard.jsx';
import CurrentConditions from './components/CurrentConditions.jsx';
import Footer from "./components/Footer";

export default function App() {
  return (
    <BrowserRouter>
    	<main className="wrapper">
      		<Header />
			<Routes>
          			<Route path="/" element={<WeatherDashboard />} />
          			<Route path="/current" element={<CurrentConditions />} />
        		</Routes>
      		<Footer />
    	</main>
    </BrowserRouter>
  )
}
