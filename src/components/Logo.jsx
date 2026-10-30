import logoUrl from '../assets/bhumaji-logo.png';
import markUrl from '../assets/bhumaji-mark.png';

/* Official Bhumaji Systems artwork, used unchanged. Place it on a dark background. */
export function LogoMark({ size = 34 }) {
  return <img src={markUrl} width={size} height={size} alt="" aria-hidden="true" className="logo-mark" decoding="async" />;
}

export default function Logo() {
  return (
    <a href="#top" className="logo" aria-label="Bhumaji Systems home">
      <img src={logoUrl} alt="Bhumaji Systems" className="logo-img" width="168" height="42" decoding="async" />
    </a>
  );
}
