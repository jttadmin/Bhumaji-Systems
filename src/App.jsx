import { useEffect, useRef } from 'react';
import { useLocation, navigate, normPath } from './hooks.js';
import { pillarForPath, routes, applyMeta } from './seo.js';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import ServicePage from './pages/ServicePage.jsx';
import ChatWidget from './components/ChatWidget.jsx';

const KNOWN = new Set(routes);

/*
 * Each page has its own real URL ('/', '/services/…/'), pre-rendered to HTML at build time
 * so search engines can read it. In the browser, links between these pages switch without a
 * reload; '#section' links scroll within the page.
 */
export default function App({ initialPath = '/' }) {
  const { path, hash } = useLocation({ path: initialPath, hash: '' });
  const pillar = pillarForPath(path);
  const lastPath = useRef(path);

  // Switch pages without a reload for links to other pages of this site.
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest && e.target.closest('a[href]');
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      const to = normPath(url.pathname);
      if (!KNOWN.has(to) || to === normPath(window.location.pathname)) return;
      e.preventDefault();
      navigate(to + url.search + url.hash);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    const changedPage = lastPath.current !== path;
    lastPath.current = path;
    const el = hash && hash !== 'top' ? document.getElementById(hash) : null;
    if (el) requestAnimationFrame(() => el.scrollIntoView({ block: 'start' }));
    else if (changedPage || hash === 'top') window.scrollTo({ top: 0 });
  }, [path, hash]);

  useEffect(() => { if (lastPath.current === path) applyMeta(path); }, [path]);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header path={path} hash={hash} />
      <main id="main" tabIndex={-1}>
        {pillar ? <ServicePage pillar={pillar} /> : <Home />}
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
