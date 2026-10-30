import { hero, pillars } from '../data/content.js';

/* Text-led hero: headline first, the four practices as a quiet index underneath. */
export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-wash" aria-hidden="true" />
      <div className="wrap hero-inner">
        <p className="eyebrow load-1">Technology transformation &amp; digital engineering</p>
        <h1 id="hero-title" className="hero-title">
          <span className="hero-line load-2">{hero.lineOne}</span>
          <span className="hero-line hero-line-2 load-3">
            Powering <em>Digital Transformation.</em>
          </span>
        </h1>
        <div className="hero-foot load-4">
          <p className="hero-tag">Cloud. Intelligence. Engineering.</p>
          <p className="hero-body">{hero.body}</p>
          <div className="hero-ctas">
            <a href={hero.primaryCta.href} className="btn btn-primary btn-lg">
              {hero.primaryCta.label} <span aria-hidden="true">→</span>
            </a>
            <a href={hero.secondaryCta.href} className="btn btn-ghost btn-lg">{hero.secondaryCta.label}</a>
          </div>
        </div>
      </div>

      <div className="wrap">
        <ul className="hero-strip load-5" aria-label="Our four practices">
          {pillars.map((p) => (
            <li key={p.id} className={`tone-${p.tone}`}>
              <a href={`#${p.route}`}>
                <span className="strip-code">{p.code}</span>
                <span className="strip-title">{p.title}</span>
                <span className="strip-go" aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
