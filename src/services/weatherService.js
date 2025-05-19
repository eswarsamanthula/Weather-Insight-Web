import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function fetchWeatherData(city, units = 'metric') {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        units,
        appid: API_KEY,
      },
    });

    const forecastResponse = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        units,
        appid: API_KEY,
      },
    });

    return processWeatherData(response.data, forecastResponse.data);
  } catch (error) {
    throw new Error('Failed to fetch weather data');
  }
}

export async function fetchWeatherByCoords(lat, lon, units = 'metric') {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        units,
        appid: API_KEY,
      },
    });

    const forecastResponse = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        units,
        appid: API_KEY,
      },
    });

    return processWeatherData(response.data, forecastResponse.data);
  } catch (error) {
    throw new Error('Failed to fetch weather data');
  }
}

function processWeatherData(currentData, forecastData) {
  // Process current weather data
  const weatherData = {
    city: currentData.name,
    country: currentData.sys.country,
    date: currentData.dt,
    temperature: currentData.main.temp,
    feelsLike: currentData.main.feels_like,
    humidity: currentData.main.humidity,
    pressure: currentData.main.pressure,
    windSpeed: currentData.wind.speed,
    description: currentData.weather[0].description,
    icon: currentData.weather[0].icon,
    sunrise: currentData.sys.sunrise,
    sunset: currentData.sys.sunset,
  };

  // Process forecast data
  const dailyForecasts = {};
  forecastData.list.forEach((item) => {
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