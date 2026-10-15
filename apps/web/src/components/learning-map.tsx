'use client';
import { useState } from 'react';

const regions = [
  { name: 'South Asia', count: 24, x: 365, y: 178, course: 'React foundations' },
  { name: 'Europe', count: 18, x: 280, y: 102, course: 'Modern JavaScript' },
  { name: 'Africa', count: 16, x: 284, y: 200, course: 'Web foundations' },
  { name: 'North America', count: 21, x: 130, y: 112, course: 'Next.js routing' },
  { name: 'South America', count: 12, x: 170, y: 240, course: 'React foundations' },
];
export function LearningMap() {
  const [exploring, setExploring] = useState(false);
  const [selected, setSelected] = useState(regions[0]);
  const [tab, setTab] = useState<'globe' | 'list'>('globe');
  return (
    <section className="map-card" aria-labelledby="map-heading">
      <div className="map-header">
        <div>
          <p className="eyebrow">Different places. Shared curiosity.</p>
          <h2 id="map-heading">A world of possibility.</h2>
        </div>
        <span className="demo-label">Synthetic demo</span>
      </div>
      <div className="map-tabs" role="group" aria-label="Map display">
        <button aria-pressed={tab === 'globe'} onClick={() => setTab('globe')}>
          Globe
        </button>
        <button aria-pressed={tab === 'list'} onClick={() => setTab('list')}>
          Region list
        </button>
      </div>
      {tab === 'globe' ? (
        <div className="globe-container">
          <svg
            className={exploring ? 'globe globe-active' : 'globe'}
            viewBox="0 0 520 350"
            role="img"
            aria-label="Illustrative globe. All activity is synthetic; no learner location is shown."
          >
            <defs>
              <radialGradient id="earth">
                <stop stopColor="#204b49" />
                <stop offset=".7" stopColor="#143231" />
                <stop offset="1" stopColor="#0b2425" />
              </radialGradient>
              <clipPath id="sphere">
                <circle cx="260" cy="175" r="153" />
              </clipPath>
            </defs>
            <circle cx="260" cy="175" r="165" fill="none" stroke="#ffffff0d" />
            <circle cx="260" cy="175" r="153" fill="url(#earth)" stroke="#78aba644" />
            <g clipPath="url(#sphere)" fill="none" stroke="#83aaa52b">
              <ellipse cx="260" cy="175" rx="75" ry="153" />
              <ellipse cx="260" cy="175" rx="125" ry="153" />
              <path d="M107 175h306M116 125q145-52 288 0M116 225q145 52 288 0M150 74q110-30 220 0M150 276q110 30 220 0" />
              <path
                fill="#71918a52"
                stroke="#a4c6b61a"
                d="m114 100 36-19 36 14 15 23-18 16-5 27-21 6-16-27-18-8Zm68 88 25 12 10 33-12 38-14-3-16-41Zm64-72 28-21 24 8 5 22 25 6 17-13 34 20 12 35-24 12-29-15-8 30-26 6-9-24-24-2-14-26Zm23 53 37 9 6 31-22 43-18-10-14-43Zm83 72 30-4 18 19-30 10-16-10Z"
              />
            </g>
            {exploring &&
              regions.map((region) => (
                <g key={region.name}>
                  <circle
                    cx={region.x}
                    cy={region.y}
                    r="10"
                    fill="#ecb89628"
                    className="map-pulse"
                  />
                  <circle cx={region.x} cy={region.y} r="4" fill="#f5b593" />
                </g>
              ))}
          </svg>
          {!exploring && (
            <button className="map-optin" onClick={() => setExploring(true)}>
              Explore demo regions <span aria-hidden="true">↗</span>
            </button>
          )}
          {exploring && (
            <div className="map-selected">
              <span className="status-dot" />
              <strong>{selected.name}</strong>
              <span>
                {selected.count} simulated learners · {selected.course}
              </span>
            </div>
          )}
        </div>
      ) : (
        <table className="region-table">
          <caption>Synthetic demonstration data, dated 16 October 2026</caption>
          <thead>
            <tr>
              <th>Broad region</th>
              <th>Simulated learners</th>
            </tr>
          </thead>
          <tbody>
            {regions.map((region) => (
              <tr key={region.name}>
                <th scope="row">{region.name}</th>
                <td>{region.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {exploring && tab === 'globe' && (
        <div className="region-chips" aria-label="Choose a demo region">
          {regions.map((region) => (
            <button
              key={region.name}
              aria-pressed={selected.name === region.name}
              onClick={() => setSelected(region)}
            >
              {region.name}
            </button>
          ))}
        </div>
      )}
      <div className="map-footnote">
        <span>No live locations. No tracking.</span>
        <span>Mapbox connection pending</span>
      </div>
    </section>
  );
}
