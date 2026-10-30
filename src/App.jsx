import { useEffect } from 'react';
import { useHash } from './hooks.js';
import { pillars } from './data/content.js';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import ServicePage from './pages/ServicePage.jsx';
import ChatWidget from './components/ChatWidget.jsx';

/*
 * Lightweight hash routing: '#service-cloud' etc. open a service detail page,
 * any other hash scrolls to that section on the homepage.
 * Swap for react-router when more pages are added.
 */
export default function App() {
  const hash = useHash();
  const pillar = pillars.find((p) => p.route === hash);

  useEffect(() => {
    if (pillar || !hash || hash === 'top') {
      window.scrollTo({ top: 0 });
      return;
    }
    const el = document.getElementById(hash);
    if (el) requestAnimationFrame(() => el.scrollIntoView({ block: 'start' }));
  }, [hash, pillar]);

  useEffect(() => {
    document.title = pillar
      ? `${pillar.title} — Bhumaji Systems`
      : 'Bhumaji Systems — Cloud. Intelligence. Engineering.';
  }, [pillar]);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header current={hash} />
      <main id="main" tabIndex={-1}>
        {pillar ? <ServicePage pillar={pillar} /> : <Home />}
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
