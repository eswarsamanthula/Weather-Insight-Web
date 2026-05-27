import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const BG = styled.div`
  position:fixed; inset:0; z-index:-1; overflow:hidden;
  transition:background 2.5s ease;
  background:${p => p.$bg};
`;

// Richer, more realistic gradients per condition
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
  '01d': 'sunny', '01n': 'night', '02d': 'partly', '02n': 'partly-night',
  '03d': 'cloudy', '03n': 'cloudy-night', '04d': 'overcast', '04n': 'overcast',
  '09d': 'heavy-rain', '09n': 'heavy-rain', '10d': 'rain', '10n': 'rain',
  '11d': 'storm', '11n': 'storm', '13d': 'snow', '13n': 'snow',
  '50d': 'mist', '50n': 'mist',
};

export default function WeatherBackground({ weatherData }) {
  const ref = useRef(null);
  const parallaxRef = useRef(null);
  const icon = weatherData?.icon || 'default';
  const type = typeMap[icon] || 'sunny';

  // Parallax mouse handler
  useEffect(() => {
    const el = parallaxRef.current;
    if (!el) return;
    const onMove = e => {
      const mx = (e.clientX / window.innerWidth - 0.5) * 2;
      const my = (e.clientY / window.innerHeight - 0.5) * 2;
      const layers = el.querySelectorAll('[data-depth]');
      layers.forEach(l => {
        const d = parseFloat(l.dataset.depth);
        l.style.transform = `translate(${mx * d * 18}px, ${my * d * 10}px)`;
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    c.innerHTML = '';

    // ── SUNNY ──────────────────────────────────────────────
    if (type === 'sunny') {
      // Big sun disc
      const sun = document.createElement('div');
      sun.style.cssText = `position:absolute;top:-120px;left:-120px;width:500px;height:500px;
        background:radial-gradient(circle, rgba(255,200,60,0.18) 0%, rgba(255,150,30,0.08) 40%, transparent 70%);
        border-radius:50%;animation:float 10s ease-in-out infinite;`;
      c.appendChild(sun);
      // Haze ring
      const haze = document.createElement('div');
      haze.style.cssText = `position:absolute;top:-60px;left:-60px;width:380px;height:380px;
        background:radial-gradient(circle,rgba(255,220,80,0.07) 0%,transparent 65%);
        border-radius:50%;animation:float 14s ease-in-out infinite reverse;`;
      c.appendChild(haze);
      // Horizon glow
      const hor = document.createElement('div');
      hor.style.cssText = `position:absolute;bottom:0;left:0;right:0;height:35%;
        background:linear-gradient(0deg,rgba(30,100,180,0.12),transparent);`;
      c.appendChild(hor);
    }

    // ── NIGHT ──────────────────────────────────────────────
    if (type === 'night' || type === 'partly-night') {
      // Moon
      const moon = document.createElement('div');
      moon.style.cssText = `position:absolute;top:40px;right:100px;width:80px;height:80px;
        background:radial-gradient(circle at 35% 35%, #e2e8f0 0%, #b0bec5 60%, transparent 70%);
        border-radius:50%;box-shadow:0 0 40px rgba(200,220,255,0.12);`;
      c.appendChild(moon);
      // Moon glow
      const mg = document.createElement('div');
      mg.style.cssText = `position:absolute;top:0px;right:60px;width:160px;height:160px;
        background:radial-gradient(circle,rgba(180,200,255,0.06),transparent 70%);
        border-radius:50%;`;
      c.appendChild(mg);
      // Stars — 3 depth layers for parallax
      [[180, '0.2'], [80, '0.5'], [40, '0.9']].forEach(([count, depth]) => {
        const layer = document.createElement('div');
        layer.dataset.depth = depth;
        layer.style.cssText = `position:absolute;inset:0;transition:transform 0.1s ease;`;
        for (let i = 0; i < count; i++) {
          const s = document.createElement('div');
          const sz = depth === '0.9' ? Math.random() * 1.5 + 0.5 : Math.random() * 2 + 0.5;
          s.style.cssText = `position:absolute;left:${Math.random() * 100}%;top:${Math.random() * 80}%;
            width:${sz}px;height:${sz}px;background:white;border-radius:50%;
            animation:star-twinkle ${1.5 + Math.random() * 4}s ease-in-out infinite;
            animation-delay:${Math.random() * 5}s;`;
          layer.appendChild(s);
        }
        c.appendChild(layer);
      });
    }

    // ── PARTLY CLOUDY DAY ──────────────────────────────────
    if (type === 'partly') {
      const orb = document.createElement('div');
      orb.style.cssText = `position:absolute;top:-80px;left:-80px;width:350px;height:350px;
        background:radial-gradient(circle,rgba(255,190,50,0.1),transparent 65%);border-radius:50%;`;
      c.appendChild(orb);
    }

    // ── CLOUDS ─────────────────────────────────────────────
    if (['cloudy', 'cloudy-night', 'partly', 'partly-night', 'overcast'].includes(type)) {
      const count = type === 'overcast' ? 9 : 5;
      const opacity = type === 'overcast' ? 0.12 : 0.07;
      for (let i = 0; i < count; i++) {
        const layer = document.createElement('div');
        const depth = (i % 3 === 0) ? '0.3' : (i % 3 === 1) ? '0.6' : '1.0';
        layer.dataset.depth = depth;
        layer.style.cssText = `position:absolute;inset:0;transition:transform 0.15s ease;`;
        const cl = document.createElement('div');
        const sz = 120 + Math.random() * 180;
        const dur = 35 + Math.random() * 30;
        const top = Math.random() * 40;
        cl.style.cssText = `position:absolute;top:${top}%;left:-300px;
          width:${sz}px;height:${sz * 0.45}px;
          background:rgba(148,163,184,${opacity + Math.random() * 0.04});
          border-radius:80px;filter:blur(${3 + Math.random() * 5}px);
          animation:cloud-move ${dur}s linear infinite;
          animation-delay:-${Math.random() * dur}s;`;
        layer.appendChild(cl);
        c.appendChild(layer);
      }
    }

    // ── RAIN ───────────────────────────────────────────────
    if (type === 'rain' || type === 'heavy-rain') {
      const count = type === 'heavy-rain' ? 130 : 85;
      // Rain cloud mass at top
      const cloudMass = document.createElement('div');
      cloudMass.style.cssText = `position:absolute;top:-60px;left:-10%;width:120%;height:200px;
        background:rgba(20,35,55,0.5);filter:blur(30px);border-radius:50%;`;
      c.appendChild(cloudMass);
      for (let i = 0; i < count; i++) {
        const d = document.createElement('div');
        const dur = 0.5 + Math.random() * 0.6;
        const len = type === 'heavy-rain' ? 14 + Math.random() * 14 : 10 + Math.random() * 10;
        d.style.cssText = `position:absolute;left:${Math.random() * 105}%;top:-40px;
          width:${type === 'heavy-rain' ? '2px' : '1.5px'};height:${len}px;
          background:linear-gradient(180deg,transparent,rgba(147,197,253,${type === 'heavy-rain' ? '0.75' : '0.55'}));
          border-radius:1px;
          animation:rain-fall ${dur}s linear infinite;
          animation-delay:-${Math.random() * 2.5}s;`;
        c.appendChild(d);
      }
      // Puddle shimmer at bottom
      const puddle = document.createElement('div');
      puddle.style.cssText = `position:absolute;bottom:0;left:0;right:0;height:6px;
        background:linear-gradient(90deg,transparent,rgba(147,197,253,0.08),transparent);
        animation:shimmer 2s linear infinite;`;
      c.appendChild(puddle);
    }

    // ── STORM ──────────────────────────────────────────────
    if (type === 'storm') {
      // Dark cloud mass
      const mass = document.createElement('div');
      mass.style.cssText = `position:absolute;top:-80px;left:-10%;width:120%;height:280px;
        background:rgba(10,8,25,0.7);filter:blur(40px);border-radius:50%;`;
      c.appendChild(mass);
      // Heavy rain
      for (let i = 0; i < 100; i++) {
        const d = document.createElement('div');
        d.style.cssText = `position:absolute;left:${Math.random() * 105}%;top:-40px;
          width:1.5px;height:${12 + Math.random() * 10}px;
          background:rgba(147,197,253,0.45);
          animation:rain-fall ${0.45 + Math.random() * 0.5}s linear infinite;
          animation-delay:-${Math.random() * 2}s;`;
        c.appendChild(d);
      }
      // Lightning bolts (2 different timings)
      [3.5, 6.2].forEach(dur => {
        const fl = document.createElement('div');
        fl.style.cssText = `position:absolute;inset:0;
          background:rgba(129,140,248,0.07);
          animation:lightning-flash ${dur}s linear infinite;
          animation-delay:-${Math.random() * dur}s;`;
        c.appendChild(fl);
      });
      // Lightning streak
      const streak = document.createElement('div');
      streak.style.cssText = `position:absolute;top:0;left:${20 + Math.random() * 60}%;
        width:2px;height:${80 + Math.random() * 120}px;
        background:linear-gradient(180deg,rgba(200,190,255,0.6),transparent);
        clip-path:polygon(40% 0%,60% 0%,100% 40%,70% 40%,100% 100%,30% 50%,60% 50%,0% 0%);
        animation:lightning-flash ${4 + Math.random() * 4}s linear infinite;
        animation-delay:-${Math.random() * 4}s;`;
      c.appendChild(streak);
    }

    // ── SNOW ───────────────────────────────────────────────
    if (type === 'snow') {
      // Overcast sky
      const over = document.createElement('div');
      over.style.cssText = `position:absolute;top:-40px;left:-10%;width:120%;height:200px;
        background:rgba(20,35,60,0.35);filter:blur(25px);border-radius:50%;`;
      c.appendChild(over);
      for (let i = 0; i < 90; i++) {
        const f = document.createElement('div');
        const sz = 2 + Math.random() * 6;
        const isFlake = Math.random() > 0.5;
        f.style.cssText = `position:absolute;left:${Math.random() * 105}%;top:-20px;
          width:${sz}px;height:${sz}px;
          background:rgba(224,242,254,${0.7 + Math.random() * 0.25});
          border-radius:${isFlake ? '50%' : '2px'};
          filter:blur(${Math.random() * 0.8}px);
          animation:snow-drift ${5 + Math.random() * 8}s linear infinite;
          animation-delay:-${Math.random() * 12}s;`;
        c.appendChild(f);
      }
    }

    // ── MIST / FOG ─────────────────────────────────────────
    if (type === 'mist') {
      for (let i = 0; i < 14; i++) {
        const layer = document.createElement('div');
        const depth = i % 3 === 0 ? '0.2' : i % 3 === 1 ? '0.5' : '0.8';
        layer.dataset.depth = depth;
        layer.style.cssText = `position:absolute;inset:0;transition:transform 0.2s ease;`;
        const m = document.createElement('div');
        const opa = 0.05 + (i / 14) * 0.07;
        m.style.cssText = `position:absolute;top:${5 + i * 7}%;left:-250px;
          width:${200 + Math.random() * 300}px;height:${20 + Math.random() * 40}px;
          background:rgba(148,163,184,${opa});
          border-radius:60px;filter:blur(${12 + Math.random() * 10}px);
          animation:cloud-move ${25 + Math.random() * 20}s linear infinite;
          animation-delay:-${Math.random() * 30}s;`;
        layer.appendChild(m);
        c.appendChild(layer);
      }
      // Fog floor
      const floor = document.createElement('div');
      floor.style.cssText = `position:absolute;bottom:0;left:0;right:0;height:30%;
        background:linear-gradient(0deg,rgba(148,163,184,0.06),transparent);
        filter:blur(8px);`;
      c.appendChild(floor);
    }

  }, [icon, type]);

  return (
    <BG $bg={gradients[icon] || gradients.default}>
      {/* Vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)', pointerEvents: 'none' }} />
      {/* Horizon glow */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(0deg,rgba(0,0,0,0.3),transparent)', pointerEvents: 'none' }} />
      {/* Parallax container */}
      <div ref={parallaxRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div ref={ref} style={{ position: 'absolute', inset: 0 }} />
      </div>
    </BG>
  );
}