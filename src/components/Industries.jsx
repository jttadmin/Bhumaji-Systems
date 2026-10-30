import { useEffect, useRef, useState } from 'react';
import { industries } from '../data/content.js';
import SectionHead from './SectionHead.jsx';

function wavePath([freq, amp, phase], width = 600, height = 120) {
  let d = '';
  for (let x = 0; x <= width * 2; x += 6) {
    const t = x / width;
    const y = height / 2 + Math.sin(t * Math.PI * freq + phase) * height * 0.28 * amp + Math.sin(t * Math.PI * freq * 2.3 + phase * 2) * height * 0.1;
    d += `${x === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)} `;
  }
  return d;
}

export default function Industries() {
  const [active, setActive] = useState(industries[0].id);
  const tabs = useRef([]);
  const current = industries.find((i) => i.id === active);

  useEffect(() => {
    const onSelect = (e) => setActive(e.detail);
    window.addEventListener('bhumaji:industry', onSelect);
    return () => window.removeEventListener('bhumaji:industry', onSelect);
  }, []);

  const onKey = (e, idx) => {
    const n = industries.length;
    let next = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (idx + 1) % n;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (idx - 1 + n) % n;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = n - 1;
    if (next !== null) {
      e.preventDefault();
      setActive(industries[next].id);
      tabs.current[next]?.focus();
    }
  };

  return (
    <section className="section industries" id="industries" aria-labelledby="ind-title">
      <div className="wrap">
        <SectionHead
          id="ind-title"
          eyebrow="Industries"
          title={<>Built for the pressure<br />your industry is under.</>}
        />

        <div className="ind-layout">
          <div className="ind-tabs" role="tablist" aria-label="Industries" aria-orientation="vertical">
            {industries.map((ind, idx) => (
              <button
                key={ind.id}
                ref={(el) => (tabs.current[idx] = el)}
                role="tab"
                id={`tab-${ind.id}`}
                aria-selected={active === ind.id}
                aria-controls="ind-panel"
                tabIndex={active === ind.id ? 0 : -1}
                className={`ind-tab${active === ind.id ? ' is-on' : ''}`}
                onClick={() => setActive(ind.id)}
                onKeyDown={(e) => onKey(e, idx)}
              >
                <span className="ind-tab-name">{ind.name}</span>
                <span className="ind-tab-short" aria-hidden="true">{ind.short}</span>
              </button>
            ))}
          </div>

          <div className="ind-panel" id="ind-panel" role="tabpanel" aria-labelledby={`tab-${current.id}`} key={current.id}>
            <svg className="ind-wave" viewBox="0 0 600 120" preserveAspectRatio="none" aria-hidden="true">
              <path d={wavePath(current.wave)} className="wave-a" />
              <path d={wavePath([current.wave[0] * 1.4, current.wave[1] * 0.7, current.wave[2] + 1])} className="wave-b" />
            </svg>
            <h3 className="ind-name">{current.name}</h3>
            <ol className="ind-story">
              <li>
                <span className="story-label">The pressure</span>
                <p>{current.pressure}</p>
              </li>
              <li>
                <span className="story-label">What we engineer</span>
                <ul className="story-chips">
                  {current.build.map((b) => <li key={b}>{b}</li>)}
                </ul>
              </li>
              <li>
                <span className="story-label">What changes</span>
                <p className="story-change">{current.change}</p>
              </li>
            </ol>
            <a href="#contact" className="ind-cta">Talk to us about {current.short} <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </div>
    </section>
  );
}
