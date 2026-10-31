import { social } from '../data/content.js';

/* Simple line icons, drawn for this site. Each link shows only when its URL is set in content.js. */
const ICONS = {
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M8 10.5V17M8 7.5v.01M11.5 17v-3.6c0-1.6 1-2.6 2.3-2.6s2.2 1 2.2 2.6V17M11.5 10.5V17" />
    </>
  ),
  x: <path d="M5 4.5l14 15M19 4.5L5 19.5" />,
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.2 6.8v.01" />
    </>
  ),
  facebook: <path d="M14.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.5V4.4a19 19 0 0 0-2.3-.1c-2.3 0-3.8 1.4-3.8 3.9v2.3H9v3h2.5V21" />,
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.5 9.5v5l4.2-2.5z" />
    </>
  ),
};

export default function SocialLinks() {
  const items = social.filter((s) => s.url);
  if (!items.length) return null;
  return (
    <ul className="social" aria-label="Bhumaji Systems on social media">
      {items.map((s) => (
        <li key={s.id}>
          <a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label} title={s.label}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              {ICONS[s.id]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
