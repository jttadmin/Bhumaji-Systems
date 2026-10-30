import { useEffect, useState } from 'react';

/** Current location.hash without the leading '#'. */
export function useHash() {
  const read = () => (typeof window === 'undefined' ? '' : window.location.hash.replace(/^#/, ''));
  const [hash, setHash] = useState(read);
  useEffect(() => {
    const onChange = () => setHash(read());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return hash;
}

/** Subscribe to a CSS media query. */
export function useMedia(query, fallback = false) {
  const get = () => (typeof window === 'undefined' || !window.matchMedia ? fallback : window.matchMedia(query).matches);
  const [matches, setMatches] = useState(get);
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
