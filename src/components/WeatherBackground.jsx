import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
  transition: background 0.5s ease;
  background: ${props => props.background};
`;

const ParticlesContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

function WeatherBackground({ weatherData }) {
  const particlesRef = useRef(null);

  const getBackgroundStyle = (iconCode) => {
    const backgrounds = {
      // Clear sky
      '01d': 'linear-gradient(135deg, #00b4db, #0083b0)',
      '01n': 'linear-gradient(135deg, #1a1a2e, #16213e)',
      // Few clouds
      '02d': 'linear-gradient(135deg, #89f7fe, #66a6ff)',
      '02n': 'linear-gradient(135deg, #2c3e50, #3498db)',
      // Scattered clouds
      '03d': 'linear-gradient(135deg, #bdc3c7, #2c3e50)',
      '03n': 'linear-gradient(135deg, #2c3e50, #34495e)',
      // Broken clouds
      '04d': 'linear-gradient(135deg, #7f7fd5, #86a8e7)',
      '04n': 'linear-gradient(135deg, #2c3e50, #4b6cb7)',
      // Shower rain
      '09d': 'linear-gradient(135deg, #4b6cb7, #182848)',
      '09n': 'linear-gradient(135deg, #182848, #000428)',
      // Rain
      '10d': 'linear-gradient(135deg, #4b6cb7, #182848)',
      '10n': 'linear-gradient(135deg, #182848, #000428)',
      // Thunderstorm
      '11d': 'linear-gradient(135deg, #373b44, #4286f4)',
      '11n': 'linear-gradient(135deg, #000428, #004e92)',
      // Snow
      '13d': 'linear-gradient(135deg, #e6dada, #274046)',
      '13n': 'linear-gradient(135deg, #2c3e50, #4b6cb7)',
      // Mist
      '50d': 'linear-gradient(135deg, #bdc3c7, #2c3e50)',
      '50n': 'linear-gradient(135deg, #2c3e50, #34495e)',
      // Default background for initial load (clear day)
      'default': 'linear-gradient(135deg, #00b4db, #0083b0)',
    };
    return backgrounds[iconCode] || backgrounds['default'];
  };

  const createParticles = (iconCode) => {
    const container = particlesRef.current;
    if (!container) return;

    // Clear existing particles
    container.innerHTML = '';

    const particleCount = 50;
    const particles = {
      '01d': { type: 'sun', count: 1 },
      '01n': { type: 'stars', count: 100 },
      '02d': { type: 'clouds', count: 5 },
      '02n': { type: 'clouds', count: 5 },
      '03d': { type: 'clouds', count: 8 },
      '03n': { type: 'clouds', count: 8 },
      '04d': { type: 'clouds', count: 10 },
      '04n': { type: 'clouds', count: 10 },
      '09d': { type: 'rain', count: 100 },
      '09n': { type: 'rain', count: 100 },
      '10d': { type: 'rain', count: 100 },
      '10n': { type: 'rain', count: 100 },
      '11d': { type: 'lightning', count: 1 },
      '11n': { type: 'lightning', count: 1 },
      '13d': { type: 'snow', count: 100 },
      '13n': { type: 'snow', count: 100 },
      '50d': { type: 'mist', count: 20 },
      '50n': { type: 'mist', count: 20 },
    };

    const weatherParticles = particles[iconCode] || particles['01d'];

    for (let i = 0; i < weatherParticles.count; i++) {
      const particle = document.createElement('div');
      particle.className = `weather-particle ${weatherParticles.type}`;
      
      // Random positioning
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      // Random size for clouds
      if (weatherParticles.type === 'clouds') {
        const size = Math.random() * 100 + 50;
        particle.style.width = `${size}px`;
        particle.style.height = `${size * 0.6}px`;
      }
      
      // Random delay for animations
      particle.style.animationDelay = `${Math.random() * 5}s`;
      
      container.appendChild(particle);
    }
  };

  useEffect(() => {
    if (weatherData && weatherData.icon) {
      createParticles(weatherData.icon);
    } else {
      // Create default particles for initial load (clear day)
      createParticles('01d');
    }
  }, [weatherData]);

  return (
    <BackgroundContainer background={weatherData ? getBackgroundStyle(weatherData.icon) : getBackgroundStyle('default')}>
      <ParticlesContainer ref={particlesRef} />
    </BackgroundContainer>
  );
}

export default WeatherBackground;