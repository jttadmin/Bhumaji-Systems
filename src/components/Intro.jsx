import { pillars, techRings, industries, process } from '../data/content.js';

/* Brand statement plus "at a glance" figures. Every number counts something listed on this site. */
export default function Intro() {
  const techCount = techRings.reduce((n, r) => n + r.items.length, 0);
  const facts = [
    { value: pillars.length, label: 'Engineering practices', note: 'Cloud, AI/ML, software and apps' },
    { value: 3, label: 'Major public clouds', note: 'AWS, Microsoft Azure and Google Cloud' },
    { value: techCount, label: 'Core technologies', note: 'From Kubernetes to PyTorch' },
    { value: industries.length, label: 'Industries we build for', note: `A ${process.length}-stage delivery model for each` },
  ];

  return (
    <section className="section intro" aria-labelledby="intro-title">
      <div className="wrap">
        <div className="intro-grid">
          <p className="eyebrow">Who we are</p>
          <h2 id="intro-title" className="intro-statement">
            We help startups, growing businesses and enterprises <strong>build, modernize and scale</strong> technology,
            from cloud foundations to the apps their customers use every day.
          </h2>
        </div>
        <dl className="facts">
          {facts.map((f) => (
            <div key={f.label} className="fact">
              <dt className="fact-label">{f.label}</dt>
              <dd className="fact-value">{f.value}</dd>
              <dd className="fact-note">{f.note}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
