import { useState } from 'react';
import styled from 'styled-components';

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 0 1rem;
`;

const SearchWrapper = styled.div`
  flex: 1;
  position: relative;
  background: var(--card-background);
  border-radius: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:focus-within {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1.5rem;
  padding-left: 3rem;
  border: none;
  border-radius: 30px;
  background: transparent;
  color: var(--text-color);
  font-size: 1rem;
  outline: none;

  &::placeholder {
    color: var(--text-color-light);
  }
`;

const SearchIcon = styled.i`
  position: absolute;
  left: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-color-light);
  font-size: 1rem;
`;

const SearchButton = styled.button`
  background: var(--primary-color);
  color: white;
  border: none;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const LocationButton = styled.button`
  background: var(--secondary-color);
  color: white;
  border: none;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

function SearchBox({ onSearch }) {
  const [city, setCity] = useState('');

  const handleSearch = () => {
    if (city.trim()) {
      onSearch(city.trim());
      setCity('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onSearch({ lat: latitude, lon: longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
          onSearch('current');
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      onSearch('current');
    }
  };

  return (
    <SearchContainer>
      <SearchWrapper>
        <SearchIcon className="fas fa-search" />
        <SearchInput
          type="text"
          placeholder="Search for a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </SearchWrapper>
      <SearchButton onClick={handleSearch}>
        <i className="fas fa-arrow-right"></i>
      </SearchButton>
      <LocationButton onClick={handleLocationClick}>
        <i className="fas fa-map-marker-alt"></i>
      </LocationButton>
    </SearchContainer>
  );
}

export default SearchBox; 