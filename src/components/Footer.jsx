import Logo from './Logo.jsx';
import { pillars, site } from '../data/content.js';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <p className="footer-mega" aria-hidden="true">Cloud. Intelligence. Engineering.</p>
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo />
            <p>Technology transformation and digital engineering for startups, growing businesses and enterprises.</p>
          </div>
          <nav aria-label="Services">
            <p className="footer-label">Services</p>
            <ul>{pillars.map((p) => <li key={p.id}><a href={`#${p.route}`}>{p.title}</a></li>)}</ul>
          </nav>
          <nav aria-label="Company">
            <p className="footer-label">Company</p>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#industries">Industries</a></li>
              <li><a href="#work">Featured work</a></li>
              <li><a href="#insights">Insights</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </nav>
          <div>
            <p className="footer-label">Location</p>
            <p>{site.location}</p>
            <a href="#contact" className="btn btn-primary btn-sm footer-cta">Let&rsquo;s Talk</a>
          </div>
        </div>
        <div className="footer-base">
          <span>© {new Date().getFullYear()} Bhumaji Systems. All rights reserved.</span>
          <span>Case studies and testimonials shown are illustrative placeholders.</span>
        </div>
      </div>
    </footer>
  );
}
