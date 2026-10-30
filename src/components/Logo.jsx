/* Placeholder brand mark — replace with the official Bhumaji Systems logo file when ready. */
export function LogoMark({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="logo-mark">
      <path
        d="M18 44h26a10 10 0 0 0 1-19.9A13 13 0 0 0 20.3 22 11 11 0 0 0 18 44Z"
        fill="none"
        stroke="var(--cyan)"
        strokeWidth="3.4"
        strokeLinejoin="round"
      />
      <path
        d="M27 27v13h7.5a3.4 3.4 0 0 0 0-6.8H27m0 0h6.3a3.1 3.1 0 0 0 0-6.2H27"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Logo() {
  return (
    <a href="#top" className="logo" aria-label="Bhumaji Systems home">
      <LogoMark />
      <span className="logo-word">
        <span className="logo-name">Bhumaji</span>
        <span className="logo-sub">Systems</span>
      </span>
    </a>
  );
}
