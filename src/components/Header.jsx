import { useEffect, useRef, useState } from 'react';
import Logo from './Logo.jsx';
import { nav, pillars, industries } from '../data/content.js';

const selectIndustry = (id) => window.dispatchEvent(new CustomEvent('bhumaji:industry', { detail: id }));

function ServicesMega({ onNavigate }) {
  return (
    <div className="mega-grid mega-services">
      {pillars.map((p) => (
        <a key={p.id} href={`#${p.route}`} className={`mega-pillar tone-${p.tone}`} onClick={onNavigate}>
          <span className="mega-code">{p.code}</span>
          <span className="mega-title">{p.title}</span>
          <span className="mega-lede">{p.lede}</span>
          <span className="mega-items">{p.items.slice(0, 3).join(' · ')}</span>
          <span className="mega-go">View service <span aria-hidden="true">→</span></span>
        </a>
      ))}
      <div className="mega-aside">
        <p className="mega-aside-title">Not sure where to start?</p>
        <p>A 30-minute architecture call maps your next three moves.</p>
        <a href="#contact" className="btn btn-primary btn-sm" onClick={onNavigate}>Book a consultation</a>
      </div>
    </div>
  );
}

function IndustriesMega({ onNavigate }) {
  return (
    <div className="mega-grid mega-industries">
      {industries.map((ind) => (
        <a
          key={ind.id}
          href="#industries"
          className="mega-industry"
          onClick={() => {
            selectIndustry(ind.id);
            onNavigate();
          }}
        >
          <span className="mega-title">{ind.name}</span>
          <span className="mega-lede">{ind.build.join(' · ')}</span>
        </a>
      ))}
    </div>
  );
}

export default function Header({ current }) {
  const [open, setOpen] = useState(null); // which mega menu is open
  const [drawer, setDrawer] = useState(false);
  const [expanded, setExpanded] = useState(null); // mobile accordion
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(null);
        setDrawer(false);
      }
    };
    const onClick = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) setOpen(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('no-scroll', drawer);
  }, [drawer]);

  useEffect(() => {
    setOpen(null);
    setDrawer(false);
  }, [current]);

  const openMenu = (id) => {
    clearTimeout(closeTimer.current);
    setOpen(id);
  };
  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 180);
  };
  const closeAll = () => {
    setOpen(null);
    setDrawer(false);
  };

  const isActive = (href) => href.replace('#', '') === current;

  return (
    <header ref={headerRef} className={`site-header${scrolled || open ? ' is-solid' : ''}`}>
      <div className="header-bar band-dark">
      <div className="wrap header-row">
        <Logo />

        <nav className="desk-nav" aria-label="Primary">
          <ul>
            {nav.map((item) =>
              item.mega ? (
                <li key={item.label} onMouseEnter={() => openMenu(item.mega)} onMouseLeave={scheduleClose}>
                  <button
                    type="button"
                    className={`nav-link has-mega${open === item.mega ? ' is-open' : ''}`}
                    aria-expanded={open === item.mega}
                    aria-controls={`mega-${item.mega}`}
                    onClick={() => setOpen(open === item.mega ? null : item.mega)}
                  >
                    {item.label}
                    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
                  </button>
                </li>
              ) : (
                <li key={item.label}>
                  <a href={item.href} className={`nav-link${isActive(item.href) ? ' is-current' : ''}`} aria-current={isActive(item.href) ? 'page' : undefined}>
                    {item.label}
                  </a>
                </li>
              )
            )}
          </ul>
        </nav>

        <a href="#contact" className="btn btn-primary btn-sm header-cta">Contact</a>

        <button
          type="button"
          className={`burger${drawer ? ' is-open' : ''}`}
          aria-expanded={drawer}
          aria-controls="mobile-nav"
          aria-label={drawer ? 'Close menu' : 'Open menu'}
          onClick={() => setDrawer(!drawer)}
        >
          <span /><span />
        </button>
      </div>
      </div>

      {['services', 'industries'].map((id) => (
        <div
          key={id}
          id={`mega-${id}`}
          className={`mega${open === id ? ' is-open' : ''}`}
          onMouseEnter={() => openMenu(id)}
          onMouseLeave={scheduleClose}
          hidden={open !== id}
        >
          <div className="wrap">
            <div className="mega-head">
              <span className="eyebrow">{id === 'services' ? 'What we do' : 'Industries we serve'}</span>
              <a href={id === 'services' ? '#what-we-do' : '#industries'} onClick={closeAll} className="mega-all">
                {id === 'services' ? 'See all capabilities' : 'Explore industries'} <span aria-hidden="true">→</span>
              </a>
            </div>
            {id === 'services' ? <ServicesMega onNavigate={closeAll} /> : <IndustriesMega onNavigate={closeAll} />}
          </div>
        </div>
      ))}

      <div id="mobile-nav" className={`drawer${drawer ? ' is-open' : ''}`} hidden={!drawer}>
        <nav className="drawer-inner" aria-label="Mobile">
          <ul className="drawer-list">
            {nav.map((item) => (
              <li key={item.label}>
                {item.mega ? (
                  <>
                    <button
                      type="button"
                      className="drawer-link"
                      aria-expanded={expanded === item.mega}
                      onClick={() => setExpanded(expanded === item.mega ? null : item.mega)}
                    >
                      {item.label}
                      <span className={`drawer-plus${expanded === item.mega ? ' is-open' : ''}`} aria-hidden="true" />
                    </button>
                    <div className="drawer-sub" hidden={expanded !== item.mega}>
                      <a href={item.href} onClick={closeAll} className="drawer-sublink is-overview">Overview</a>
                      {item.mega === 'services'
                        ? pillars.map((p) => (
                            <a key={p.id} href={`#${p.route}`} onClick={closeAll} className={`drawer-sublink tone-${p.tone}`}>
                              <span className="dot" aria-hidden="true" />{p.title}
                            </a>
                          ))
                        : industries.map((ind) => (
                            <a key={ind.id} href="#industries" onClick={() => { selectIndustry(ind.id); closeAll(); }} className="drawer-sublink">
                              {ind.name}
                            </a>
                          ))}
                    </div>
                  </>
                ) : (
                  <a href={item.href} className="drawer-link" onClick={closeAll}>{item.label}</a>
                )}
              </li>
            ))}
            <li><a href="#contact" className="drawer-link" onClick={closeAll}>Contact</a></li>
          </ul>
          <div className="drawer-foot">
            <p>Cloud. Intelligence. Engineering.</p>
            <a href="#contact" className="btn btn-primary" onClick={closeAll}>Let&rsquo;s Talk</a>
          </div>
        </nav>
      </div>
    </header>
  );
}
