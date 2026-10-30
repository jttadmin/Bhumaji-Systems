import { pillars } from '../data/content.js';
import { motifFor } from './Motifs.jsx';
import SectionHead from './SectionHead.jsx';

/* Four practices as a calm 2×2 grid: label, headline, short description, capability list, link. */
export default function Pillars() {
  return (
    <section className="section pillars" id="what-we-do" aria-labelledby="pillars-title">
      <div className="wrap">
        <SectionHead
          id="pillars-title"
          eyebrow="What we do"
          title="Four practices. One engineering team."
          aside="Cloud foundations, intelligent systems, enterprise software and the apps your customers touch, delivered by people who build and run them."
        />
        <div className="pillar-grid">
          {pillars.map((p) => {
            const Motif = motifFor[p.id];
            return (
              <article key={p.id} className={`pillar-card tone-${p.tone}`} aria-labelledby={`pc-${p.id}`}>
                <div className="pillar-art" aria-hidden="true"><Motif /></div>
                <p className="pillar-code">{p.code}</p>
                <h3 id={`pc-${p.id}`} className="pillar-title">{p.title}</h3>
                <p className="pillar-lede">{p.lede}</p>
                <ul className="pillar-items">
                  {p.items.map((it) => <li key={it}>{it}</li>)}
                </ul>
                <a className="pillar-link" href={`#${p.route}`}>
                  Explore {p.short} <span aria-hidden="true">→</span>
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
