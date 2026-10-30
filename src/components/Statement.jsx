/* Dark brand-statement band (a company statement, not a customer quote). */
export default function Statement() {
  return (
    <section className="statement band-dark" aria-label="Our promise">
      <div className="wrap statement-inner">
        <p className="eyebrow">Our promise</p>
        <p className="statement-text">
          We design it, build it and run it. <span>One accountable team from the first workshop to production.</span>
        </p>
        <a href="#contact" className="btn btn-light btn-lg">Start a conversation <span aria-hidden="true">→</span></a>
      </div>
    </section>
  );
}
