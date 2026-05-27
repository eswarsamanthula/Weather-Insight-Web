import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const BG = styled.div`
  position:fixed; inset:0; z-index:-1; overflow:hidden;
  transition:background 2s ease;
  background:${p => p.$bg};
`;

const gradients = {
  '01d': 'radial-gradient(ellipse at 15% 15%, #0f3460 0%, #0a1f3f 40%, #020c1b 100%)',
  '01n': 'radial-gradient(ellipse at 50% 0%, #0b0723 0%, #020c1b 65%)',
  '02d': 'radial-gradient(ellipse at 20% 10%, #0e2d52 0%, #091c38 50%, #020c1b 100%)',
  '02n': 'radial-gradient(ellipse at 50% 0%, #080f28 0%, #020c1b 65%)',
  '03d': 'radial-gradient(ellipse at 50% 0%, #111d35 0%, #020c1b 70%)',
  '03n': 'radial-gradient(ellipse at 50% 0%, #080d1e 0%, #020c1b 70%)',
  '04d': 'radial-gradient(ellipse at 50% 0%, #0e1829 0%, #020c1b 70%)',
  '04n': 'radial-gradient(ellipse at 50% 0%, #07090f 0%, #020c1b 70%)',
  '09d': 'radial-gradient(ellipse at 40% 0%, #071829 0%, #030e1e 60%, #020c1b 100%)',
  '09n': 'radial-gradient(ellipse at 50% 0%, #040b15 0%, #020c1b 70%)',
  '10d': 'radial-gradient(ellipse at 30% 0%, #071829 0%, #030e1e 60%, #020c1b 100%)',
  '10n': 'radial-gradient(ellipse at 50% 0%, #040b15 0%, #020c1b 70%)',
  '11d': 'radial-gradient(ellipse at 50% 0%, #0a0820 0%, #020c1b 70%)',
  '11n': 'radial-gradient(ellipse at 50% 0%, #06051a 0%, #020c1b 70%)',
  '13d': 'radial-gradient(ellipse at 50% 0%, #111e35 0%, #020c1b 70%)',
  '13n': 'radial-gradient(ellipse at 50% 0%, #080d1e 0%, #020c1b 70%)',
  '50d': 'radial-gradient(ellipse at 50% 0%, #0e1523 0%, #020c1b 70%)',
  '50n': 'radial-gradient(ellipse at 50% 0%, #070b13 0%, #020c1b 70%)',
  default: 'radial-gradient(ellipse at 15% 15%, #0f3460 0%, #0a1f3f 40%, #020c1b 100%)',
};

const typeMap = {
  '01d': 'sunny', '01n': 'night', '02d': 'partly', '02n': 'night',
  '03d': 'cloudy', '03n': 'cloudy', '04d': 'cloudy', '04n': 'cloudy',
  '09d': 'rain', '09n': 'rain', '10d': 'rain', '10n': 'rain',
  '11d': 'storm', '11n': 'storm', '13d': 'snow', '13n': 'snow',
  '50d': 'mist', '50n': 'mist',
};

export default function WeatherBackground({ weatherData }) {
  const ref = useRef(null);
  const icon = weatherData?.icon || 'default';
  const type = typeMap[icon] || 'sunny';

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    c.innerHTML = '';

    if (type === 'sunny') {
      const orb = document.createElement('div');
      orb.style.cssText = `position:absolute;top:-80px;left:-80px;width:400px;height:400px;background:radial-gradient(circle,rgba(251,191,36,0.12) 0%,transparent 70%);border-radius:50%;animation:float 8s ease-in-out infinite;`;
      c.appendChild(orb);
      for (let i = 0; i < 6; i++) {
        const ray = document.createElement('div');
        ray.style.cssText = `position:absolute;top:60px;left:60px;width:180px;height:1.5px;background:linear-gradient(90deg,rgba(251,191,36,0.2),transparent);transform-origin:0 50%;transform:rotate(${i * 60}deg);border-radius:2px;`;
        c.appendChild(ray);
      }
    }

    if (type === 'night' || type === 'partly') {
      for (let i = 0; i < 150; i++) {
        const s = document.createElement('div');
        const sz = Math.random() * 2.5 + 0.5;
        s.style.cssText = `position:absolute;left:${Math.random() * 100}%;top:${Math.random() * 75}%;width:${sz}px;height:${sz}px;background:white;border-radius:50%;animation:star-twinkle ${1.5 + Math.random() * 3}s ease-in-out infinite;animation-delay:${Math.random() * 5}s;`;
        c.appendChild(s);
      }
    }

    if (type === 'cloudy' || type === 'partly') {
      for (let i = 0; i < 5; i++) {
        const cl = document.createElement('div');
        const sz = 100 + Math.random() * 130;
        const dur = 30 + Math.random() * 25;
        cl.style.cssText = `position:absolute;top:${Math.random() * 35}%;left:-250px;width:${sz}px;height:${sz * 0.5}px;background:rgba(148,163,184,0.06);border-radius:60px;filter:blur(4px);animation:cloud-move ${dur}s linear infinite;animation-delay:-${Math.random() * dur}s;`;
        c.appendChild(cl);
      }
    }

    if (type === 'rain' || type === 'storm') {
      const count = type === 'storm' ? 70 : 90;
      for (let i = 0; i < count; i++) {
        const d = document.createElement('div');
        const dur = 0.55 + Math.random() * 0.7;
        d.style.cssText = `position:absolute;left:${Math.random() * 100}%;top:-30px;width:1.5px;height:${12 + Math.random() * 12}px;background:linear-gradient(180deg,transparent,rgba(147,197,253,0.65));border-radius:1px;animation:rain-fall ${dur}s linear infinite;animation-delay:-${Math.random() * 2}s;`;
        c.appendChild(d);
      }
      if (type === 'storm') {
        const fl = document.createElement('div');
        fl.style.cssText = `position:absolute;inset:0;background:rgba(129,140,248,0.06);animation:lightning-flash ${3 + Math.random() * 5}s linear infinite;`;
        c.appendChild(fl);
      }
    }

    if (type === 'snow') {
      for (let i = 0; i < 70; i++) {
        const f = document.createElement('div');
        const sz = 2 + Math.random() * 5;
        f.style.cssText = `position:absolute;left:${Math.random() * 100}%;top:-20px;width:${sz}px;height:${sz}px;background:rgba(224,242,254,0.85);border-radius:50%;filter:blur(0.5px);animation:snow-drift ${4 + Math.random() * 7}s linear infinite;animation-delay:-${Math.random() * 10}s;`;
        c.appendChild(f);
      }
    }

    if (type === 'mist') {
      for (let i = 0; i < 10; i++) {
        const m = document.createElement('div');
        m.style.cssText = `position:absolute;top:${8 + i * 9}%;left:-250px;width:${180 + Math.random() * 200}px;height:${15 + Math.random() * 25}px;background:rgba(148,163,184,0.06);border-radius:60px;filter:blur(10px);animation:cloud-move ${22 + Math.random() * 18}s linear infinite;animation-delay:-${Math.random() * 25}s;`;
        c.appendChild(m);
      }
    }
  }, [icon, type]);

  return (
    <BG $bg={gradients[icon] || gradients.default}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 80%, rgba(56,189,248,0.03) 0%, transparent 60%)' }} />
      <div ref={ref} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
    </BG>
  );
}
