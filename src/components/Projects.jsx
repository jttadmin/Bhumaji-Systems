import { useEffect, useRef, useState } from 'react';
import { projects, testimonials } from '../data/content.js';
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
          eyebrow="Featured work"
          title={<>The kind of work<br />we are built for.</>}
        >
          <div className="work-controls">
            <span className="work-count" aria-live="polite">
              {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
            </span>
            <button type="button" className="round-btn" onClick={() => go(-1)} aria-label="Previous case study" disabled={index === 0}>←</button>
            <button type="button" className="round-btn" onClick={() => go(1)} aria-label="Next case study" disabled={index === projects.length - 1}>→</button>
          </div>
        </SectionHead>
        <p className="placeholder-note">
          <span className="ph-badge">Illustrative</span>
          Every case study and testimonial on this page is a fictional placeholder showing the kind of engagement we deliver. Replace with approved client work before launch.
        </p>
      </div>

      <div className="case-track" ref={track} tabIndex={0} aria-label="Case studies, scroll horizontally">
        {projects.map((p) => (
          <article key={p.id} className={`case tone-${p.tone}`} aria-labelledby={`${p.id}-t`}>
            <div className="case-glow" aria-hidden="true" />
            <header className="case-head">
              <span className="case-kind">{p.kind}</span>
              <span className="ph-badge">Illustrative placeholder</span>
            </header>
            <h3 id={`${p.id}-t`} className="case-title">{p.title}</h3>
            <p className="case-client">{p.client}</p>
            <dl className="case-facts">
              <div><dt>Challenge</dt><dd>{p.challenge}</dd></div>
              <div><dt>Approach</dt><dd>{p.approach}</dd></div>
            </dl>
            <div className="case-metrics">
              {p.metrics.map((m) => (
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

      <div className="wrap">
        <div className="quotes">
          {testimonials.map((t) => (
            <figure key={t.name} className="quote">
              <blockquote>
                <p>{t.quote}</p>
              </blockquote>
              <figcaption>
                <span className="quote-name">{t.name}</span>
                <span className="quote-org">{t.org}</span>
                <span className="ph-badge">Illustrative testimonial</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
