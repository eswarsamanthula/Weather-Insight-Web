import { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { formatDate } from '../utils/dateUtils';

// ── Keyframes ──
const fadeUp = keyframes`from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}`;
const neonPulse = keyframes`
  0%,100%{text-shadow:0 0 8px rgba(56,189,248,0.5),0 0 20px rgba(56,189,248,0.3)}
  50%{text-shadow:0 0 18px rgba(56,189,248,0.9),0 0 40px rgba(129,140,248,0.5)}
`;
const auroraMove = keyframes`
  0%,100%{transform:scaleX(1) scaleY(1) translateX(0);opacity:0.25}
  33%{transform:scaleX(1.15) scaleY(1.3) translateX(3%);opacity:0.45}
  66%{transform:scaleX(0.9) scaleY(0.8) translateX(-3%);opacity:0.3}
`;
const barGrow = keyframes`from{width:0}to{width:var(--w)}`;
const compassSpin = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`;

// ── Aurora ──
const Aurora = styled.div`
  position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden;
  opacity:0;transition:opacity 1.5s ease;
  ${p => p.$active && css`opacity:1;`}
`;
const AuroraLayer = styled.div`
  position:absolute;width:180%;height:60%;top:${p => p.$top}%;left:-40%;
  background:${p => p.$color};border-radius:50%;filter:blur(60px);
  animation:${auroraMove} ${p => p.$dur}s ease-in-out infinite;
  animation-delay:${p => p.$delay}s;
`;

// ── Card ──
const Card = styled.div`
  background:rgba(10,16,30,0.72);border-radius:24px;
  border:1px solid rgba(255,255,255,0.07);backdrop-filter:blur(32px);overflow:hidden;
  animation:${fadeUp} 0.6s var(--ease) both;animation-delay:0.25s;
  box-shadow:0 24px 80px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.06);
`;
const TopBar = styled.div`display:flex;justify-content:space-between;align-items:flex-start;padding:2rem 2rem 0;`;
const CityName = styled.h2`
  font-family:'Bebas Neue',sans-serif;font-size:3rem;letter-spacing:0.05em;
  color:var(--text);line-height:1;
  ${p => p.$night && css`animation:${neonPulse} 3s ease-in-out infinite;`}
`;
const CountryDate = styled.div`
  margin-top:6px;
  span{display:block;font-size:0.85rem;color:var(--text-muted);}
`;
const UnitToggle = styled.div`
  display:flex;align-items:center;background:rgba(255,255,255,0.04);
  border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:3px;
`;
const UnitBtn = styled.button`
  background:${p => p.$active ? 'rgba(56,189,248,0.2)' : 'transparent'};
  color:${p => p.$active ? 'var(--primary)' : 'var(--text-muted)'};
  border:none;padding:6px 14px;border-radius:8px;cursor:pointer;
  font-family:'DM Sans',sans-serif;font-size:0.85rem;font-weight:500;
  transition:all 0.25s ease;&:hover{color:var(--primary);}
`;

// ── Hero ──
const HeroSection = styled.div`
  display:flex;align-items:center;justify-content:space-between;padding:1.5rem 2rem 1rem;
`;
const TempBlock = styled.div``;
const SlotWrap = styled.div`overflow:hidden;height:8rem;display:flex;align-items:center;`;
const SlotDigit = styled.span`
  font-family:'Bebas Neue',sans-serif;font-size:7rem;line-height:1;
  background:linear-gradient(135deg,#e2e8f0 30%,var(--primary) 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  display:inline-block;
  animation:${fadeUp} 0.4s var(--ease) both;
  animation-delay:${p => p.$i * 0.06}s;
`;
function SlotTemp({ value, unit }) {
  const str = `${Math.round(value)}${unit}`;
  return <SlotWrap>{str.split('').map((ch, i) => <SlotDigit key={`${ch}-${i}-${value}`} $i={i}>{ch}</SlotDigit>)}</SlotWrap>;
}
const Description = styled.p`
  font-size:1rem;color:var(--text-muted);text-transform:capitalize;
  font-weight:400;margin-top:4px;letter-spacing:0.02em;
  ${p => p.$night && css`animation:${neonPulse} 4s ease-in-out infinite;animation-delay:0.5s;`}
`;
const WeatherIconWrap = styled.div`
  font-size:5rem;color:var(--primary);opacity:0.9;
  filter:drop-shadow(0 0 20px var(--primary-glow));animation:float 5s ease-in-out infinite;
`;
const Divider = styled.div`
  height:1px;margin:0 2rem;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent);
`;

// ── Feels-like bar ──
const FeelsSection = styled.div`padding:1.25rem 2rem;`;
const FeelsRow = styled.div`display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;`;
const FeelsLabel = styled.span`font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.1em;`;
const FeelsVals = styled.span`font-size:0.8rem;color:var(--text-muted);font-family:'DM Mono',monospace;`;
const BarTrack = styled.div`
  position:relative;height:6px;background:rgba(255,255,255,0.06);border-radius:6px;overflow:visible;
`;
const BarFill = styled.div`
  height:100%;border-radius:6px;position:absolute;left:0;
  background:linear-gradient(90deg,var(--primary),var(--accent));
  --w:${p => p.$pct}%;
  animation:${barGrow} 1s cubic-bezier(0.34,1.56,0.64,1) both;
  animation-delay:0.5s;
`;
const BarMarker = styled.div`
  position:absolute;top:-3px;width:12px;height:12px;border-radius:50%;
  background:${p => p.$color};border:2px solid rgba(10,16,30,0.8);
  left:${p => p.$pct}%;transform:translateX(-50%);
  box-shadow:0 0 8px ${p => p.$color};
`;
const BarLegend = styled.div`
  display:flex;justify-content:space-between;margin-top:8px;
`;
const LegendItem = styled.div`
  display:flex;align-items:center;gap:5px;
  span:first-child{width:8px;height:8px;border-radius:50%;background:${p => p.$color};display:inline-block;}
  span:last-child{font-size:0.68rem;color:var(--text-muted);}
`;

function FeelsBar({ actual, feels, unit }) {
  // Map both onto 0-100 scale relative to each other ± 15 buffer
  const min = Math.min(actual, feels) - 8;
  const max = Math.max(actual, feels) + 8;
  const range = max - min || 1;
  const actualPct = ((actual - min) / range) * 100;
  const feelsPct = ((feels - min) / range) * 100;
  const fillPct = Math.min(actualPct, feelsPct);
  const fillWidth = Math.abs(actualPct - feelsPct);
  const diff = Math.round(feels - actual);
  const label = diff === 0 ? 'Same as actual' : diff > 0 ? `Feels ${diff}° warmer` : `Feels ${Math.abs(diff)}° cooler`;
  return (
    <FeelsSection>
      <FeelsRow>
        <FeelsLabel>Feels-like vs Actual</FeelsLabel>
        <FeelsVals>{label}</FeelsVals>
      </FeelsRow>
      <BarTrack>
        <BarFill $pct={fillPct + fillWidth} style={{ left: `${fillPct}%`, width: `${fillWidth}%` }} />
        <BarMarker $pct={actualPct} $color="var(--primary)" />
        <BarMarker $pct={feelsPct} $color="var(--accent)" />
      </BarTrack>
      <BarLegend>
        <LegendItem $color="var(--primary)">
          <span /><span>Actual {Math.round(actual)}{unit}</span>
        </LegendItem>
        <LegendItem $color="var(--accent)">
          <span /><span>Feels {Math.round(feels)}{unit}</span>
        </LegendItem>
      </BarLegend>
    </FeelsSection>
  );
}

// ── Info grid ──
const InfoGrid = styled.div`
  display:grid;grid-template-columns:repeat(4,1fr);padding:1.5rem 2rem;
  @media(max-width:600px){grid-template-columns:repeat(2,1fr);gap:1rem;}
`;
const InfoItem = styled.div`
  display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center;
  padding:0.5rem;position:relative;
  &:not(:last-child)::after{content:'';position:absolute;right:0;top:20%;height:60%;
  width:1px;background:rgba(255,255,255,0.06);}
`;
const InfoIcon = styled.i`font-size:1.1rem;color:var(--primary);opacity:0.8;`;
const InfoLabel = styled.span`font-size:0.7rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.1em;font-weight:500;`;
const InfoValue = styled.span`font-size:1rem;color:var(--text);font-weight:500;font-family:'DM Mono',monospace;`;

// ── Compass ──
const CompassWrap = styled.div`position:relative;width:54px;height:54px;`;
const CompassRing = styled.svg`position:absolute;inset:0;width:100%;height:100%;
  animation:${compassSpin} 8s linear infinite;
  animation-play-state:${p => p.$spinning ? 'running' : 'paused'};`;
const CompassNeedle = styled.div`
  position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  transform:rotate(${p => p.$deg}deg);transition:transform 1.2s cubic-bezier(0.34,1.56,0.64,1);
  &::before{content:'';width:3px;height:22px;border-radius:2px;
  background:linear-gradient(180deg,#f87171 50%,rgba(56,189,248,0.6) 50%);}
`;
const CompassLabel = styled.span`
  position:absolute;bottom:-18px;left:50%;transform:translateX(-50%);
  font-size:0.65rem;color:var(--text-muted);font-family:'DM Mono',monospace;white-space:nowrap;
`;
function degToDir(d) { return ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(d / 45) % 8]; }
function Compass({ deg }) {
  const [spinning, setSpinning] = useState(true);
  useEffect(() => { const t = setTimeout(() => setSpinning(false), 1200); return () => clearTimeout(t); }, [deg]);
  return (
    <CompassWrap>
      <CompassRing $spinning={spinning} viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="27" cy="27" r="25" stroke="rgba(56,189,248,0.15)" strokeWidth="1.5" />
        <circle cx="27" cy="27" r="25" stroke="rgba(56,189,248,0.4)" strokeWidth="1.5" strokeDasharray="4 12" strokeLinecap="round" />
        {['N', 'E', 'S', 'W'].map((l, i) => {
          const a = i * 90 * Math.PI / 180;
          return <text key={l} x={27 + 19 * Math.sin(a)} y={27 - 19 * Math.cos(a)} textAnchor="middle" dominantBaseline="central" fill="rgba(56,189,248,0.5)" fontSize="6" fontFamily="DM Mono">{l}</text>;
        })}
      </CompassRing>
      <CompassNeedle $deg={deg} />
      <CompassLabel>{degToDir(deg)} {deg}°</CompassLabel>
    </CompassWrap>
  );
}

// ── Section head ──
const SectionHead = styled.div`
  padding:1rem 2rem 0.75rem;display:flex;align-items:center;gap:10px;
  h3{font-size:0.75rem;text-transform:uppercase;letter-spacing:0.12em;color:var(--text-muted);font-weight:500;}
  &::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,rgba(255,255,255,0.06),transparent);}
`;

// ── Hourly chart ──
const ChartWrap = styled.div`padding:0 2rem 1.5rem;`;
function HourlyChart({ forecast, units }) {
  const u = units === 'metric' ? '°C' : '°F';
  // Generate ~8 fake hourly points from forecast data
  const points = forecast.slice(0, 4).flatMap((d, i) => [
    { label: `${(6 + i * 6) % 24}:00`, temp: d.temperature + (Math.random() * 3 - 1.5) },
    { label: `${(9 + i * 6) % 24}:00`, temp: d.temperature + (Math.random() * 3 - 1.5) },
  ]).slice(0, 8);
  const temps = points.map(p => p.temp);
  const min = Math.min(...temps) - 2;
  const max = Math.max(...temps) + 2;
  const W = 680, H = 90, pad = 30;
  const xStep = (W - pad * 2) / (points.length - 1);
  const yScale = t => H - ((t - min) / (max - min)) * (H - 20) - 10;
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${pad + i * xStep} ${yScale(p.temp)}`).join(' ');
  // Smooth curve with cubic bezier
  const smooth = points.map((p, i, arr) => {
    if (i === 0) return `M ${pad} ${yScale(p.temp)}`;
    const prev = arr[i - 1];
    const cpx1 = pad + (i - 1) * xStep + xStep / 3;
    const cpx2 = pad + i * xStep - xStep / 3;
    return `C ${cpx1} ${yScale(prev.temp)} ${cpx2} ${yScale(p.temp)} ${pad + i * xStep} ${yScale(p.temp)}`;
  }).join(' ');
  const areaD = smooth + ` L ${pad + (points.length - 1) * xStep} ${H} L ${pad} ${H} Z`;

  return (
    <ChartWrap>
      <svg viewBox={`0 0 ${W} ${H + 30}`} style={{ width: '100%', overflow: 'visible' }}>
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(56,189,248,0.25)" />
            <stop offset="100%" stopColor="rgba(56,189,248,0)" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((f, i) => (
          <line key={i} x1={pad} y1={10 + f * (H - 20)} x2={W - pad} y2={10 + f * (H - 20)}
            stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}
        {/* Area fill */}
        <path d={areaD} fill="url(#chartGrad)" />
        {/* Line */}
        <path d={smooth} fill="none" stroke="rgba(56,189,248,0.7)" strokeWidth="2" strokeLinecap="round" />
        {/* Dots + labels */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={pad + i * xStep} cy={yScale(p.temp)} r="3"
              fill="var(--primary)" stroke="rgba(10,16,30,0.8)" strokeWidth="1.5" />
            <text x={pad + i * xStep} y={yScale(p.temp) - 10} textAnchor="middle"
              fill="rgba(226,232,240,0.7)" fontSize="9" fontFamily="DM Mono">
              {Math.round(p.temp)}{u}
            </text>
            <text x={pad + i * xStep} y={H + 20} textAnchor="middle"
              fill="rgba(100,116,139,0.8)" fontSize="9" fontFamily="DM Mono">
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </ChartWrap>
  );
}

// ── Forecast ──
const ForecastScroll = styled.div`
  display:flex;overflow-x:auto;gap:10px;padding:0 2rem 1.5rem;
  scrollbar-width:none;&::-webkit-scrollbar{display:none;}
`;
const ForecastCard = styled.div`
  min-width:90px;flex-shrink:0;padding:1rem 0.75rem;text-align:center;
  background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);
  border-radius:16px;transition:transform 0.15s ease,box-shadow 0.15s ease,background 0.15s ease,border-color 0.15s ease;
  transform-style:preserve-3d;will-change:transform;
  &:hover{background:rgba(56,189,248,0.06);border-color:rgba(56,189,248,0.2);}
`;
const ForecastDay = styled.div`font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;`;
const ForecastIcon = styled.div`font-size:1.5rem;color:var(--primary);margin:6px 0;`;
const ForecastTemp = styled.div`font-size:0.95rem;color:var(--text);font-weight:500;font-family:'DM Mono',monospace;`;

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
  const onLeave = () => { const el = ref.current; if (!el) return; el.style.transform = ''; el.style.boxShadow = ''; };
  return <ForecastCard ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}>{children}</ForecastCard>;
}

// ── Sun row ──
const SunRow = styled.div`display:flex;justify-content:center;gap:3rem;padding:1rem 2rem 2rem;align-items:center;`;
const SunItem = styled.div`
  display:flex;align-items:center;gap:10px;
  i{font-size:1.2rem;color:var(--gold);}
  div{display:flex;flex-direction:column;}
  span:first-child{font-size:0.7rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;}
  span:last-child{font-size:0.95rem;color:var(--text);font-weight:500;font-family:'DM Mono',monospace;}
`;
const SunSep = styled.div`width:1px;height:32px;background:rgba(255,255,255,0.07);`;

const iconMap = {
  '01d': 'sun', '01n': 'moon', '02d': 'cloud-sun', '02n': 'cloud-moon',
  '03d': 'cloud', '03n': 'cloud', '04d': 'cloud', '04n': 'cloud',
  '09d': 'cloud-showers-heavy', '09n': 'cloud-showers-heavy',
  '10d': 'cloud-sun-rain', '10n': 'cloud-moon-rain',
  '11d': 'bolt', '11n': 'bolt', '13d': 'snowflake', '13n': 'snowflake',
  '50d': 'smog', '50n': 'smog',
};
const nightSet = new Set(['01n', '02n', '03n', '04n', '09n', '10n', '11n', '13n', '50n']);
const coldSet = new Set(['13d', '13n', '01n', '02n']);

export default function WeatherCard({ data, units, onUnitsChange }) {
  const ico = ic => iconMap[ic] || 'cloud';
  const u = units === 'metric' ? '°C' : '°F';
  const ws = units === 'metric' ? 'm/s' : 'mph';
  const isNight = nightSet.has(data.icon);
  const showAurora = coldSet.has(data.icon);

  return (
    <>
      <Aurora $active={showAurora}>
        <AuroraLayer $top={-10} $color="linear-gradient(180deg,rgba(52,211,153,0.18),transparent)" $dur={9} $delay={0} />
        <AuroraLayer $top={5} $color="linear-gradient(180deg,rgba(129,140,248,0.14),transparent)" $dur={13} $delay={-4} />
        <AuroraLayer $top={15} $color="linear-gradient(180deg,rgba(56,189,248,0.10),transparent)" $dur={11} $delay={-7} />
      </Aurora>

      <Card>
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

        <HeroSection>
          <TempBlock>
            <SlotTemp value={data.temperature} unit={u} />
            <Description $night={isNight}>{data.description}</Description>
          </TempBlock>
          <WeatherIconWrap><i className={`fas fa-${ico(data.icon)}`} /></WeatherIconWrap>
        </HeroSection>

        <Divider />
        <FeelsBar actual={data.temperature} feels={data.feelsLike} unit={u} />
        <Divider />

        <InfoGrid>
          <InfoItem>
            <div style={{ marginBottom: 22 }}><Compass deg={data.windDeg ?? 0} /></div>
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
        <SectionHead><h3>Hourly Trend</h3></SectionHead>
        <HourlyChart forecast={data.forecast} units={units} />

        <Divider />
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