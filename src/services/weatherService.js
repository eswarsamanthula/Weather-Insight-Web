import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function fetchWeatherData(city, units = 'metric') {
  try {
    const [response, forecastResponse] = await Promise.all([
      axios.get(`${BASE_URL}/weather`, { params: { q: city, units, appid: API_KEY } }),
      axios.get(`${BASE_URL}/forecast`, { params: { q: city, units, appid: API_KEY } }),
    ]);
    const coords = response.data.coord;
    const airData = await fetchAirQuality(coords.lat, coords.lon);
    return processWeatherData(response.data, forecastResponse.data, airData);
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
    const airData = await fetchAirQuality(lat, lon);
    return processWeatherData(response.data, forecastResponse.data, airData);
  } catch (error) {
    throw new Error('Failed to fetch weather data');
  }
}

async function fetchAirQuality(lat, lon) {
  try {
    const res = await axios.get(`${BASE_URL}/air_pollution`, {
      params: { lat, lon, appid: API_KEY },
    });
    const comp = res.data.list[0].components;
    const aqi  = res.data.list[0].main.aqi;
    return { aqi, pm25: comp.pm2_5, pm10: comp.pm10, no2: comp.no2, o3: comp.o3 };
  } catch {
    return null;
  }
}

function processWeatherData(currentData, forecastData, airData) {
  const sunrise = new Date(currentData.sys.sunrise * 1000);
  const sunset  = new Date(currentData.sys.sunset  * 1000);
  const fmt = d => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // UV index approx from clouds + time (free tier has no UV endpoint)
  const clouds = currentData.clouds?.all ?? 0;
  const hour   = new Date().getHours();
  const uvApprox = Math.max(0, Math.round((1 - clouds / 100) * (hour >= 10 && hour <= 16 ? 8 : 3)));

  const weatherData = {
    city:        currentData.name,
    country:     currentData.sys.country,
    date:        currentData.dt,
    temperature: currentData.main.temp,
    feelsLike:   currentData.main.feels_like,
    humidity:    currentData.main.humidity,
    pressure:    currentData.main.pressure,
    windSpeed:   currentData.wind.speed,
    windDeg:     currentData.wind.deg ?? 0,
    visibility:  currentData.visibility,
    description: currentData.weather[0].description,
    icon:        currentData.weather[0].icon,
    sunrise:     fmt(sunrise),
    sunset:      fmt(sunset),
    uvIndex:     uvApprox,
    airQuality:  airData,
    lat:         currentData.coord.lat,
    lon:         currentData.coord.lon,
  };

  const dailyForecasts = {};
  forecastData.list.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = {
        date:        item.dt,
        temperature: item.main.temp,
        icon:        item.weather[0].icon,
        description: item.weather[0].description,
      };
    }
  });

  weatherData.forecast = Object.values(dailyForecasts).slice(0, 5);
  return weatherData;
}