/* Abstract illustrations — one visual identity per service pillar. */

function iso(x, y, z) {
  // isometric projection helper
  return [200 + (x - y) * 0.866 * 100, 230 + (x + y) * 0.5 * 100 - z];
}
function plate(z, s = 1.25) {
  const pts = [iso(-s, -s, z), iso(s, -s, z), iso(s, s, z), iso(-s, s, z)];
  return pts.map((p) => p.join(',')).join(' ');
}

export function CloudMotif() {
  const layers = [
    { z: 0, label: 'data' },
    { z: 70, label: 'eks · compute' },
    { z: 140, label: 'network · vpc' },
  ];
  return (
    <svg viewBox="0 0 400 400" className="motif motif-cloud" aria-hidden="true">
      <defs>
        <pattern id="mc-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="currentColor" strokeOpacity="0.08" />
        </pattern>
      </defs>
      <rect width="400" height="400" fill="url(#mc-grid)" />
      {[-1, 1].map((sx) =>
        [-1, 1].map((sy) => {
          const a = iso(sx * 1.25, sy * 1.25, 0);
          const b = iso(sx * 1.25, sy * 1.25, 140);
          return <line key={`${sx}${sy}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="currentColor" strokeOpacity="0.35" strokeDasharray="3 5" />;
        })
      )}
      {layers.map((l, i) => (
        <g key={l.label} className={`mc-layer mc-layer-${i}`}>
          <polygon points={plate(l.z)} fill="currentColor" fillOpacity={0.05 + i * 0.05} stroke="currentColor" strokeOpacity="0.8" />
          {[-0.6, 0, 0.6].map((x) => {
            const [cx, cy] = iso(x, 0.2, l.z);
            return <rect key={x} x={cx - 9} y={cy - 6} width="18" height="10" rx="2" fill="currentColor" fillOpacity="0.55" />;
          })}
          <text x={iso(1.25, -1.25, l.z)[0] + 10} y={iso(1.25, -1.25, l.z)[1] + 4} className="motif-label" fill="currentColor">{l.label}</text>
        </g>
      ))}
    </svg>
  );
}

export function AiMotif() {
  const layers = [[90, 160, 230, 300], [70, 130, 190, 250, 310], [120, 200, 280], [200]];
  const xs = [70, 165, 260, 345];
  const nodes = layers.map((col, i) => col.map((y) => [xs[i], y]));
  const edges = [];
  for (let i = 0; i < nodes.length - 1; i++) nodes[i].forEach((a) => nodes[i + 1].forEach((b) => edges.push([a, b])));
  return (
    <svg viewBox="0 0 400 400" className="motif motif-ai" aria-hidden="true">
      {Array.from({ length: 19 }).map((_, r) =>
        Array.from({ length: 19 }).map((__, c) => <circle key={`${r}-${c}`} cx={10 + c * 21} cy={10 + r * 21} r="0.9" fill="currentColor" fillOpacity="0.18" />)
      )}
      {edges.map(([a, b], i) => (
        <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="currentColor" strokeOpacity="0.22" />
      ))}
      {edges.filter((_, i) => i % 4 === 0).map(([a, b], i) => (
        <line key={`p${i}`} className="ai-pulse" style={{ animationDelay: `${(i % 7) * 0.45}s` }} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="currentColor" strokeWidth="1.6" />
      ))}
      {nodes.flat().map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="9" fill="var(--bg)" stroke="currentColor" strokeOpacity="0.9" />
          <circle cx={x} cy={y} r="3" fill="currentColor" />
        </g>
      ))}
      <text x="345" y="232" textAnchor="middle" className="motif-label" fill="currentColor">p = 0.97</text>
    </svg>
  );
}

export function SoftwareMotif() {
  const lines = [
    ['k', 'service:', 'v', ' orders-api'],
    ['k', 'runtime:', 'v', ' node20'],
    ['k', 'pipeline:', 'v', ''],
    ['i', '  - test', 'c', '   ✓ 412 passed'],
    ['i', '  - build', 'c', '  ✓ image 84MB'],
    ['i', '  - scan', 'c', '   ✓ 0 critical'],
    ['i', '  - deploy', 'c', ' → canary 10%'],
    ['k', 'slo:', 'v', ' 99.95%'],
  ];
  return (
    <svg viewBox="0 0 400 400" className="motif motif-software" aria-hidden="true">
      <rect x="40" y="70" width="320" height="260" rx="10" fill="var(--bg)" fillOpacity="0.6" stroke="currentColor" strokeOpacity="0.5" />
      <line x1="40" y1="98" x2="360" y2="98" stroke="currentColor" strokeOpacity="0.3" />
      {[58, 72, 86].map((x) => <circle key={x} cx={x} cy="84" r="4" fill="currentColor" fillOpacity="0.4" />)}
      <text x="200" y="88" textAnchor="middle" className="motif-label" fill="currentColor">service.yaml</text>
      {lines.map((l, i) => (
        <text key={i} x="62" y={130 + i * 24} className="motif-code">
          <tspan fill="currentColor" fillOpacity={l[0] === 'k' ? 1 : 0.75}>{l[1]}</tspan>
          <tspan fill={l[2] === 'c' ? 'var(--teal)' : 'var(--ink)'} fillOpacity="0.85">{l[3]}</tspan>
        </text>
      ))}
      <rect x="62" y="306" width="8" height="14" fill="currentColor" className="caret" />
    </svg>
  );
}

export function MobileMotif() {
  const phone = (x, y, rot, depth) => (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={depth}>
      <rect x="-62" y="-120" width="124" height="240" rx="18" fill="var(--bg)" stroke="currentColor" strokeOpacity="0.85" />
      <rect x="-20" y="-110" width="40" height="6" rx="3" fill="currentColor" fillOpacity="0.4" />
      <rect x="-48" y="-90" width="96" height="58" rx="8" fill="currentColor" fillOpacity="0.22" />
      <rect x="-48" y="-22" width="62" height="8" rx="4" fill="currentColor" fillOpacity="0.6" />
      <rect x="-48" y="-8" width="80" height="6" rx="3" fill="currentColor" fillOpacity="0.25" />
      {[0, 1, 2].map((r) => (
        <g key={r}>
          <rect x="-48" y={12 + r * 30} width="22" height="22" rx="6" fill="currentColor" fillOpacity="0.35" />
          <rect x="-20" y={16 + r * 30} width="60" height="5" rx="2.5" fill="currentColor" fillOpacity="0.45" />
          <rect x="-20" y={26 + r * 30} width="40" height="4" rx="2" fill="currentColor" fillOpacity="0.2" />
        </g>
      ))}
      <rect x="-48" y="100" width="96" height="12" rx="6" fill="currentColor" fillOpacity="0.8" />
    </g>
  );
  return (
    <svg viewBox="0 0 400 400" className="motif motif-mobile" aria-hidden="true">
      <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeOpacity="0.12" />
      <circle cx="200" cy="200" r="105" fill="none" stroke="currentColor" strokeOpacity="0.08" />
      {phone(150, 210, -10, 0.55)}
      {phone(245, 195, 7, 1)}
      <text x="330" y="70" textAnchor="end" className="motif-label" fill="currentColor">iOS · Android · Web</text>
    </svg>
  );
}

export const motifFor = { cloud: CloudMotif, ai: AiMotif, software: SoftwareMotif, mobile: MobileMotif };
