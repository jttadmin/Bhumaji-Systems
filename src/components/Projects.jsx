import { useEffect, useRef, useState } from 'react';
import { projects } from '../data/content.js';
import SectionHead from './SectionHead.jsx';

export default function Projects() {
  const track = useRef(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return undefined;
    const onScroll = () => {
      const card = el.querySelector('.case');
      if (!card) return;
      const step = card.getBoundingClientRect().width + 24;
      setIndex(Math.min(projects.length - 1, Math.round(el.scrollLeft / step)));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const go = (dir) => {
    const el = track.current;
    const card = el.querySelector('.case');
    const step = card.getBoundingClientRect().width + 24;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <section className="section projects" id="work" aria-labelledby="work-title">
      <div className="wrap">
        <SectionHead
          id="work-title"
          eyebrow="Engagements we deliver"
          title={<>The kind of work<br />we are built for.</>}
        >
          <div className="work-controls">
            <span className="work-count" aria-live="polite">
              {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
            </span>
            <button type="button" className="round-btn" onClick={() => go(-1)} aria-label="Previous engagement" disabled={index === 0}>←</button>
            <button type="button" className="round-btn" onClick={() => go(1)} aria-label="Next engagement" disabled={index === projects.length - 1}>→</button>
          </div>
        </SectionHead>
      </div>

      <div className="case-track" ref={track} tabIndex={0} aria-label="Engagements, scroll horizontally">
        {projects.map((p) => (
          <article key={p.id} className={`case tone-${p.tone}`} aria-labelledby={`${p.id}-t`}>
            <div className="case-glow" aria-hidden="true" />
            <header className="case-head">
              <span className="case-kind">{p.kind}</span>
            </header>
            <h3 id={`${p.id}-t`} className="case-title">{p.title}</h3>
            <dl className="case-facts">
              <div><dt>Starting point</dt><dd>{p.challenge}</dd></div>
              <div><dt>How we deliver</dt><dd>{p.approach}</dd></div>
            </dl>
            <div className="case-metrics">
              {p.deliverables.map((m) => (
                <div key={m.label} className="metric">
                  <span className="metric-value">{m.value}</span>
                  <span className="metric-label">{m.label}</span>
                </div>
              ))}
            </div>
            <ul className="case-stack" aria-label="Technology used">
              {p.stack.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </article>
        ))}
        <div className="case-end" aria-hidden="true" />
      </div>

    </section>
  );
}
