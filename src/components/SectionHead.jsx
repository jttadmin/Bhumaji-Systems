export default function SectionHead({ id, eyebrow, title, aside, children }) {
  return (
    <header className="section-head">
      <div className="section-head-main">
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id} className="section-title">{title}</h2>
      </div>
      {aside && <p className="section-aside">{aside}</p>}
      {children}
    </header>
  );
}
