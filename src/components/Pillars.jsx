import { useState } from 'react';
import { pillars } from '../data/content.js';
import { motifFor } from './Motifs.jsx';
import SectionHead from './SectionHead.jsx';

/*
 * Desktop: four tall panels; the active one expands to tell its story.
 * Mobile: each pillar becomes its own full-width chapter.
 */
export default function Pillars() {
  const [active, setActive] = useState('cloud');

  return (
    <section className="section pillars" id="what-we-do" aria-labelledby="pillars-title">
      <div className="wrap">
        <SectionHead
          id="pillars-title"
          eyebrow="What we do"
          title={<>Four disciplines.<br />One engineering team.</>}
          aside="Cloud foundations, intelligent systems, enterprise software and the apps your customers touch, delivered by people who build and run them."
        />

        <div className="pillar-stage" role="list">
          {pillars.map((p) => {
            const Motif = motifFor[p.id];
            const isOn = active === p.id;
            return (
              <article
                key={p.id}
                role="listitem"
                className={`pillar tone-${p.tone}${isOn ? ' is-active' : ''}`}
                onMouseEnter={() => setActive(p.id)}
                onFocus={() => setActive(p.id)}
              >
                <div className="pillar-bg" aria-hidden="true"><Motif /></div>
                <button
                  type="button"
                  className="pillar-spine"
                  aria-expanded={isOn}
                  aria-controls={`pillar-body-${p.id}`}
                  onClick={() => setActive(p.id)}
                >
                  <span className="pillar-code">{p.code}</span>
                  <span className="pillar-spine-title">{p.short}</span>
                </button>
                <div className="pillar-body" id={`pillar-body-${p.id}`}>
                  <span className="pillar-code">{p.code}</span>
                  <h3 className="pillar-title">{p.title}</h3>
                  <p className="pillar-lede">{p.lede}</p>
                  <p className="pillar-desc">{p.description}</p>
                  <ul className="pillar-items">
                    {p.items.map((it) => <li key={it}>{it}</li>)}
                  </ul>
                  <a className="pillar-link" href={`#${p.route}`}>
                    Explore {p.short} <span aria-hidden="true">→</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
