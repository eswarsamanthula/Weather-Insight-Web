import styled from 'styled-components';
import { formatDate } from '../utils/dateUtils';

const Card = styled.div`
  background: var(--card-background);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const LocationInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
`;

const CityInfo = styled.div`
  text-align: left;
`;

const CityName = styled.h2`
  font-size: 2rem;
  color: var(--text-color);
  margin: 0;
`;

const CountryName = styled.p`
  font-size: 1.2rem;
  color: var(--text-color-light);
  margin: 0.5rem 0;
`;

const DateText = styled.p`
  font-size: 1rem;
  color: var(--text-color-light);
  margin: 0;
`;

const UnitToggle = styled.div`
  display: flex;
  align-items: center;
  background: var(--card-background);
  border-radius: 20px;
  padding: 0.3rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const UnitButton = styled.button`
  background: ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    background: ${props => props.active ? 'var(--primary-color)' : 'rgba(0, 0, 0, 0.1)'};
  }
`;

const WeatherInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;
`;

const WeatherIcon = styled.div`
  font-size: 5rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
`;

const Temperature = styled.div`
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 0.5rem;
`;

const WeatherDescription = styled.p`
  font-size: 1.2rem;
  color: var(--text-color-light);
  margin: 0;
  text-transform: capitalize;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin: 2rem 0;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const InfoIcon = styled.i`
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
`;

const InfoLabel = styled.span`
  font-size: 0.9rem;
  color: var(--text-color-light);
  margin-bottom: 0.3rem;
`;

const InfoValue = styled.span`
  font-size: 1.1rem;
  color: var(--text-color);
  font-weight: 500;
`;

const ForecastSection = styled.div`
  margin-top: 2rem;
`;

const ForecastTitle = styled.h3`
  font-size: 1.2rem;
  color: var(--text-color);
  margin-bottom: 1rem;
  text-align: left;
`;

const ForecastScroll = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  padding: 0.5rem;
  scrollbar-width: thin;
  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--primary-color);
    border-radius: 3px;
  }
`;

const ForecastCard = styled.div`
  min-width: 120px;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ForecastDay = styled.div`
  font-size: 0.9rem;
  color: var(--text-color-light);
  margin-bottom: 0.5rem;
`;

const ForecastIcon = styled.div`
  font-size: 2rem;
  color: var(--primary-color);
  margin: 0.5rem 0;
`;

const ForecastTemp = styled.div`
  font-size: 1.1rem;
  color: var(--text-color);
  font-weight: 500;
`;

const SunCycle = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
`;

const SunCycleTitle = styled.h3`
  font-size: 1.2rem;
  color: var(--text-color);
  margin-bottom: 1rem;
  text-align: left;
`;

const SunCycleContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SunTime = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const SunIcon = styled.i`
  font-size: 1.5rem;
  color: var(--primary-color);
`;

const TimeText = styled.span`
  font-size: 0.9rem;
  color: var(--text-color);
`;

function WeatherCard({ data, units, onUnitsChange }) {
  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      '01d': 'sun',
      '01n': 'moon',
      '02d': 'cloud-sun',
      '02n': 'cloud-moon',
      '03d': 'cloud',
      '03n': 'cloud',
      '04d': 'cloud',
      '04n': 'cloud',
      '09d': 'cloud-showers-heavy',
      '09n': 'cloud-showers-heavy',
      '10d': 'cloud-sun-rain',
      '10n': 'cloud-moon-rain',
      '11d': 'bolt',
      '11n': 'bolt',
      '13d': 'snowflake',
      '13n': 'snowflake',
      '50d': 'smog',
      '50n': 'smog'
    };
    return iconMap[iconCode] || 'cloud';
  };

  return (
    <Card>
      <LocationInfo>
        <CityInfo>
          <CityName>{data.city}</CityName>
          <CountryName>{data.country}</CountryName>
          <DateText>{formatDate(data.date)}</DateText>
        </CityInfo>
        <UnitToggle>
          <UnitButton 
            active={units === 'metric'} 
            onClick={() => onUnitsChange('metric')}
          >
            °C
          </UnitButton>
          <UnitButton 
            active={units === 'imperial'} 
            onClick={() => onUnitsChange('imperial')}
          >
            °F
          </UnitButton>
        </UnitToggle>
      </LocationInfo>

      <WeatherInfo>
        <WeatherIcon>
          <i className={`fas fa-${getWeatherIcon(data.icon)}`}></i>
        </WeatherIcon>
        <Temperature>{Math.round(data.temperature)}°{units === 'metric' ? 'C' : 'F'}</Temperature>
        <WeatherDescription>{data.description}</WeatherDescription>
      </WeatherInfo>

      <InfoGrid>
        <InfoItem>
          <InfoIcon className="fas fa-temperature-high"></InfoIcon>
          <InfoLabel>Feels Like</InfoLabel>
          <InfoValue>{Math.round(data.feelsLike)}°{units === 'metric' ? 'C' : 'F'}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoIcon className="fas fa-wind"></InfoIcon>
          <InfoLabel>Wind Speed</InfoLabel>
          <InfoValue>{data.windSpeed} {units === 'metric' ? 'm/s' : 'mph'}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoIcon className="fas fa-tint"></InfoIcon>
          <InfoLabel>Humidity</InfoLabel>
          <InfoValue>{data.humidity}%</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoIcon className="fas fa-compress-alt"></InfoIcon>
          <InfoLabel>Pressure</InfoLabel>
          <InfoValue>{data.pressure} hPa</InfoValue>
        </InfoItem>
      </InfoGrid>

      <ForecastSection>
        <ForecastTitle>5-Day Forecast</ForecastTitle>
        <ForecastScroll>
          {data.forecast.map((day, index) => (
            <ForecastCard key={index}>
              <ForecastDay>{formatDate(day.date, 'short')}</ForecastDay>
              <ForecastIcon>
                <i className={`fas fa-${getWeatherIcon(day.icon)}`}></i>
              </ForecastIcon>
              <ForecastTemp>
                {Math.round(day.temperature)}°{units === 'metric' ? 'C' : 'F'}
              </ForecastTemp>
            </ForecastCard>
          ))}
        </ForecastScroll>
      </ForecastSection>

      <SunCycle>
        <SunCycleTitle>Sun Cycle</SunCycleTitle>
        <SunCycleContent>
          <SunTime>
            <SunIcon className="fas fa-sunrise"></SunIcon>
            <TimeText>{data.sunrise}</TimeText>
          </SunTime>
          <SunTime>
            <SunIcon className="fas fa-sunset"></SunIcon>
            <TimeText>{data.sunset}</TimeText>
          </SunTime>
        </SunCycleContent>
      </SunCycle>
    </Card>
  );
}

export default WeatherCard;