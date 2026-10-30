import { principles } from '../data/content.js';

/* "Why Bhumaji" written as an engineering spec sheet: commitment + how it shows up in practice. */
export default function Why() {
  return (
    <section className="section why" id="about" aria-labelledby="why-title">
      <div className="wrap why-layout">
        <div className="why-intro">
          <p className="eyebrow">Why Bhumaji Systems</p>
          <h2 id="why-title" className="why-title">
            Engineers first.<br />
            <span>Outcomes always.</span>
          </h2>
          <p className="why-body">
            Bhumaji Systems is a technology transformation and digital engineering company for startups, growing businesses and
            enterprises. We combine cloud, AI, software and application expertise in one team, so the people who design your
            system are the people who build and run it.
          </p>
          <a href="#contact" className="btn btn-ghost">Start a conversation</a>
        </div>

        <div className="spec" role="table" aria-label="Our engineering commitments">
          <div className="spec-row spec-headrow" role="row">
            <span role="columnheader">Commitment</span>
            <span role="columnheader">What it means</span>
            <span role="columnheader">In practice</span>
          </div>
          {principles.map((p) => (
            <div className="spec-row" role="row" key={p.term}>
              <span className="spec-term" role="rowheader">{p.term}</span>
              <span className="spec-promise" role="cell">{p.promise}</span>
              <span className="spec-practice" role="cell">{p.practice}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
