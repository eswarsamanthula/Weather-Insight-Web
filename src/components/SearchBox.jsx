import { useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const rippleAnim = keyframes`
  0%   { transform:scale(0); opacity:0.5; }
  100% { transform:scale(4); opacity:0; }
`;

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
  overflow:hidden;
  transition:all 0.35s ease;
  &:focus-within {
    border-color:rgba(56,189,248,0.5);
    box-shadow:0 0 0 3px rgba(56,189,248,0.1), 0 0 30px rgba(56,189,248,0.05);
    transform:scaleX(1.01);
  }
`;
const Ripple = styled.span`
  position:absolute;
  border-radius:50%;
  background:rgba(56,189,248,0.18);
  width:60px; height:60px;
  left:${p => p.$x}px; top:${p => p.$y}px;
  transform:scale(0);
  animation:${rippleAnim} 0.6s ease-out forwards;
  pointer-events:none;
`;
const Icon = styled.span`
  position:absolute; left:16px; top:50%; transform:translateY(-50%);
  color:var(--text-muted); font-size:0.9rem; pointer-events:none;
  transition:color 0.3s ease;
  ${InputWrap}:focus-within & { color:var(--primary); }
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
  const [ripples, setRipples] = useState([]);
  const wrapRef = useRef(null);

  const addRipple = e => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = e.clientX - r.left - 30;
    const y = e.clientY - r.top - 30;
    const id = Date.now();
    setRipples(prev => [...prev, { id, x, y }]);
    setTimeout(() => setRipples(prev => prev.filter(rp => rp.id !== id)), 650);
  };

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
      <InputWrap ref={wrapRef} onClick={addRipple}>
        {ripples.map(rp => <Ripple key={rp.id} $x={rp.x} $y={rp.y} />)}
        <Icon><i className="fas fa-search" /></Icon>
        <Input type="text" placeholder="Search any city..." value={city}
          onChange={e => setCity(e.target.value)} onKeyDown={keyDown} />
      </InputWrap>
      <Btn $primary onClick={go} title="Search"><i className="fas fa-arrow-right" /></Btn>
      <Btn onClick={locate} title="My location"><i className="fas fa-location-dot" /></Btn>
    </Wrap>
  );
}