import { useState, useEffect } from 'react';
import styled from 'styled-components';
import WeatherCard from './components/WeatherCard';
import SearchBox from './components/SearchBox';
import WeatherBackground from './components/WeatherBackground';
import { fetchWeatherData, fetchWeatherByCoords } from './services/weatherService';
import './App.css';

const AppContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
  position: relative;
  overflow: hidden;
`;

const AppContent = styled.div`
  position: relative;
  z-index: 10;
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  color: var(--primary-color);
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Subtitle = styled.p`
  color: var(--text-color-light);
  font-size: 1.1rem;
  margin: 0.5rem 0 1.5rem;
`;

const ThemeToggle = styled.button`
  background: transparent;
  border: none;
  color: var(--text-color);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
  position: absolute;
  top: 1rem;
  right: 1rem;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
    transform: rotate(15deg);
  }
`;

const LoadingSpinner = styled.div`
  margin: 2rem auto;
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMessage = styled.div`
  margin: 2rem auto;
  padding: 1rem;
  background-color: var(--error-background);
  border: 1px solid var(--error-border);
  border-radius: 10px;
  color: var(--error-text);
  text-align: center;
  max-width: 400px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const Footer = styled.footer`
  text-align: center;
  padding: 2rem;
  color: var(--text-color-light);
  font-size: 0.9rem;
  margin-top: 2rem;

  a {
    color: var(--primary-color);
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: var(--primary-light);
    }
  }
`;

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [units, setUnits] = useState('metric');

  useEffect(() => {
    // Load theme preference
    const savedTheme = localStorage.getItem('weatherAppTheme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.body.classList.add('dark-theme');
    }
  }, []);

  const handleSearch = async (searchInput) => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      if (typeof searchInput === 'object' && searchInput.lat && searchInput.lon) {
        // Handle coordinates
        data = await fetchWeatherByCoords(searchInput.lat, searchInput.lon, units);
      } else if (searchInput === 'current') {
        // Handle error case
        throw new Error('Location access denied or not supported');
      } else {
        // Handle city name
        data = await fetchWeatherData(searchInput, units);
      }
      
      setWeatherData(data);
    } catch (error) {
      setError(error.message === 'Location access denied or not supported' 
        ? 'Unable to get your location. Please allow location access or search for a city manually.'
        : 'City not found. Please try another location.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('weatherAppTheme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('weatherAppTheme', 'light');
    }
  };

  const toggleUnits = (newUnits) => {
    setUnits(newUnits);
    if (weatherData) {
      handleSearch(weatherData.city);
    }
  };

  return (
    <AppContainer>
      <WeatherBackground weatherData={weatherData} />
      <AppContent>
        <Header>
          <Title>Weather Insight</Title>
          <Subtitle>Your Daily Forecast at a Glance</Subtitle>
          <ThemeToggle onClick={toggleTheme}>
            <i className={`fas fa-${darkMode ? 'sun' : 'moon'}`}></i>
          </ThemeToggle>
        </Header>
        <SearchBox onSearch={handleSearch} />
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {weatherData && (
          <WeatherCard
            data={weatherData}
            units={units}
            onUnitsChange={toggleUnits}
          />
        )}
      </AppContent>
      <Footer>
        <p>Weather data powered by <a href="https://openweathermap.org" target="_blank" rel="noopener noreferrer">OpenWeather</a></p>
      </Footer>
    </AppContainer>
  );
}

export default App;
