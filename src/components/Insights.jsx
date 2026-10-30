import { insights } from '../data/content.js';

export default function Insights() {
  return (
    <section className="section insights" id="insights" aria-labelledby="ins-title">
      <div className="wrap">
        <div className="ins-head">
          <div>
            <p className="eyebrow">Insights</p>
            <h2 id="ins-title" className="section-title small">Field notes from the engineering floor.</h2>
          </div>
          <p className="section-aside">Practical writing on cloud, MLOps and platform engineering. First articles are on the way.</p>
        </div>
        <ul className="ins-list">
          {insights.map((a) => (
            <li key={a.title} className="ins-item">
              <span className="ins-topic">{a.topic}</span>
              <span className="ins-title">{a.title}</span>
              <span className="ins-soon">Coming soon</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
