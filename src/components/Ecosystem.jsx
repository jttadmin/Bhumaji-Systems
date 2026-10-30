import { useState } from 'react';
import { techRings } from '../data/content.js';
import { LogoMark } from './Logo.jsx';
import SectionHead from './SectionHead.jsx';
import { useMedia } from '../hooks.js';

const RADII = { platform: 0.25, delivery: 0.365, build: 0.475 };
const SPEED = 110; // one shared speed keeps chips from colliding
const OFFSET = { platform: 24, delivery: 84, build: 8 };

export default function Ecosystem() {
  const [ring, setRing] = useState(null);
  const [focus, setFocus] = useState(null);
  const wide = useMedia('(min-width: 1100px)', true);
  const total = techRings.reduce((n, r) => n + r.items.length, 0);

  return (
    <section className="section ecosystem" id="technology" aria-labelledby="eco-title">
      <div className="wrap">
        <SectionHead
          id="eco-title"
          eyebrow="Technology ecosystem"
          title={<>An ecosystem,<br />not a logo wall.</>}
          aside="We work in three layers: where your workloads run, how changes reach production, and what we build on top. Each tool earns its place."
        />

        <div className="eco-layout">
          <div className="eco-legend" role="group" aria-label="Filter by layer">
            {techRings.map((r) => (
              <button
                type="button"
                key={r.id}
                className={`eco-ring-btn tone-${r.tone}${ring === r.id ? ' is-on' : ''}`}
                aria-pressed={ring === r.id}
                onClick={() => setRing(ring === r.id ? null : r.id)}
              >
                <span className="eco-ring-head">
                  <span className="eco-ring-dot" aria-hidden="true" />
                  <span className="eco-ring-label">{r.label}</span>
                  <span className="eco-ring-count">{r.items.length}</span>
                </span>
                <span className="eco-ring-note">{r.note}</span>
                <span className="eco-ring-items">{r.items.map((i) => i.name).join(' · ')}</span>
              </button>
            ))}
          </div>

          {wide ? (
            <div className={`orbit-stage${ring ? ' has-filter' : ''}`}>
              {techRings.map((r) => (
                <div
                  key={r.id}
                  className={`orbit tone-${r.tone}${ring && ring !== r.id ? ' is-dim' : ''}`}
                  style={{ '--k': RADII[r.id], '--dur': `${SPEED}s` }}
                >
                  <div className="orbit-path" aria-hidden="true" />
                  <ul className="orbit-spin" aria-label={r.label}>
                    {r.items.map((it, i) => {
                      const a = (360 / r.items.length) * i + OFFSET[r.id];
                      return (
                        <li key={it.name} className="orbit-slot" style={{ '--a': `${a}deg` }}>
                          <button
                            type="button"
                            className="tech-chip"
                            onMouseEnter={() => setFocus(it)}
                            onMouseLeave={() => setFocus(null)}
                            onFocus={() => setFocus(it)}
                            onBlur={() => setFocus(null)}
                          >
                            {it.name}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
              <div className="orbit-core" aria-live="polite">
                {focus ? (
                  <>
                    <span className="core-name">{focus.name}</span>
                    <span className="core-role">{focus.role}</span>
                  </>
                ) : (
                  <>
                    <LogoMark size={44} />
                    <span className="core-role">{total} core technologies</span>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="eco-stack">
              {techRings.map((r) => (
                <div key={r.id} className={`eco-layer tone-${r.tone}${ring && ring !== r.id ? ' is-dim' : ''}`}>
                  <p className="eco-layer-label">{r.label}</p>
                  <ul>
                    {r.items.map((it) => (
                      <li key={it.name} className="tech-chip static">
                        <span>{it.name}</span>
                        <small>{it.role}</small>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
