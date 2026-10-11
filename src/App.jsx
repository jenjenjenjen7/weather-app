import Header from "./components/Header";
import WeatherDashboard from './components/WeatherDashboard.jsx';
import Footer from "./components/Footer";

export default function App() {
  return (
    <main className="wrapper">
      <Header />
      <WeatherDashboard />
      <Footer />
    </main>
  )
}
