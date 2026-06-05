import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const BG = styled.div`
  position:fixed; inset:0; z-index:-1; overflow:hidden;
  transition:background 2.5s ease;
  background:${p => p.$bg};
`;

const gradients = {
  '01d': 'linear-gradient(180deg, #0a2540 0%, #0d3b6e 30%, #1a5c9e 60%, #0a2540 100%)',
  '01n': 'linear-gradient(180deg, #01040f 0%, #020820 40%, #050d2e 70%, #010308 100%)',
  '02d': 'linear-gradient(180deg, #0c2340 0%, #133255 40%, #1a4a7a 70%, #0c2340 100%)',
  '02n': 'linear-gradient(180deg, #02050f 0%, #040a20 40%, #060d28 70%, #020408 100%)',
  '03d': 'linear-gradient(180deg, #0d1f35 0%, #142840 50%, #1a3050 100%)',
  '03n': 'linear-gradient(180deg, #050810 0%, #08101e 50%, #050810 100%)',
  '04d': 'linear-gradient(180deg, #0a1520 0%, #111e2e 50%, #0a1520 100%)',
  '04n': 'linear-gradient(180deg, #040608 0%, #07090f 50%, #040608 100%)',
  '09d': 'linear-gradient(180deg, #060e18 0%, #0a1525 40%, #081220 100%)',
  '09n': 'linear-gradient(180deg, #020508 0%, #040a10 50%, #020508 100%)',
  '10d': 'linear-gradient(180deg, #070f1a 0%, #0c1828 40%, #091520 100%)',
  '10n': 'linear-gradient(180deg, #020508 0%, #040a12 50%, #020508 100%)',
  '11d': 'linear-gradient(180deg, #04040e 0%, #080818 40%, #04040e 100%)',
  '11n': 'linear-gradient(180deg, #020208 0%, #050510 50%, #020208 100%)',
  '13d': 'linear-gradient(180deg, #0d1828 0%, #152235 40%, #1a2e48 70%, #0d1828 100%)',
  '13n': 'linear-gradient(180deg, #050810 0%, #080e1c 50%, #050810 100%)',
  '50d': 'linear-gradient(180deg, #0c1420 0%, #111c28 50%, #0c1420 100%)',
  '50n': 'linear-gradient(180deg, #050810 0%, #080d16 50%, #050810 100%)',
  default: 'linear-gradient(180deg, #0a2540 0%, #0d3b6e 30%, #1a5c9e 60%, #0a2540 100%)',
};

const typeMap = {
  '01d': 'sunny',       '01n': 'night',
  '02d': 'partly',      '02n': 'partly-night',
  '03d': 'cloudy',      '03n': 'cloudy-night',
  '04d': 'overcast',    '04n': 'overcast-night',
  '09d': 'heavy-rain',  '09n': 'heavy-rain',
  '10d': 'rain',        '10n': 'rain',
  '11d': 'storm',       '11n': 'storm',
  '13d': 'snow',        '13n': 'snow',
  '50d': 'mist',        '50n': 'mist',
};

export default function WeatherBackground({ weatherData }) {
  const ref         = useRef(null);
  const parallaxRef = useRef(null);

  const temp = weatherData?.temperature ?? 20;
  const icon = weatherData?.icon || 'default';
  const type = typeMap[icon] || 'sunny';

  const isNight   = icon.endsWith('n');
  const isRainy   = ['rain','heavy-rain','storm'].includes(type);

  // Parallax mouse
  useEffect(() => {
    const el = parallaxRef.current;
    if (!el) return;
    const onMove = e => {
      const mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      const my = (e.clientY / window.innerHeight - 0.5) * 2;
      el.querySelectorAll('[data-depth]').forEach(l => {
        const d = parseFloat(l.dataset.depth);
        l.style.transform = `translate(${mx*d*18}px,${my*d*10}px)`;
      });
    };
    window.addEventListener('mousemove', onMove, { passive:true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    c.innerHTML = '';

    // ── SUN — top left, all day icons including cloudy/overcast ──
    if (!isNight) {
      const t         = Math.min(Math.max(temp, -5), 45);
      const intensity = (t + 5) / 50; // 0 → 1
      const discSize  = 55 + intensity * 55;   // 55–110px
      const glowSize  = 180 + intensity * 220; // 180–400px
      const numRays   = Math.round(6 + intensity * 6);
      const rayLen    = 25 + intensity * 65;

      const discColor = temp > 35 ? '#ffaa44' : temp > 25 ? '#ffe066' : '#fff5c0';
      const glowR     = temp > 35 ? '255,120,30' : temp > 25 ? '255,200,60' : '255,230,130';
      const glowOpa   = 0.15 + intensity * 0.35;

      const SX = 90, SY = 90; // anchor point top-left

      // Outer atmosphere glow
      const glow = document.createElement('div');
      glow.style.cssText = `
        position:absolute;
        top:${SY - glowSize/2}px; left:${SX - glowSize/2}px;
        width:${glowSize}px; height:${glowSize}px;
        background:radial-gradient(circle,
          rgba(${glowR},${glowOpa}) 0%,
          rgba(${glowR},${glowOpa*0.35}) 45%,
          transparent 72%);
        border-radius:50%;
        animation:float 12s ease-in-out infinite;
        pointer-events:none;
      `;
      c.appendChild(glow);

      // Sun disc
      const disc = document.createElement('div');
      disc.style.cssText = `
        position:absolute;
        top:${SY - discSize/2}px; left:${SX - discSize/2}px;
        width:${discSize}px; height:${discSize}px;
        background:radial-gradient(circle at 38% 38%,
          #fff8e0 0%, ${discColor} 55%,
          ${temp>30?'#ff8800':'#ffcc33'} 100%);
        border-radius:50%;
        opacity:${0.6 + intensity*0.4};
        box-shadow:
          0 0 ${18+intensity*35}px rgba(${glowR},0.7),
          0 0 ${35+intensity*70}px rgba(${glowR},0.35);
        animation:float 10s ease-in-out infinite;
        pointer-events:none;
      `;
      c.appendChild(disc);

      // SVG rays
      const svgW = SX*2 + rayLen + 30;
      const svgH = SY*2 + rayLen + 30;
      const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
      svg.setAttribute('viewBox',`0 0 ${svgW} ${svgH}`);
      svg.style.cssText = `
        position:absolute; top:0; left:0;
        width:${svgW}px; height:${svgH}px;
        opacity:${0.28 + intensity*0.52};
        animation:float 10s ease-in-out infinite;
        pointer-events:none;
      `;
      for (let i = 0; i < numRays; i++) {
        const angle = (i / numRays) * Math.PI * 2;
        const r1 = discSize/2 + 10;
        const r2 = r1 + rayLen;
        const line = document.createElementNS('http://www.w3.org/2000/svg','line');
        line.setAttribute('x1', SX + r1*Math.cos(angle));
        line.setAttribute('y1', SY + r1*Math.sin(angle));
        line.setAttribute('x2', SX + r2*Math.cos(angle));
        line.setAttribute('y2', SY + r2*Math.sin(angle));
        line.setAttribute('stroke', temp>30?'#ffaa40':'#ffe566');
        line.setAttribute('stroke-width', 1.5 + intensity*2.5);
        line.setAttribute('stroke-linecap','round');
        line.setAttribute('opacity', 0.5 + intensity*0.5);
        svg.appendChild(line);
      }
      c.appendChild(svg);

      // Heat shimmer at bottom for hot days
      if (temp > 30) {
        const heat = document.createElement('div');
        heat.style.cssText = `
          position:absolute; bottom:0; left:0; right:0; height:18%;
          background:linear-gradient(0deg,
            rgba(255,140,30,${(temp-30)*0.006}), transparent);
          filter:blur(14px); pointer-events:none;
        `;
        c.appendChild(heat);
      }
    }

    // ── MOON — top right, ALL night icons ──
    if (isNight) {
      const moon = document.createElement('div');
      moon.style.cssText = `
        position:absolute; top:40px; right:80px;
        width:88px; height:88px;
        background:radial-gradient(circle at 35% 35%,
          #e8edf5 0%, #b8c4d4 55%, transparent 70%);
        border-radius:50%;
        box-shadow:
          0 0 50px rgba(200,220,255,0.18),
          0 0 20px rgba(180,200,255,0.12);
        pointer-events:none;
      `;
      c.appendChild(moon);
      const mg = document.createElement('div');
      mg.style.cssText = `
        position:absolute; top:-10px; right:30px;
        width:190px; height:190px;
        background:radial-gradient(circle,rgba(180,200,255,0.07),transparent 68%);
        border-radius:50%; pointer-events:none;
      `;
      c.appendChild(mg);
    }

    // ── STARS — clear/partly/cloudy night ──
    if (isNight && !isRainy) {
      [[180,'0.2'],[80,'0.5'],[40,'0.9']].forEach(([count, depth]) => {
        const layer = document.createElement('div');
        layer.dataset.depth = depth;
        layer.style.cssText = `position:absolute;inset:0;transition:transform 0.1s ease;`;
        for (let i = 0; i < count; i++) {
          const s   = document.createElement('div');
          const sz  = depth==='0.9' ? Math.random()*1.5+0.5 : Math.random()*2+0.5;
          s.style.cssText = `
            position:absolute;
            left:${Math.random()*100}%; top:${Math.random()*80}%;
            width:${sz}px; height:${sz}px;
            background:white; border-radius:50%;
            animation:star-twinkle ${1.5+Math.random()*4}s ease-in-out infinite;
            animation-delay:${Math.random()*5}s;
          `;
          layer.appendChild(s);
        }
        c.appendChild(layer);
      });
    }

    // ── CLOUDS — partly/cloudy/overcast ──
    if (['partly','cloudy','cloudy-night','overcast','overcast-night'].includes(type)) {
      const count   = type.includes('overcast') ? 9 : 5;
      const opacity = type.includes('overcast') ? 0.12 : 0.07;
      for (let i = 0; i < count; i++) {
        const layer = document.createElement('div');
        layer.dataset.depth = (i%3===0)?'0.3':(i%3===1)?'0.6':'1.0';
        layer.style.cssText = `position:absolute;inset:0;transition:transform 0.15s ease;`;
        const cl  = document.createElement('div');
        const sz  = 120 + Math.random()*180;
        const dur = 35  + Math.random()*30;
        cl.style.cssText = `
          position:absolute; top:${Math.random()*40}%; left:-300px;
          width:${sz}px; height:${sz*0.45}px;
          background:rgba(148,163,184,${opacity+Math.random()*0.04});
          border-radius:80px; filter:blur(${3+Math.random()*5}px);
          animation:cloud-move ${dur}s linear infinite;
          animation-delay:-${Math.random()*dur}s;
        `;
        layer.appendChild(cl);
        c.appendChild(layer);
      }
    }

    // ── RAIN ──
    if (isRainy && type !== 'storm') {
      const count = type==='heavy-rain' ? 130 : 85;
      const mass  = document.createElement('div');
      mass.style.cssText = `
        position:absolute; top:-60px; left:-10%; width:120%; height:200px;
        background:rgba(20,35,55,0.5); filter:blur(30px); border-radius:50%;
      `;
      c.appendChild(mass);
      for (let i = 0; i < count; i++) {
        const d   = document.createElement('div');
        const dur = 0.5 + Math.random()*0.6;
        const len = type==='heavy-rain' ? 14+Math.random()*14 : 10+Math.random()*10;
        d.style.cssText = `
          position:absolute; left:${Math.random()*105}%; top:-40px;
          width:${type==='heavy-rain'?'2px':'1.5px'}; height:${len}px;
          background:linear-gradient(180deg,transparent,
            rgba(147,197,253,${type==='heavy-rain'?'0.75':'0.55'}));
          border-radius:1px;
          animation:rain-fall ${dur}s linear infinite;
          animation-delay:-${Math.random()*2.5}s;
        `;
        c.appendChild(d);
      }
    }

    // ── STORM ──
    if (type === 'storm') {
      const mass = document.createElement('div');
      mass.style.cssText = `
        position:absolute; top:-80px; left:-10%; width:120%; height:280px;
        background:rgba(10,8,25,0.7); filter:blur(40px); border-radius:50%;
      `;
      c.appendChild(mass);
      for (let i = 0; i < 100; i++) {
        const d = document.createElement('div');
        d.style.cssText = `
          position:absolute; left:${Math.random()*105}%; top:-40px;
          width:1.5px; height:${12+Math.random()*10}px;
          background:rgba(147,197,253,0.45);
          animation:rain-fall ${0.45+Math.random()*0.5}s linear infinite;
          animation-delay:-${Math.random()*2}s;
        `;
        c.appendChild(d);
      }
      [3.5,6.2].forEach(dur => {
        const fl = document.createElement('div');
        fl.style.cssText = `
          position:absolute; inset:0;
          background:rgba(129,140,248,0.07);
          animation:lightning-flash ${dur}s linear infinite;
          animation-delay:-${Math.random()*dur}s;
        `;
        c.appendChild(fl);
      });
    }

    // ── SNOW ──
    if (type === 'snow') {
      const over = document.createElement('div');
      over.style.cssText = `
        position:absolute; top:-40px; left:-10%; width:120%; height:200px;
        background:rgba(20,35,60,0.35); filter:blur(25px); border-radius:50%;
      `;
      c.appendChild(over);
      for (let i = 0; i < 90; i++) {
        const f  = document.createElement('div');
        const sz = 2 + Math.random()*6;
        f.style.cssText = `
          position:absolute; left:${Math.random()*105}%; top:-20px;
          width:${sz}px; height:${sz}px;
          background:rgba(224,242,254,${0.7+Math.random()*0.25});
          border-radius:${Math.random()>0.5?'50%':'2px'};
          filter:blur(${Math.random()*0.8}px);
          animation:snow-drift ${5+Math.random()*8}s linear infinite;
          animation-delay:-${Math.random()*12}s;
        `;
        c.appendChild(f);
      }
    }

    // ── MIST ──
    if (type === 'mist') {
      for (let i = 0; i < 14; i++) {
        const layer = document.createElement('div');
        layer.dataset.depth = i%3===0?'0.2':i%3===1?'0.5':'0.8';
        layer.style.cssText = `position:absolute;inset:0;transition:transform 0.2s ease;`;
        const m = document.createElement('div');
        m.style.cssText = `
          position:absolute; top:${5+i*7}%; left:-250px;
          width:${200+Math.random()*300}px; height:${20+Math.random()*40}px;
          background:rgba(148,163,184,${0.05+(i/14)*0.07});
          border-radius:60px; filter:blur(${12+Math.random()*10}px);
          animation:cloud-move ${25+Math.random()*20}s linear infinite;
          animation-delay:-${Math.random()*30}s;
        `;
        layer.appendChild(m);
        c.appendChild(layer);
      }
    }

  }, [icon, type, isNight, isRainy, temp]);

  return (
    <BG $bg={gradients[icon] || gradients.default}>
      <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at center,transparent 40%,rgba(0,0,0,0.55) 100%)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',bottom:0,left:0,right:0,height:'40%',background:'linear-gradient(0deg,rgba(0,0,0,0.3),transparent)',pointerEvents:'none'}}/>
      <div ref={parallaxRef} style={{position:'absolute',inset:0,pointerEvents:'none'}}>
        <div ref={ref} style={{position:'absolute',inset:0}}/>
      </div>
    </BG>
  );
}