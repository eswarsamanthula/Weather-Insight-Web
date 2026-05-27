import { useState } from 'react';
import styled from 'styled-components';

const Wrap = styled.div`
  display:flex; align-items:center; gap:10px;
  margin-bottom:2rem;
  animation:fadeUp 0.5s var(--ease) both;
  animation-delay:0.15s;
`;
const InputWrap = styled.div`
  flex:1; position:relative;
  background:rgba(10,16,30,0.75);
  border:1px solid rgba(255,255,255,0.08);
  border-radius:14px;
  backdrop-filter:blur(24px);
  transition:all 0.3s ease;
  &:focus-within {
    border-color:rgba(56,189,248,0.45);
    box-shadow:0 0 0 3px rgba(56,189,248,0.08);
  }
`;
const Icon = styled.span`
  position:absolute; left:16px; top:50%; transform:translateY(-50%);
  color:var(--text-muted); font-size:0.9rem; pointer-events:none;
`;
const Input = styled.input`
  width:100%; padding:15px 16px 15px 44px;
  background:transparent; border:none; outline:none;
  color:var(--text); font-family:'DM Sans',sans-serif;
  font-size:0.95rem; letter-spacing:0.01em;
  &::placeholder { color:var(--text-muted); }
`;
const Btn = styled.button`
  width:48px; height:48px; flex-shrink:0;
  border-radius:13px; border:1px solid rgba(255,255,255,0.08);
  background:${p => p.$primary
    ? 'linear-gradient(135deg,#0ea5e9,#6366f1)'
    : 'rgba(10,16,30,0.75)'};
  color:white; font-size:0.95rem; cursor:pointer;
  display:flex; align-items:center; justify-content:center;
  backdrop-filter:blur(24px);
  transition:all 0.25s ease;
  &:hover {
    transform:translateY(-2px);
    box-shadow:${p => p.$primary
    ? '0 8px 24px rgba(99,102,241,0.35)'
    : '0 6px 18px rgba(0,0,0,0.3)'};
  }
  &:active { transform:translateY(0); }
`;

export default function SearchBox({ onSearch }) {
  const [city, setCity] = useState('');
  const go = () => { if (city.trim()) { onSearch(city.trim()); setCity(''); } };
  const keyDown = e => { if (e.key === 'Enter') go(); };
  const locate = () => {
    if (!navigator.geolocation) return onSearch('current');
    navigator.geolocation.getCurrentPosition(
      pos => onSearch({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => onSearch('current')
    );
  };
  return (
    <Wrap>
      <InputWrap>
        <Icon><i className="fas fa-search" /></Icon>
        <Input type="text" placeholder="Search any city..." value={city}
          onChange={e => setCity(e.target.value)} onKeyDown={keyDown} />
      </InputWrap>
      <Btn $primary onClick={go} title="Search"><i className="fas fa-arrow-right" /></Btn>
      <Btn onClick={locate} title="My location"><i className="fas fa-location-dot" /></Btn>
    </Wrap>
  );
}
