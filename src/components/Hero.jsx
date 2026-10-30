import HeroCanvas from './HeroCanvas.jsx';
import { hero, pillars } from '../data/content.js';

export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-grid-bg" aria-hidden="true" />
      <div className="wrap hero-inner">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow load-1">
            <span className="pulse" aria-hidden="true" />
            {hero.eyebrow}
          </p>
          <h1 id="hero-title" className="hero-title">
            <span className="hero-line load-2">{hero.lineOne}</span>
            <span className="hero-line hero-line-2 load-3">
              Powering <em>Digital Transformation.</em>
            </span>
          </h1>
          <p className="hero-body load-4">{hero.body}</p>
          <div className="hero-ctas load-5">
            <a href={hero.primaryCta.href} className="btn btn-primary btn-lg">
              {hero.primaryCta.label}
              <span aria-hidden="true">→</span>
            </a>
            <a href={hero.secondaryCta.href} className="btn btn-ghost btn-lg">{hero.secondaryCta.label}</a>
          </div>
        </div>

        <div className="hero-visual load-visual">
          <HeroCanvas />
          <div className="hero-tags" aria-hidden="true">
            <span className="htag htag-a"><i className="ok" />cluster prod-eks · healthy</span>
            <span className="htag htag-b"><i className="lime" />model v3.2 · drift 0.4%</span>
            <span className="htag htag-c"><i className="ok" />deploy #482 · passed</span>
          </div>
        </div>
      </div>

      <div className="wrap">
        <ul className="hero-strip" aria-label="Our four disciplines">
          {pillars.map((p) => (
            <li key={p.id} className={`tone-${p.tone}`}>
              <a href={`#${p.route}`}>
                <span className="strip-code">{p.code}</span>
                <span className="strip-title">{p.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
