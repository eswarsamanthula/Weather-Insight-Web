import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function fetchWeatherData(city, units = 'metric') {
  try {
    const [response, forecastResponse] = await Promise.all([
      axios.get(`${BASE_URL}/weather`, { params: { q: city, units, appid: API_KEY } }),
      axios.get(`${BASE_URL}/forecast`, { params: { q: city, units, appid: API_KEY } }),
    ]);
    return processWeatherData(response.data, forecastResponse.data);
  } catch (error) {
    throw new Error('Failed to fetch weather data');
  }
}

export async function fetchWeatherByCoords(lat, lon, units = 'metric') {
  try {
    const [response, forecastResponse] = await Promise.all([
      axios.get(`${BASE_URL}/weather`, { params: { lat, lon, units, appid: API_KEY } }),
      axios.get(`${BASE_URL}/forecast`, { params: { lat, lon, units, appid: API_KEY } }),
    ]);
    return processWeatherData(response.data, forecastResponse.data);
  } catch (error) {
    throw new Error('Failed to fetch weather data');
  }
}

function processWeatherData(currentData, forecastData) {
  const sunrise = new Date(currentData.sys.sunrise * 1000);
  const sunset = new Date(currentData.sys.sunset * 1000);
  const fmt = d => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const weatherData = {
    city: currentData.name,
    country: currentData.sys.country,
    date: currentData.dt,
    temperature: currentData.main.temp,
    feelsLike: currentData.main.feels_like,
    humidity: currentData.main.humidity,
    pressure: currentData.main.pressure,
    windSpeed: currentData.wind.speed,
    windDeg: currentData.wind.deg ?? 0,
    visibility: currentData.visibility,
    description: currentData.weather[0].description,
    icon: currentData.weather[0].icon,
    sunrise: fmt(sunrise),
    sunset: fmt(sunset),
  };

  const dailyForecasts = {};
  forecastData.list.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = {
        date: item.dt,
        temperature: item.main.temp,
        icon: item.weather[0].icon,
        description: item.weather[0].description,
      };
    }
  });

  weatherData.forecast = Object.values(dailyForecasts).slice(0, 5);
  return weatherData;
}