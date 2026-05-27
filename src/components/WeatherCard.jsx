import { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { formatDate } from '../utils/dateUtils';

// ── Keyframes ──────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity:0; transform:translateY(20px); }
  to   { opacity:1; transform:translateY(0); }
`;
const neonPulse = keyframes`
  0%,100% { text-shadow:0 0 8px rgba(56,189,248,0.5), 0 0 20px rgba(56,189,248,0.3); }
  50%      { text-shadow:0 0 16px rgba(56,189,248,0.9), 0 0 40px rgba(129,140,248,0.5), 0 0 60px rgba(56,189,248,0.2); }
`;
const auroraMove = keyframes`
  0%   { transform:scaleX(1)   scaleY(1)   translateX(0); opacity:0.25; }
  33%  { transform:scaleX(1.15) scaleY(1.3) translateX(3%); opacity:0.45; }
  66%  { transform:scaleX(0.9)  scaleY(0.8) translateX(-3%); opacity:0.3; }
  100% { transform:scaleX(1)   scaleY(1)   translateX(0); opacity:0.25; }
`;
const compassSpin = keyframes`
  from { transform:rotate(0deg); }
  to   { transform:rotate(360deg); }
`;

// ── Aurora ─────────────────────────────────────────────────
const Aurora = styled.div`
  position:fixed; inset:0; z-index:-1; pointer-events:none;
  overflow:hidden; opacity:0; transition:opacity 1.5s ease;
  ${p => p.$active && css`opacity:1;`}
`;
const AuroraLayer = styled.div`
  position:absolute;
  width:180%; height:60%;
  top:${p => p.$top}%;
  left:-40%;
  background:${p => p.$color};
  border-radius:50%;
  filter:blur(60px);
  animation:${auroraMove} ${p => p.$dur}s ease-in-out infinite;
  animation-delay:${p => p.$delay}s;
`;

// ── Card shell ─────────────────────────────────────────────
const Card = styled.div`
  background:rgba(10,16,30,0.72);
  border-radius:24px;
  border:1px solid rgba(255,255,255,0.07);
  backdrop-filter:blur(32px);
  overflow:hidden;
  animation:${fadeUp} 0.6s var(--ease) both;
  animation-delay:0.25s;
  box-shadow:0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06);
`;

const TopBar = styled.div`
  display:flex; justify-content:space-between; align-items:flex-start;
  padding:2rem 2rem 0;
`;
const CityName = styled.h2`
  font-family:'Bebas Neue',sans-serif;
  font-size:3rem; letter-spacing:0.05em;
  color:var(--text); line-height:1;
  ${p => p.$night && css`animation:${neonPulse} 3s ease-in-out infinite;`}
`;
const CountryDate = styled.div`
  margin-top:6px;
  span { display:block; font-size:0.85rem; color:var(--text-muted); }
`;
const UnitToggle = styled.div`
  display:flex; align-items:center;
  background:rgba(255,255,255,0.04);
  border:1px solid rgba(255,255,255,0.07);
  border-radius:10px; padding:3px;
`;
const UnitBtn = styled.button`
  background:${p => p.$active ? 'rgba(56,189,248,0.2)' : 'transparent'};
  color:${p => p.$active ? 'var(--primary)' : 'var(--text-muted)'};
  border:none; padding:6px 14px; border-radius:8px;
  cursor:pointer; font-family:'DM Sans',sans-serif; font-size:0.85rem; font-weight:500;
  transition:all 0.25s ease;
  &:hover { color:var(--primary); }
`;

// ── Hero (temp + icon) ─────────────────────────────────────
const HeroSection = styled.div`
  display:flex; align-items:center; justify-content:space-between;
  padding:1.5rem 2rem 1rem;
`;
const TempBlock = styled.div``;

// Slot-machine temp
const SlotWrap = styled.div`
  overflow:hidden; height:8rem; display:flex; align-items:center;
`;
const SlotDigit = styled.span`
  font-family:'Bebas Neue',sans-serif;
  font-size:7rem; line-height:1;
  background:linear-gradient(135deg,#e2e8f0 30%,var(--primary) 100%);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent;
  display:inline-block;
  animation:${fadeUp} 0.4s var(--ease) both;
  animation-delay:${p => p.$i * 0.06}s;
`;

function SlotTemp({ value, unit }) {
  const str = `${Math.round(value)}${unit}`;
  return (
    <SlotWrap>
      {str.split('').map((ch, i) => <SlotDigit key={`${ch}-${i}-${value}`} $i={i}>{ch}</SlotDigit>)}
    </SlotWrap>
  );
}

const Description = styled.p`
  font-size:1rem; color:var(--text-muted); text-transform:capitalize;
  font-weight:400; margin-top:4px; letter-spacing:0.02em;
  ${p => p.$night && css`animation:${neonPulse} 4s ease-in-out infinite; animation-delay:0.5s;`}
`;
const FeelsLike = styled.p`
  font-size:0.82rem; color:var(--text-muted); margin-top:4px;
  span { color:var(--primary); font-weight:500; }
`;
const WeatherIconWrap = styled.div`
  font-size:5rem; color:var(--primary); opacity:0.9;
  filter:drop-shadow(0 0 20px var(--primary-glow));
  animation:float 5s ease-in-out infinite;
`;

const Divider = styled.div`
  height:1px; margin:0 2rem;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent);
`;

// ── Info grid ──────────────────────────────────────────────
const InfoGrid = styled.div`
  display:grid; grid-template-columns:repeat(4,1fr);
  padding:1.5rem 2rem;
  @media(max-width:600px) { grid-template-columns:repeat(2,1fr); gap:1rem; }
`;
const InfoItem = styled.div`
  display:flex; flex-direction:column; align-items:center;
  gap:6px; text-align:center; padding:0.5rem; position:relative;
  &:not(:last-child)::after {
    content:''; position:absolute; right:0; top:20%; height:60%;
    width:1px; background:rgba(255,255,255,0.06);
  }
`;
const InfoIcon = styled.i`font-size:1.1rem; color:var(--primary); opacity:0.8;`;
const InfoLabel = styled.span`
  font-size:0.7rem; color:var(--text-muted); text-transform:uppercase;
  letter-spacing:0.1em; font-weight:500;
`;
const InfoValue = styled.span`
  font-size:1rem; color:var(--text); font-weight:500;
  font-family:'DM Mono',monospace;
`;

// ── Compass ────────────────────────────────────────────────
const CompassWrap = styled.div`
  position:relative; width:54px; height:54px;
`;
const CompassRing = styled.svg`
  position:absolute; inset:0; width:100%; height:100%;
  animation:${compassSpin} 8s linear infinite;
  animation-play-state:${p => p.$spinning ? 'running' : 'paused'};
`;
const CompassNeedle = styled.div`
  position:absolute; inset:0; display:flex;
  align-items:center; justify-content:center;
  transform:rotate(${p => p.$deg}deg);
  transition:transform 1.2s cubic-bezier(0.34,1.56,0.64,1);
  &::before {
    content:'';
    width:3px; height:22px; border-radius:2px;
    background:linear-gradient(180deg,#f87171 50%,rgba(56,189,248,0.6) 50%);
  }
`;
const CompassLabel = styled.span`
  position:absolute; bottom:-18px; left:50%; transform:translateX(-50%);
  font-size:0.65rem; color:var(--text-muted); font-family:'DM Mono',monospace;
  white-space:nowrap;
`;
function degToDir(d) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(d / 45) % 8];
}
function Compass({ deg }) {
  const [spinning, setSpinning] = useState(true);
  useEffect(() => { const t = setTimeout(() => setSpinning(false), 1200); return () => clearTimeout(t); }, [deg]);
  return (
    <CompassWrap>
      <CompassRing $spinning={spinning} viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="27" cy="27" r="25" stroke="rgba(56,189,248,0.15)" strokeWidth="1.5" />
        <circle cx="27" cy="27" r="25" stroke="rgba(56,189,248,0.4)" strokeWidth="1.5"
          strokeDasharray="4 12" strokeLinecap="round" />
        {['N', 'E', 'S', 'W'].map((l, i) => {
          const a = i * 90 * Math.PI / 180;
          const x = 27 + 19 * Math.sin(a), y = 27 - 19 * Math.cos(a);
          return <text key={l} x={x} y={y} textAnchor="middle" dominantBaseline="central"
            fill="rgba(56,189,248,0.5)" fontSize="6" fontFamily="DM Mono">{l}</text>;
        })}
      </CompassRing>
      <CompassNeedle $deg={deg} />
      <CompassLabel>{degToDir(deg)} {deg}°</CompassLabel>
    </CompassWrap>
  );
}

// ── Section head ───────────────────────────────────────────
const SectionHead = styled.div`
  padding:1rem 2rem 0.75rem;
  display:flex; align-items:center; gap:10px;
  h3 { font-size:0.75rem; text-transform:uppercase;
    letter-spacing:0.12em; color:var(--text-muted); font-weight:500; }
  &::after { content:''; flex:1; height:1px;
    background:linear-gradient(90deg,rgba(255,255,255,0.06),transparent); }
`;

// ── Forecast ───────────────────────────────────────────────
const ForecastScroll = styled.div`
  display:flex; overflow-x:auto; gap:10px;
  padding:0 2rem 1.5rem;
  scrollbar-width:none; &::-webkit-scrollbar { display:none; }
`;
const ForecastCard = styled.div`
  min-width:90px; flex-shrink:0; padding:1rem 0.75rem; text-align:center;
  background:rgba(255,255,255,0.03);
  border:1px solid rgba(255,255,255,0.06);
  border-radius:16px;
  transition:transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease, border-color 0.15s ease;
  transform-style:preserve-3d;
  will-change:transform;
  &:hover {
    background:rgba(56,189,248,0.06);
    border-color:rgba(56,189,248,0.2);
  }
`;
const ForecastDay = styled.div`
  font-size:0.72rem; color:var(--text-muted);
  text-transform:uppercase; letter-spacing:0.08em; margin-bottom:8px;
`;
const ForecastIcon = styled.div`font-size:1.5rem; color:var(--primary); margin:6px 0;`;
const ForecastTemp = styled.div`
  font-size:0.95rem; color:var(--text); font-weight:500;
  font-family:'DM Mono',monospace;
`;

// 3D tilt handler
function TiltCard({ children }) {
  const ref = useRef(null);
  const onMove = e => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${x * 18}deg) rotateX(${-y * 18}deg) scale(1.04)`;
    el.style.boxShadow = `${-x * 12}px ${-y * 12}px 24px rgba(56,189,248,0.12)`;
  };
  const onLeave = () => {
    const el = ref.current; if (!el) return;
    el.style.transform = '';
    el.style.boxShadow = '';
  };
  return <ForecastCard ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}>{children}</ForecastCard>;
}

// ── Sun row ────────────────────────────────────────────────
const SunRow = styled.div`
  display:flex; justify-content:center; gap:3rem;
  padding:1rem 2rem 2rem; align-items:center;
`;
const SunItem = styled.div`
  display:flex; align-items:center; gap:10px;
  i { font-size:1.2rem; color:var(--gold); }
  div { display:flex; flex-direction:column; }
  span:first-child { font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.08em; }
  span:last-child { font-size:0.95rem; color:var(--text); font-weight:500; font-family:'DM Mono',monospace; }
`;
const SunSep = styled.div`width:1px; height:32px; background:rgba(255,255,255,0.07);`;

// ── Icon map ───────────────────────────────────────────────
const iconMap = {
  '01d': 'sun', '01n': 'moon', '02d': 'cloud-sun', '02n': 'cloud-moon',
  '03d': 'cloud', '03n': 'cloud', '04d': 'cloud', '04n': 'cloud',
  '09d': 'cloud-showers-heavy', '09n': 'cloud-showers-heavy',
  '10d': 'cloud-sun-rain', '10n': 'cloud-moon-rain',
  '11d': 'bolt', '11n': 'bolt', '13d': 'snowflake', '13n': 'snowflake',
  '50d': 'smog', '50n': 'smog',
};
const nightIcons = new Set(['01n', '02n', '03n', '04n', '09n', '10n', '11n', '13n', '50n']);
const coldIcons = new Set(['13d', '13n', '01n', '02n']);

// ── Component ──────────────────────────────────────────────
export default function WeatherCard({ data, units, onUnitsChange }) {
  const ico = ic => iconMap[ic] || 'cloud';
  const u = units === 'metric' ? '°C' : '°F';
  const ws = units === 'metric' ? 'm/s' : 'mph';
  const isNight = nightIcons.has(data.icon);
  const showAurora = coldIcons.has(data.icon);

  return (
    <>
      {/* Aurora overlay */}
      <Aurora $active={showAurora}>
        <AuroraLayer $top={-10} $color="linear-gradient(180deg,rgba(52,211,153,0.18),transparent)" $dur={9} $delay={0} />
        <AuroraLayer $top={5} $color="linear-gradient(180deg,rgba(129,140,248,0.14),transparent)" $dur={13} $delay={-4} />
        <AuroraLayer $top={15} $color="linear-gradient(180deg,rgba(56,189,248,0.10),transparent)" $dur={11} $delay={-7} />
      </Aurora>

      <Card>
        {/* Top */}
        <TopBar>
          <div>
            <CityName $night={isNight}>{data.city}</CityName>
            <CountryDate>
              <span>{data.country}</span>
              <span>{formatDate(data.date)}</span>
            </CountryDate>
          </div>
          <UnitToggle>
            <UnitBtn $active={units === 'metric'} onClick={() => onUnitsChange('metric')}>°C</UnitBtn>
            <UnitBtn $active={units === 'imperial'} onClick={() => onUnitsChange('imperial')}>°F</UnitBtn>
          </UnitToggle>
        </TopBar>

        {/* Hero */}
        <HeroSection>
          <TempBlock>
            <SlotTemp value={data.temperature} unit={u} />
            <Description $night={isNight}>{data.description}</Description>
            <FeelsLike>Feels like <span>{Math.round(data.feelsLike)}{u}</span></FeelsLike>
          </TempBlock>
          <WeatherIconWrap>
            <i className={`fas fa-${ico(data.icon)}`} />
          </WeatherIconWrap>
        </HeroSection>

        <Divider />

        {/* Info grid — wind item replaced with compass */}
        <InfoGrid>
          <InfoItem>
            <div style={{ marginBottom: 22 }}>
              <Compass deg={data.windDeg ?? 0} />
            </div>
            <InfoLabel>Wind {data.windSpeed} {ws}</InfoLabel>
          </InfoItem>
          <InfoItem>
            <InfoIcon className="fas fa-droplet" />
            <InfoLabel>Humidity</InfoLabel>
            <InfoValue>{data.humidity}%</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoIcon className="fas fa-gauge" />
            <InfoLabel>Pressure</InfoLabel>
            <InfoValue>{data.pressure}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoIcon className="fas fa-eye" />
            <InfoLabel>Visibility</InfoLabel>
            <InfoValue>{data.visibility ? `${(data.visibility / 1000).toFixed(1)}km` : 'N/A'}</InfoValue>
          </InfoItem>
        </InfoGrid>

        <Divider />

        {/* Forecast */}
        <SectionHead><h3>5-Day Forecast</h3></SectionHead>
        <ForecastScroll>
          {data.forecast.map((day, i) => (
            <TiltCard key={i}>
              <ForecastDay>{formatDate(day.date, 'short')}</ForecastDay>
              <ForecastIcon><i className={`fas fa-${ico(day.icon)}`} /></ForecastIcon>
              <ForecastTemp>{Math.round(day.temperature)}{u}</ForecastTemp>
            </TiltCard>
          ))}
        </ForecastScroll>

        <Divider />

        {/* Sun cycle */}
        <SectionHead><h3>Sun Cycle</h3></SectionHead>
        <SunRow>
          <SunItem>
            <i className="fas fa-sunrise" />
            <div><span>Sunrise</span><span>{data.sunrise}</span></div>
          </SunItem>
          <SunSep />
          <SunItem>
            <i className="fas fa-sunset" />
            <div><span>Sunset</span><span>{data.sunset}</span></div>
          </SunItem>
        </SunRow>
      </Card>
    </>
  );
}