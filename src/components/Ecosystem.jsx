import { techRings } from '../data/content.js';
import SectionHead from './SectionHead.jsx';

/* Technologies as uniform rows grouped by layer. */
export default function Ecosystem() {
  return (
    <section className="section ecosystem" id="technology" aria-labelledby="eco-title">
      <div className="wrap">
        <SectionHead
          id="eco-title"
          eyebrow="Technologies we work with"
          title="Proven tools, chosen for the job."
          aside="We work in three layers: where your workloads run, how changes reach production, and what we build on top."
        />
        <div className="tech-rows">
          {techRings.map((r) => (
            <div key={r.id} className={`tech-row tone-${r.tone}`}>
              <div className="tech-row-head">
                <p className="tech-row-label">{r.label}</p>
                <p className="tech-row-note">{r.note}</p>
              </div>
              <ul className="tech-tiles">
                {r.items.map((it) => (
                  <li key={it.name} className="tech-tile">
                    <span className="tech-name">{it.name}</span>
                    <span className="tech-role">{it.role}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
