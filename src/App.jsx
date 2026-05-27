import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import WeatherCard from './components/WeatherCard';
import SearchBox from './components/SearchBox';
import WeatherBackground from './components/WeatherBackground';
import { fetchWeatherData, fetchWeatherByCoords } from './services/weatherService';
import './App.css';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  padding: 1.25rem;
  position: relative;
  overflow: hidden;

  @media (min-width: 480px) {
    padding: 2rem;
  }
`;

const AppContent = styled.div`
  position: relative;
  z-index: 10;
  max-width: 740px;
  margin: 0 auto;
  width: 100%;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
  animation: ${fadeUp} 0.5s var(--ease) both;
`;

/* Giant ghost city name — floats behind the card */
const GhostCity = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(3rem, 18vw, 16rem);
  letter-spacing: 0.08em;
  color: rgba(56, 189, 248, 0.03);
  white-space: nowrap;
  pointer-events: none;
  z-index: 1;
  user-select: none;
  transition: opacity 1.5s ease;
`;

const Title = styled.h1`
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(2.2rem, 8vw, 3.5rem);
  letter-spacing: 0.12em;
  background: linear-gradient(135deg, #e2e8f0 40%, var(--primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
`;

const Subtitle = styled.p`
  font-size: 0.75rem;
  color: var(--text-muted);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-top: 6px;
  font-weight: 400;
`;

const Spinner = styled.div`
  margin: 3rem auto;
  width: 36px;
  height: 36px;
  border: 3px solid rgba(56, 189, 248, 0.15);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
`;

const ErrorMsg = styled.div`
  margin: 2rem auto;
  padding: 1rem 1.25rem;
  background: rgba(248, 113, 113, 0.08);
  border: 1px solid rgba(248, 113, 113, 0.2);
  border-radius: 14px;
  color: var(--error);
  text-align: center;
  font-size: 0.88rem;
  max-width: 420px;
`;

const Footer = styled.footer`
  text-align: center;
  padding: 1.5rem;
  margin-top: 1.5rem;
  color: var(--text-muted);
  font-size: 0.78rem;

  a {
    color: var(--primary);
    text-decoration: none;
    opacity: 0.8;
    &:hover { opacity: 1; }
  }
`;

export default function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [units, setUnits] = useState('metric');

  const handleSearch = async (input) => {
    try {
      setLoading(true);
      setError(null);

      let data;
      if (typeof input === 'object' && input.lat) {
        data = await fetchWeatherByCoords(input.lat, input.lon, units);
      } else if (input === 'current') {
        throw new Error('Location access denied');
      } else {
        data = await fetchWeatherData(input, units);
      }

      setWeatherData(data);
    } catch (e) {
      setError(
        e.message === 'Location access denied'
          ? 'Allow location access or search a city manually.'
          : 'City not found. Try another location.'
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleUnits = (u) => {
    setUnits(u);
    if (weatherData) handleSearch(weatherData.city);
  };

  return (
    <AppContainer>
      <WeatherBackground weatherData={weatherData} />

      {/* Ghost city name behind everything */}
      {weatherData && <GhostCity>{weatherData.city}</GhostCity>}

      <AppContent>
        <Header>
          <Title>Weather Insight</Title>
          <Subtitle>Real-time global forecast</Subtitle>
        </Header>

        <SearchBox onSearch={handleSearch} />

        {loading && <Spinner />}
        {error && <ErrorMsg>{error}</ErrorMsg>}

        {weatherData && (
          <WeatherCard
            data={weatherData}
            units={units}
            onUnitsChange={toggleUnits}
          />
        )}
      </AppContent>

      <Footer>
        <p>
          Data by{' '}
          <a href="https://openweathermap.org" target="_blank" rel="noopener noreferrer">
            OpenWeather
          </a>
          {' · '}
          Crafted by{' '}
          <a href="https://github.com/eswarsamanthula/Weather-Insight-Web" target="_blank" rel="noopener noreferrer">
            Eswar
          </a>
        </p>
      </Footer>
    </AppContainer>
  );
}