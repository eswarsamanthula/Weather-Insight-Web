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
  @media (min-width: 480px) { padding: 2rem; }
`;

const AppContent = styled.div`
  position: relative;
  z-index: 10;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
  animation: ${fadeUp} 0.5s var(--ease) both;
`;

const GhostCity = styled.div`
  position: fixed;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(3rem, 18vw, 16rem);
  letter-spacing: 0.08em;
  color: rgba(56, 189, 248, 0.04);
  white-space: nowrap;
  pointer-events: none;
  z-index: 1;
  user-select: none;
  transition: opacity 1.5s ease;
`;

const Title = styled.h1`
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(2.4rem, 8vw, 3.8rem);
  letter-spacing: 0.14em;
  background: linear-gradient(135deg, #e2e8f0 30%, var(--primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
`;

const Subtitle = styled.p`
  font-size: 0.72rem;
  color: var(--text-muted);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin-top: 7px;
  font-weight: 400;
`;

/* Skeleton loader */
const SkeletonCard = styled.div`
  background: rgba(10,16,30,0.72);
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.07);
  padding: 2rem;
  animation: skeleton-pulse 1.4s ease-in-out infinite;
`;
const SkeletonLine = styled.div`
  height: ${p => p.$h || '14px'};
  width: ${p => p.$w || '100%'};
  background: rgba(56,189,248,0.08);
  border-radius: 6px;
  margin-bottom: ${p => p.$mb || '12px'};
`;

/* Welcome state */
const WelcomeWrap = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;
  animation: ${fadeUp} 0.6s var(--ease) both;
  animation-delay: 0.3s;
  opacity: 0;
  animation-fill-mode: forwards;
`;
const WelcomeIcon = styled.div`
  font-size: 3.5rem;
  color: var(--primary);
  opacity: 0.5;
  margin-bottom: 1.25rem;
  filter: drop-shadow(0 0 24px var(--primary-glow));
  animation: float 5s ease-in-out infinite;
`;
const WelcomeTitle = styled.p`
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(1.4rem, 5vw, 2rem);
  letter-spacing: 0.1em;
  color: var(--text);
  margin-bottom: 0.5rem;
`;
const WelcomeSub = styled.p`
  font-size: 0.82rem;
  color: var(--text-muted);
  letter-spacing: 0.04em;
  max-width: 280px;
  margin: 0 auto;
  line-height: 1.6;
`;
const QuickSuggestions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-top: 1.5rem;
`;
const SuggestChip = styled.button`
  background: rgba(56,189,248,0.07);
  border: 1px solid rgba(56,189,248,0.15);
  border-radius: 20px;
  padding: 6px 14px;
  color: var(--text-muted);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: rgba(56,189,248,0.14);
    border-color: rgba(56,189,248,0.35);
    color: var(--primary);
    transform: translateY(-1px);
  }
`;

const Spinner = styled.div`
  margin: 3rem auto;
  width: 36px; height: 36px;
  border: 3px solid rgba(56,189,248,0.12);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
`;

const ErrorMsg = styled.div`
  margin: 2rem auto;
  padding: 1.1rem 1.5rem;
  background: rgba(248,113,113,0.07);
  border: 1px solid rgba(248,113,113,0.18);
  border-radius: 14px;
  color: var(--error);
  text-align: center;
  font-size: 0.88rem;
  max-width: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  animation: ${fadeUp} 0.3s ease both;
  i { font-size: 1rem; opacity: 0.8; }
`;

const Footer = styled.footer`
  text-align: center;
  padding: 1.5rem;
  margin-top: 1.5rem;
  color: var(--text-muted);
  font-size: 0.78rem;
  letter-spacing: 0.03em;
  a {
    color: var(--primary);
    text-decoration: none;
    opacity: 0.75;
    transition: opacity 0.2s;
    &:hover { opacity: 1; }
  }
`;

const CITIES = ['New York', 'Tokyo', 'London', 'Mumbai', 'Sydney', 'Paris'];

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
          : 'City not found. Please try another location.'
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
      {weatherData && <GhostCity>{weatherData.city}</GhostCity>}

      <AppContent>
        <Header>
          <Title>Weather Insight</Title>
          <Subtitle>Real-time global forecast</Subtitle>
        </Header>

        <SearchBox onSearch={handleSearch} />

        {loading && (
          <SkeletonCard>
            <SkeletonLine $h="40px" $w="55%" $mb="8px" />
            <SkeletonLine $h="14px" $w="30%" $mb="24px" />
            <SkeletonLine $h="80px" $w="40%" $mb="20px" />
            <SkeletonLine $h="12px" $w="100%" $mb="8px" />
            <SkeletonLine $h="12px" $w="80%" $mb="24px" />
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px' }}>
              {[...Array(4)].map((_,i) => <SkeletonLine key={i} $h="64px" $mb="0" />)}
            </div>
          </SkeletonCard>
        )}

        {error && !loading && (
          <ErrorMsg>
            <i className="fas fa-circle-exclamation" />
            {error}
          </ErrorMsg>
        )}

        {!loading && !error && !weatherData && (
          <WelcomeWrap>
            <WelcomeIcon><i className="fas fa-cloud-sun" /></WelcomeIcon>
            <WelcomeTitle>Check the Weather</WelcomeTitle>
            <WelcomeSub>Search any city worldwide to get real-time forecasts, hourly trends and 5-day outlooks.</WelcomeSub>
            <QuickSuggestions>
              {CITIES.map(city => (
                <SuggestChip key={city} onClick={() => handleSearch(city)}>
                  {city}
                </SuggestChip>
              ))}
            </QuickSuggestions>
          </WelcomeWrap>
        )}

        {weatherData && !loading && (
          <WeatherCard data={weatherData} units={units} onUnitsChange={toggleUnits} />
        )}
      </AppContent>

      <Footer>
        <p>
          Data by{' '}
          <a href="https://openweathermap.org" target="_blank" rel="noopener noreferrer">OpenWeather</a>
          {' · '}
          Crafted by{' '}
          <a href="https://github.com/eswarsamanthula/Weather-Insight-Web" target="_blank" rel="noopener noreferrer">Eswar</a>
        </p>
      </Footer>
    </AppContainer>
  );
}