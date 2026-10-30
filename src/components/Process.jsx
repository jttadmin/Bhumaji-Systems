import { useEffect, useRef, useState } from 'react';
import { process } from '../data/content.js';
import SectionHead from './SectionHead.jsx';
import { useMedia, useReducedMotion } from '../hooks.js';

/* Delivery methodology rendered as a CI-style pipeline: done → running → queued. */
export default function Process() {
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);
  const [hover, setHover] = useState(false);
  const reduced = useReducedMotion();
  const wide = useMedia('(min-width: 860px)', true);
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    ref.current && io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!auto || reduced || hover || !inView || !wide) return undefined;
    const t = setTimeout(() => setStep((s) => (s + 1) % process.length), 4200);
    return () => clearTimeout(t);
  }, [step, auto, reduced, hover, inView, wide]);

  const choose = (i) => {
    setAuto(false);
    setStep(i);
  };
  const status = (i) => (i < step ? 'done' : i === step ? 'running' : 'queued');
  const s = process[step];

  return (
    <section className="section process" id="approach" aria-labelledby="proc-title" ref={ref}>
      <div className="wrap">
        <SectionHead
          id="proc-title"
          eyebrow="Delivery approach"
          title={<>Six stages.<br />Every one of them shipped.</>}
          aside="Our delivery model runs like a well-built pipeline: each stage has clear inputs, visible outputs and a gate before the next."
        />

        {wide ? (
          <div className="pipeline" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <div className="pipe-rail" role="tablist" aria-label="Delivery stages">
              <div className="pipe-track" aria-hidden="true">
                <div className="pipe-fill" style={{ width: `${(step / (process.length - 1)) * 100}%` }} />
              </div>
              {process.map((p, i) => (
                <button
                  key={p.name}
                  role="tab"
                  aria-selected={i === step}
                  aria-controls="pipe-detail"
                  className={`pipe-stage is-${status(i)}`}
                  onClick={() => choose(i)}
                >
                  <span className="pipe-node" aria-hidden="true">
                    {status(i) === 'done' ? (
                      <svg viewBox="0 0 16 16" width="14" height="14"><path d="M3.5 8.5 6.5 11.5 12.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    ) : (
                      <span className="pipe-dot" />
                    )}
                  </span>
                  <span className="pipe-name">{p.name}</span>
                  <span className="pipe-status">{status(i)}</span>
                </button>
              ))}
            </div>

            <div className="pipe-detail" id="pipe-detail" role="tabpanel" key={step}>
              <div className="pipe-detail-main">
                <p className="pipe-stage-no">Stage {step + 1} of {process.length}</p>
                <h3 className="pipe-title">{s.name}</h3>
                <p className="pipe-line">{s.line}</p>
              </div>
              <div className="pipe-col">
                <p className="pipe-col-label">Activities</p>
                <ul>{s.activities.map((a) => <li key={a}>{a}</li>)}</ul>
              </div>
              <div className="pipe-col">
                <p className="pipe-col-label">Artefacts</p>
                <ul className="artefacts">{s.outputs.map((o) => <li key={o}>{o}</li>)}</ul>
              </div>
              {auto && !reduced && <div className="pipe-timer" aria-hidden="true" style={{ animationPlayState: hover ? 'paused' : 'running' }} />}
            </div>
          </div>
        ) : (
          <ol className="pipe-vertical">
            {process.map((p, i) => (
              <li key={p.name}>
                <span className="pv-node" aria-hidden="true">{i + 1}</span>
                <div>
                  <h3 className="pv-title">{p.name}</h3>
                  <p className="pv-line">{p.line}</p>
                  <p className="pv-out">{p.outputs.join(' · ')}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
