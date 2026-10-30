import { pillars, projects } from '../data/content.js';
import { motifFor } from '../components/Motifs.jsx';
import Contact from '../components/Contact.jsx';

const KIND_FOR = {
  cloud: ['Cloud migration', 'Kubernetes platform engineering'],
  ai: ['AI/ML deployment automation'],
  software: ['Enterprise software development'],
  mobile: ['Mobile application development'],
};

export default function ServicePage({ pillar }) {
  const Motif = motifFor[pillar.id];
  const related = projects.filter((p) => KIND_FOR[pillar.id].includes(p.kind));
  const others = pillars.filter((p) => p.id !== pillar.id);

  return (
    <div className={`svc-page tone-${pillar.tone}`}>
      <section className="svc-hero">
        <div className="wrap svc-hero-grid">
          <div>
            <nav className="crumbs" aria-label="Breadcrumb">
              <a href="#top">Home</a><span aria-hidden="true">/</span>
              <a href="#what-we-do">What We Do</a><span aria-hidden="true">/</span>
              <span aria-current="page">{pillar.short}</span>
            </nav>
            <p className="pillar-code">{pillar.code}</p>
            <h1 className="svc-title">{pillar.title}</h1>
            <p className="svc-lede">{pillar.lede}</p>
            <p className="svc-desc">{pillar.description}</p>
            <a href="#contact" className="btn btn-primary btn-lg">Discuss your project <span aria-hidden="true">→</span></a>
          </div>
          <div className="svc-visual" aria-hidden="true"><Motif /></div>
        </div>
      </section>

      <section className="section svc-caps">
        <div className="wrap svc-caps-grid">
          <div>
            <p className="eyebrow">Capabilities</p>
            <h2 className="section-title small">What this practice delivers</h2>
            <p className="svc-approach">{pillar.approach}</p>
          </div>
          <ul className="cap-list">
            {pillar.items.map((it) => <li key={it}>{it}</li>)}
          </ul>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section svc-related">
          <div className="wrap">
            <p className="eyebrow">Typical engagement</p>
            {related.map((p) => (
              <article key={p.id} className="related-case">
                <h3>{p.title}</h3>
                <p>{p.challenge} {p.approach}</p>
                <ul className="case-stack">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="section svc-others">
        <div className="wrap">
          <p className="eyebrow">Other disciplines</p>
          <ul className="others">
            {others.map((p) => (
              <li key={p.id} className={`tone-${p.tone}`}>
                <a href={`#${p.route}`}>
                  <span className="pillar-code">{p.code}</span>
                  <span className="others-title">{p.title}</span>
                  <span aria-hidden="true">→</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Contact preselect={pillar.id} />
    </div>
  );
}
