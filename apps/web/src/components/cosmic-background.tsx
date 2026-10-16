'use client';
import { useEffect, useState } from 'react';
export function CosmicBackground() {
  const [paused, setPaused] = useState(true);
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      setReduced(media.matches);
      let saved = false;
      try {
        saved = localStorage.getItem('ilearnnation-sky-paused') === 'true';
      } catch {}
      setPaused(media.matches || saved);
    };
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);
  function toggle() {
    setPaused(!paused);
    try {
      localStorage.setItem('ilearnnation-sky-paused', String(!paused));
    } catch {}
  }
  return (
    <>
      <div className="cosmic-field" data-paused={paused || reduced} aria-hidden="true">
        <svg viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMin slice" className="star-chart">
          <defs>
            <radialGradient id="gravity-glow">
              <stop stopColor="#80c9db" stopOpacity=".16" />
              <stop offset="1" stopColor="#80c9db" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="orbit-spectrum">
              <stop stopColor="#325766" stopOpacity="0" />
              <stop offset=".45" stopColor="#79c7dc" />
              <stop offset=".65" stopColor="#d1a47a" />
              <stop offset="1" stopColor="#325766" stopOpacity="0" />
            </linearGradient>
          </defs>
          <circle cx="1030" cy="280" r="370" fill="url(#gravity-glow)" />
          <g className="gravity-mesh" fill="none" stroke="#6d9eae" strokeWidth=".65">
            {[75, 110, 150, 200, 260, 330, 420, 530, 670].map((r) => (
              <ellipse
                key={r}
                cx="1030"
                cy="280"
                rx={r}
                ry={r * 0.36}
                transform="rotate(-28 1030 280)"
              />
            ))}
            {[-75, -50, -25, 0, 25, 50, 75].map((angle) => (
              <ellipse
                key={angle}
                cx="1030"
                cy="280"
                rx="480"
                ry="125"
                transform={`rotate(${angle} 1030 280)`}
              />
            ))}
          </g>
          <g className="orbit-drift">
            <ellipse
              cx="1030"
              cy="280"
              rx="255"
              ry="83"
              transform="rotate(-28 1030 280)"
              fill="none"
              stroke="url(#orbit-spectrum)"
              strokeWidth="2"
            />
            <circle cx="805" cy="420" r="3" fill="#b3e3ed" />
          </g>
          <circle cx="1030" cy="280" r="45" fill="#07121e" stroke="#79c7dc" strokeOpacity=".2" />
          {Array.from({ length: 65 }, (_, i) => (
            <circle
              key={i}
              cx={(i * 347 + 31) % 1440}
              cy={(i * 179 + 17) % 1000}
              r={i % 9 === 0 ? 1.4 : 0.65}
              fill="#b9d7e4"
              opacity={0.15 + (i % 5) * 0.09}
            />
          ))}
          <path
            d="M90 210h20m-10-10v20M1280 650h14m-7-7v14M240 805h14m-7-7v14"
            stroke="#7ba9bc"
            strokeWidth=".6"
          />
        </svg>
      </div>
      {!reduced && (
        <button className="sky-control" onClick={toggle} aria-pressed={paused}>
          {paused ? 'Resume sky' : 'Pause sky'} <span aria-hidden="true">◎</span>
        </button>
      )}
    </>
  );
}
