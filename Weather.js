// Enhanced Weather App JavaScript Code
// API key
const apiKey = '7cbc0d03e8f85d158d4b7aaa75faae0d';
const aqiKey = '7cbc0d03e8f85d158d4b7aaa75faae0d'; // Using the same key for simplicity

// DOM elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const locationBtn = document.getElementById('location-btn');
const cityName = document.getElementById('city-name');
const dateElement = document.getElementById('date');
const temperature = document.getElementById('temperature');
const weatherCondition = document.getElementById('weather-condition');
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const pressure = document.getElementById('pressure');
const weatherCard = document.getElementById('weather-card');
const errorMessage = document.getElementById('error-message');
const celsiusBtn = document.getElementById('celsius-btn');
const fahrenheitBtn = document.getElementById('fahrenheit-btn');
const loading = document.getElementById('loading');
const locationStatus = document.getElementById('location-status');
const retryBtn = document.getElementById('retry-btn');
const themeToggle = document.getElementById('theme-toggle');
const weatherIconAnimated = document.getElementById('weather-icon-animated');
const forecastContainer = document.getElementById('forecast-container');
const sunriseTime = document.getElementById('sunrise-time');
const sunsetTime = document.getElementById('sunset-time');
const airQualityIndicator = document.getElementById('air-quality-indicator');
const airQualityValue = document.getElementById('air-quality-value');
const airQualityDescription = document.getElementById('air-quality-description');
const weatherParticles = document.getElementById('weather-particles');

// Weather data storage
let weatherData = {};
let forecastData = [];
let units = 'metric'; // Default units (metric = Celsius, imperial = Fahrenheit)
let isDarkMode = false;

// Initialize the app
function initializeApp() {
    loadThemePreference();
    initializeWithLocation();
    setupEventListeners();
}

// Load theme preference from localStorage
function loadThemePreference() {
    const savedTheme = localStorage.getItem('weatherAppTheme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        isDarkMode = true;
    }
}

// Setup event listeners
function setupEventListeners() {
    searchBtn.addEventListener('click', handleSearch);
    cityInput.addEventListener('keypress', handleEnterKey);
    locationBtn.addEventListener('click', initializeWithLocation);
    retryBtn.addEventListener('click', initializeWithLocation);
    celsiusBtn.addEventListener('click', switchToCelsius);
    fahrenheitBtn.addEventListener('click', switchToFahrenheit);
    themeToggle.addEventListener('click', toggleTheme);
}

// Handle search button click
function handleSearch() {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    }
}

// Handle Enter key press in search input
function handleEnterKey(e) {
    if (e.key === 'Enter') {
        handleSearch();
    }
}

// Toggle between light and dark theme
function toggleTheme() {
    isDarkMode = !isDarkMode;
    
    if (isDarkMode) {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('weatherAppTheme', 'dark');
    } else {
        document.body.classList.remove('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('weatherAppTheme', 'light');
    }
    
    // Re-apply weather background if data exists
    if (weatherData.description) {
        updateWeatherBackground(weatherData.description);
    }
}

// Switch to Celsius
function switchToCelsius() {
    if (units !== 'metric') {
        units = 'metric';
        celsiusBtn.classList.add('unit-active');
        fahrenheitBtn.classList.remove('unit-active');
        updateWeatherUI();
        updateForecastUI();
    }
}

// Switch to Fahrenheit
function switchToFahrenheit() {
    if (units !== 'imperial') {
        units = 'imperial';
        fahrenheitBtn.classList.add('unit-active');
        celsiusBtn.classList.remove('unit-active');
        updateWeatherUI();
        updateForecastUI();
    }
}

// Format date
function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Format time (for sunrise/sunset)
function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

// Format day for forecast
function formatDay(timestamp) {
    const date = new Date(timestamp * 1000);
    const options = { weekday: 'short' };
    return date.toLocaleDateString('en-US', options);
}

// Convert temperature
function convertTemperature(temp, targetUnit) {
    if (targetUnit === 'imperial') {
        return (temp * 9/5) + 32; // Convert Celsius to Fahrenheit
    } else {
        return (temp - 32) * 5/9; // Convert Fahrenheit to Celsius
    }
}

// Update weather UI
function updateWeatherUI() {
    const tempSymbol = units === 'metric' ? '°C' : '°F';
    const speedUnit = units === 'metric' ? 'km/h' : 'mph';
    
    let temp, feels;
    
    if (units === 'metric') {
        temp = weatherData.temperature;
        feels = weatherData.feelsLike;
    } else {
        temp = convertTemperature(weatherData.temperature, 'imperial');
        feels = convertTemperature(weatherData.feelsLike, 'imperial');
    }
    
    cityName.textContent = `${weatherData.city}, ${weatherData.country}`;
    dateElement.textContent = formatDate(weatherData.date);
    temperature.textContent = `${Math.round(temp)}${tempSymbol}`;
    weatherCondition.textContent = weatherData.description;
    feelsLike.textContent = `${Math.round(feels)}${tempSymbol}`;
    humidity.textContent = `${weatherData.humidity}%`;
    pressure.textContent = `${weatherData.pressure} hPa`;
    
    // Update wind speed based on units
    let windSpeed = weatherData.windSpeed;
    if (units === 'imperial' && weatherData.speedUnit === 'km/h') {
        windSpeed = windSpeed * 0.621371; // Convert km/h to mph
    } else if (units === 'metric' && weatherData.speedUnit === 'mph') {
        windSpeed = windSpeed * 1.60934; // Convert mph to km/h
    }
    
    wind.textContent = `${Math.round(windSpeed)} ${speedUnit}`;
    
    // Update sunrise/sunset times
    if (weatherData.sunrise) {
        sunriseTime.textContent = formatTime(weatherData.sunrise);
        sunsetTime.textContent = formatTime(weatherData.sunset);
    }
    
    // Update weather icon with animation
    updateWeatherIcon(weatherData.icon, weatherData.description);
    
    // Show weather card
    weatherCard.style.display = 'block';
    errorMessage.style.display = 'none';
    
    // Update background based on weather
    updateWeatherBackground(weatherData.description);
}

// Update weather icon with animation
function updateWeatherIcon(iconCode, description) {
    let iconHTML = '';
    
    // Determine the appropriate icon and animation based on weather condition
    switch (iconCode) {
        case '01d': // Clear sky day
            iconHTML = '<i class="fas fa-sun" style="color: #FFD700; font-size: 5rem; animation: pulse 2s infinite;"></i>';
            break;
        case '01n': // Clear sky night
            iconHTML = '<i class="fas fa-moon" style="color: #F4F4F4; font-size: 5rem; animation: pulse 2s infinite;"></i>';
            break;
        case '02d': // Few clouds day
        case '03d': // Scattered clouds day
            iconHTML = '<i class="fas fa-cloud-sun" style="color: #87CEEB; font-size: 5rem; animation: float 3s infinite;"></i>';
            break;
        case '02n': // Few clouds night
        case '03n': // Scattered clouds night
            iconHTML = '<i class="fas fa-cloud-moon" style="color: #B0C4DE; font-size: 5rem; animation: float 3s infinite;"></i>';
            break;
        case '04d': // Broken clouds day
        case '04n': // Broken clouds night
            iconHTML = '<i class="fas fa-cloud" style="color: #D3D3D3; font-size: 5rem; animation: float 3s infinite;"></i>';
            break;
        case '09d': // Shower rain day
        case '09n': // Shower rain night
            iconHTML = '<i class="fas fa-cloud-showers-heavy" style="color: #87CEEB; font-size: 5rem; animation: rain-bounce 1s infinite;"></i>';
            break;
        case '10d': // Rain day
            iconHTML = '<i class="fas fa-cloud-sun-rain" style="color: #87CEEB; font-size: 5rem; animation: rain-bounce 1s infinite;"></i>';
            break;
        case '10n': // Rain night
            iconHTML = '<i class="fas fa-cloud-moon-rain" style="color: #87CEEB; font-size: 5rem; animation: rain-bounce 1s infinite;"></i>';
            break;
        case '11d': // Thunderstorm day
        case '11n': // Thunderstorm night
            iconHTML = '<i class="fas fa-bolt" style="color: #FFD700; font-size: 5rem; animation: flash 1.5s infinite;"></i>';
            break;
        case '13d': // Snow day
        case '13n': // Snow night
            iconHTML = '<i class="fas fa-snowflake" style="color: #F0F8FF; font-size: 5rem; animation: rotate 3s linear infinite;"></i>';
            break;
        case '50d': // Mist day
        case '50n': // Mist night
            iconHTML = '<i class="fas fa-smog" style="color: #D3D3D3; font-size: 5rem; animation: pulse 3s infinite;"></i>';
            break;
        default:
            iconHTML = '<i class="fas fa-cloud" style="color: #D3D3D3; font-size: 5rem;"></i>';
    }
    
    weatherIconAnimated.innerHTML = iconHTML;
    
    // Add keyframe animations for the icons
    const styleSheet = document.styleSheets[0];
    if (!document.getElementById('weather-icon-animations')) {
        const animationStyle = document.createElement('style');
        animationStyle.id = 'weather-icon-animations';
        animationStyle.innerHTML = `
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
                100% { transform: translateY(0px); }
            }
            @keyframes rain-bounce {
                0% { transform: translateY(0); }
                50% { transform: translateY(5px); }
                100% { transform: translateY(0); }
            }
            @keyframes flash {
                0% { opacity: 1; }
                50% { opacity: 0.5; }
                51% { opacity: 1; }
                100% { opacity: 1; }
            }
            @keyframes rotate {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(animationStyle);
    }
}

// Update weather background animation
function updateWeatherBackground(weatherDescription) {
    weatherParticles.innerHTML = '';
    
    // Clear any existing background class
    document.body.className = isDarkMode ? 'dark-theme' : '';
    
    // Add background color based on weather condition
    let bgClass = '';
    
    const lowerDesc = weatherDescription.toLowerCase();
    
    if (lowerDesc.includes('clear')) {
        bgClass = 'clear-bg';
        document.body.style.background = isDarkMode ? 
            'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)' : 
            'linear-gradient(to bottom, #00b4db, #0083b0)';
    } else if (lowerDesc.includes('cloud')) {
        bgClass = 'cloudy-bg';
        document.body.style.background = isDarkMode ? 
            'linear-gradient(to bottom, #4b6cb7, #182848)' : 
            'linear-gradient(to bottom, #bdc3c7, #2c3e50)';
        addCloudParticles();
    } else if (lowerDesc.includes('rain') || lowerDesc.includes('drizzle')) {
        bgClass = 'rain-bg';
        document.body.style.background = isDarkMode ? 
            'linear-gradient(to bottom, #373b44, #4286f4)' : 
            'linear-gradient(to bottom, #757f9a, #d7dde8)';
        addRaindrops();
    } else if (lowerDesc.includes('thunderstorm')) {
        bgClass = 'thunder-bg';
        document.body.style.background = isDarkMode ? 
            'linear-gradient(to bottom, #283048, #859398)' : 
            'linear-gradient(to bottom, #606c88, #3f4c6b)';
        addRaindrops();
        addLightningFlash();
    } else if (lowerDesc.includes('snow')) {
        bgClass = 'snow-bg';
        document.body.style.background = isDarkMode ? 
            'linear-gradient(to bottom, #2c3e50, #3498db)' : 
            'linear-gradient(to bottom, #e6dada, #274046)';
        addSnowflakes();
    } else if (lowerDesc.includes('mist') || lowerDesc.includes('fog') || lowerDesc.includes('haze')) {
        bgClass = 'mist-bg';
        document.body.style.background = isDarkMode ? 
            'linear-gradient(to bottom, #606c88, #3f4c6b)' : 
            'linear-gradient(to bottom, #e6dada, #274046)';
        addMistParticles();
    } else {
        // Default background
        document.body.style.background = isDarkMode ? 
            'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)' : 
            'linear-gradient(to bottom, #00b4db, #0083b0)';
    }
}

// Add raindrops to the background
function addRaindrops() {
    const rainCount = 50;
    
    for (let i = 0; i < rainCount; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        
        // Random position and size
        const left = Math.random() * 100;
        const size = Math.random() * 3 + 1;
        const opacity = Math.random() * 0.3 + 0.5;
        
        // Apply styles
        drop.style.left = `${left}%`;
        drop.style.width = `${size}px`;
        drop.style.height = `${size * 15}px`;
        drop.style.opacity = opacity;
        drop.style.animationDuration = `${Math.random() * 0.5 + 0.5}s`;
        drop.style.animationDelay = `${Math.random() * 2}s`;
        
        weatherParticles.appendChild(drop);
    }
}

// Add lightning flash effect
function addLightningFlash() {
    const lightning = document.createElement('div');
    lightning.className = 'lightning';
    lightning.style.position = 'absolute';
    lightning.style.top = '0';
    lightning.style.left = '0';
    lightning.style.width = '100%';
    lightning.style.height = '100%';
    lightning.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
    lightning.style.zIndex = '-1';
    lightning.style.opacity = '0';
    lightning.style.animation = 'lightning 4s infinite';
    
    weatherParticles.appendChild(lightning);
    
    // Add lightning animation if it doesn't exist
    if (!document.getElementById('lightning-animation')) {
        const animStyle = document.createElement('style');
        animStyle.id = 'lightning-animation';
        animStyle.innerHTML = `
            @keyframes lightning {
                0% { opacity: 0; }
                1% { opacity: 1; }
                2% { opacity: 0; }
                3% { opacity: 0; }
                4% { opacity: 0.6; }
                5% { opacity: 0; }
                100% { opacity: 0; }
            }
        `;
        document.head.appendChild(animStyle);
    }
}

// Add snowflakes to the background
function addSnowflakes() {
    const snowCount = 50;
    const snowflakes = ['❄', '❅', '❆', '•'];
    
    for (let i = 0; i < snowCount; i++) {
        const flake = document.createElement('div');
        flake.className = 'snow-flake';
        
        // Random position, size, and flake type
        const left = Math.random() * 100;
        const size = Math.random() * 15 + 10;
        const flakeType = snowflakes[Math.floor(Math.random() * snowflakes.length)];
        
        // Apply styles
        flake.style.left = `${left}%`;
        flake.style.fontSize = `${size}px`;
        flake.style.animationDuration = `${Math.random() * 5 + 10}s`;
        flake.style.animationDelay = `${Math.random() * 5}s`;
        flake.innerHTML = flakeType;
        
        weatherParticles.appendChild(flake);
    }
}

// Add mist particles
function addMistParticles() {
    const mistCount = 15;
    
    for (let i = 0; i < mistCount; i++) {
        const mist = document.createElement('div');
        mist.className = 'mist-particle';
        
        // Random position and size
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const size = Math.random() * 150 + 50;
        const opacity = Math.random() * 0.3;
        
        // Apply styles
        mist.style.position = 'absolute';
        mist.style.top = `${top}%`;
        mist.style.left = `${left}%`;
        mist.style.width = `${size}px`;
        mist.style.height = `${size}px`;
        mist.style.borderRadius = '50%';
        mist.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        mist.style.opacity = opacity;
        mist.style.filter = 'blur(20px)';
        
        weatherParticles.appendChild(mist);
    }
}

// Add cloud particles
function addCloudParticles() {
    const cloudCount = 8;
    
    for (let i = 0; i < cloudCount; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        
        // Random position and size
        const top = Math.random() * 70; // Keep clouds in upper part of screen
        const size = Math.random() * 100 + 100;
        const opacity = Math.random() * 0.3 + 0.1;
        
        // Apply styles
        cloud.style.top = `${top}%`;
        cloud.style.width = `${size}px`;
        cloud.style.height = `${size * 0.6}px`;
        cloud.style.opacity = opacity;
        cloud.style.animationDuration = `${Math.random() * 40 + 60}s`;
        cloud.style.filter = 'blur(10px)';
        
        weatherParticles.appendChild(cloud);
    }
}

// Initialize app with user's location
function initializeWithLocation() {
    if (navigator.geolocation) {
        // Show loading state
        loading.style.display = 'block';
        weatherCard.style.display = 'none';
        errorMessage.style.display = 'none';
        locationStatus.style.display = 'block';
        locationStatus.querySelector('.location-message').textContent = 'Getting your location...';
        retryBtn.style.display = 'none';
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                fetchWeatherByCoords(lat, lon);
                locationStatus.style.display = 'none';
            },
            (error) => {
                loading.style.display = 'none';
                locationStatus.querySelector('.location-message').textContent = 
                    'Unable to get your location. Please allow location access or search for a city.';
                retryBtn.style.display = 'block';
                
                console.error('Geolocation error:', error);
            }
        );
    } else {
        locationStatus.style.display = 'block';
        locationStatus.querySelector('.location-message').textContent = 
            'Geolocation is not supported by your browser. Please search for a city.';
        loading.style.display = 'none';
    }
}

// Fetch weather data by city name
function fetchWeather(city) {
    // Show loading state
    loading.style.display = 'block';
    weatherCard.style.display = 'none';
    errorMessage.style.display = 'none';
    
    // Fetch current weather
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            // Process weather data
            processWeatherData(data);
            
            // Fetch forecast data
            return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
        })
        .then(response => response.json())
        .then(data => {
            // Process forecast data
            processForecastData(data);
            
            // Fetch air quality data
            const lat = weatherData.lat;
            const lon = weatherData.lon;
            return fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${aqiKey}`);
        })
        .then(response => response.json())
        .then(data => {
            // Process air quality data
            processAirQualityData(data);
            
            // Update UI
            loading.style.display = 'none';
            updateWeatherUI();
            updateForecastUI();
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            loading.style.display = 'none';
            errorMessage.style.display = 'block';
            weatherCard.style.display = 'none';
        });
}

// Fetch weather data by coordinates
function fetchWeatherByCoords(lat, lon) {
    // Show loading state
    loading.style.display = 'block';
    weatherCard.style.display = 'none';
    errorMessage.style.display = 'none';
    
    // Fetch current weather
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Location not found');
            }
            return response.json();
        })
        .then(data => {
            // Process weather data
            processWeatherData(data);
            
            // Fetch forecast data
            return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
        })
        .then(response => response.json())
        .then(data => {
            // Process forecast data
            processForecastData(data);
            
            // Fetch air quality data
            return fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${aqiKey}`);
        })
        .then(response => response.json())
        .then(data => {
            // Process air quality data
            processAirQualityData(data);
            
            // Update UI
            loading.style.display = 'none';
            updateWeatherUI();
            updateForecastUI();
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            loading.style.display = 'none';
            errorMessage.style.display = 'block';
            weatherCard.style.display = 'none';
        });
}

// Process weather data
function processWeatherData(data) {
    weatherData = {
        city: data.name,
        country: data.sys.country,
        date: data.dt,
        temperature: data.main.temp,
        feelsLike: data.main.feels_like,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        windSpeed: data.wind.speed * 3.6, // Convert m/s to km/h
        speedUnit: 'km/h',
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        lat: data.coord.lat,
        lon: data.coord.lon
    };
}

// Process forecast data
function processForecastData(data) {
    // Group forecast data by day
    const dailyData = {};
    
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toDateString();
        
        if (!dailyData[day]) {
            dailyData[day] = [];
        }
        
        dailyData[day].push(item);
    });
    
    // Get daily averages
    forecastData = [];
    
    Object.keys(dailyData).forEach((day, index) => {
        if (index === 0) return; // Skip current day
        if (index > 5) return; // Only show 5 days
        
        const dayData = dailyData[day];
        
        // Find the noon forecast or closest to it
        const noonForecast = dayData.reduce((prev, curr) => {
            const prevHour = new Date(prev.dt * 1000).getHours();
            const currHour = new Date(curr.dt * 1000).getHours();
            return Math.abs(currHour - 12) < Math.abs(prevHour - 12) ? curr : prev;
        });
        
        forecastData.push({
            date: noonForecast.dt,
            temperature: noonForecast.main.temp,
            description: noonForecast.weather[0].description,
            icon: noonForecast.weather[0].icon
        });
    });
}

// Process air quality data
function processAirQualityData(data) {
    if (!data || !data.list || !data.list[0]) return;
    
    const aqi = data.list[0].main.aqi;
    let qualityText, qualityDescription, qualityColor, qualityWidth;
    
    switch (aqi) {
        case 1:
            qualityText = 'Good';
            qualityDescription = 'Air quality is satisfactory, and air pollution poses little or no risk.';
            qualityColor = 'var(--success-color)';
            qualityWidth = '20%';
            break;
        case 2:
            qualityText = 'Fair';
            qualityDescription = 'Air quality is acceptable; however, some pollutants may pose a moderate health concern.';
            qualityColor = '#8BC34A';
            qualityWidth = '40%';
            break;
        case 3:
            qualityText = 'Moderate';
            qualityDescription = 'Members of sensitive groups may experience health effects.';
            qualityColor = 'var(--warning-color)';
            qualityWidth = '60%';
            break;
        case 4:
            qualityText = 'Poor';
            qualityDescription = 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.';
            qualityColor = '#FF5722';
            qualityWidth = '80%';
            break;
        case 5:
            qualityText = 'Very Poor';
            qualityDescription = 'Health warnings of emergency conditions; everyone is more likely to be affected.';
            qualityColor = 'var(--danger-color)';
            qualityWidth = '100%';
            break;
        default:
            qualityText = 'Unknown';
            qualityDescription = 'Unable to determine air quality.';
            qualityColor = '#757575';
            qualityWidth = '0%';
    }
    
    airQualityValue.textContent = qualityText;
    airQualityDescription.textContent = qualityDescription;
    airQualityIndicator.style.backgroundColor = qualityColor;
    airQualityIndicator.style.width = qualityWidth;
    
    airQualityValue.style.color = qualityColor;
}

// Update forecast UI
function updateForecastUI() {
    forecastContainer.innerHTML = '';
    
    forecastData.forEach(day => {
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        
        const tempSymbol = units === 'metric' ? '°C' : '°F';
        let temperature = day.temperature;
        
        if (units === 'imperial') {
            temperature = convertTemperature(temperature, 'imperial');
        }
        
        forecastItem.innerHTML = `
            <div class="forecast-day">${formatDay(day.date)}</div>
            <div class="forecast-icon">
                <i class="${getWeatherIconClass(day.icon)}" style="font-size: 2rem; color: ${getWeatherIconColor(day.icon)};"></i>
            </div>
            <div class="forecast-temp">${Math.round(temperature)}${tempSymbol}</div>
        `;
        
        forecastContainer.appendChild(forecastItem);
    });
}

// Get weather icon class based on icon code
function getWeatherIconClass(iconCode) {
    // Map OpenWeather icon codes to Font Awesome icons
    switch (iconCode) {
        case '01d': return 'fas fa-sun';
        case '01n': return 'fas fa-moon';
        case '02d': return 'fas fa-cloud-sun';
        case '02n': return 'fas fa-cloud-moon';
        case '03d':
        case '03n': return 'fas fa-cloud';
        case '04d':
        case '04n': return 'fas fa-cloud';
        case '09d':
        case '09n': return 'fas fa-cloud-showers-heavy';
        case '10d': return 'fas fa-cloud-sun-rain';
        case '10n': return 'fas fa-cloud-moon-rain';
        case '11d':
        case '11n': return 'fas fa-bolt';
        case '13d':
        case '13n': return 'fas fa-snowflake';
        case '50d':
        case '50n': return 'fas fa-smog';
        default: return 'fas fa-cloud';
    }
}

// Get weather icon color based on icon code
function getWeatherIconColor(iconCode) {
    // Map weather conditions to appropriate colors
    if (iconCode.includes('01')) {
        return '#FFD700'; // Sun/Moon (Clear)
    } else if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) {
        return '#B0C4DE'; // Clouds
    } else if (iconCode.includes('09') || iconCode.includes('10')) {
        return '#87CEEB'; // Rain
    } else if (iconCode.includes('11')) {
        return '#FFD700'; // Thunder
    } else if (iconCode.includes('13')) {
        return '#F0F8FF'; // Snow
    } else if (iconCode.includes('50')) {
        return '#D3D3D3'; // Mist
    } else {
        return '#D3D3D3'; // Default
    }
}

// Error handling for API requests
function handleApiError(error) {
    console.error('API Error:', error);
    loading.style.display = 'none';
    errorMessage.style.display = 'block';
    weatherCard.style.display = 'none';
}

// Convert speed units
function convertSpeed(speed, fromUnit, toUnit) {
    if (fromUnit === toUnit) return speed;
    
    if (fromUnit === 'mph' && toUnit === 'km/h') {
        return speed * 1.60934;
    } else if (fromUnit === 'km/h' && toUnit === 'mph') {
        return speed * 0.621371;
    }
    
    return speed;
}

// Save the last searched location to localStorage
function saveLastLocation(city) {
    localStorage.setItem('lastWeatherLocation', city);
}

// Check if user has a previously searched location
function loadLastLocation() {
    const lastLocation = localStorage.getItem('lastWeatherLocation');
    if (lastLocation) {
        fetchWeather(lastLocation);
    } else {
        // Default to a common location if no previous search
        initializeWithLocation();
    }
}

// Event listener for when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);
            