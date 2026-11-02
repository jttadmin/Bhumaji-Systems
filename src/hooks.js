import { useEffect, useState } from 'react';

/** '/services/x' and '/services/x/index.html' → '/services/x/' (trailing slash, like the built files). */
export function normPath(pathname = '/') {
  let p = pathname.replace(/index\.html$/, '');
  if (!p.endsWith('/')) p += '/';
  return p;
}

/** Move to another page of the site without a full reload. */
export function navigate(url) {
  window.history.pushState(null, '', url);
  window.dispatchEvent(new Event('bhumaji:navigate'));
}

/**
 * Current { path, hash }. `initial` is used when rendering on the server (pre-rendering),
 * and the first browser render uses the same empty hash so hydration matches the built HTML.
 */
export function useLocation(initial = { path: '/', hash: '' }) {
  const read = () => ({ path: normPath(window.location.pathname), hash: window.location.hash.replace(/^#/, '') });
  const [loc, setLoc] = useState(() =>
    typeof window === 'undefined' ? initial : { path: normPath(window.location.pathname), hash: '' }
  );
  useEffect(() => {
    const onChange = () => setLoc(read());
    onChange();
    const events = ['popstate', 'hashchange', 'bhumaji:navigate'];
    events.forEach((e) => window.addEventListener(e, onChange));
    return () => events.forEach((e) => window.removeEventListener(e, onChange));
  }, []);
  return loc;
}

/** Subscribe to a CSS media query. */
export function useMedia(query, fallback = false) {
  // Start from the fallback (as the pre-rendered HTML does) and read the real value after mount.
  const [matches, setMatches] = useState(fallback);
  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener ? mql.addEventListener('change', onChange) : mql.addListener(onChange);
    return () => (mql.removeEventListener ? mql.removeEventListener('change', onChange) : mql.removeListener(onChange));
  }, [query]);
  return matches;
}

export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)');

/** 'INR' for visitors in India, 'USD' for everyone else (read after mount; pre-rendered as INR). */
export function useLocalCurrency() {
  const [cur, setCur] = useState('INR');
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (!/Calcutta|Kolkata/.test(tz)) setCur('USD');
    } catch { /* keep INR */ }
  }, []);
  return [cur, setCur];
}
