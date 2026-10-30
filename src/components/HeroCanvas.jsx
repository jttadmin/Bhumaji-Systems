import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks.js';

/*
 * A rotating "planet" of compute: a point-sphere with highlighted regions,
 * great-circle links between them and data packets travelling the links.
 * Pure Canvas 2D — no 3D library, pauses when off-screen.
 */
const TAU = Math.PI * 2;

function fibonacciSphere(n) {
  const pts = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = phi * i;
    pts.push([Math.cos(t) * r, y, Math.sin(t) * r]);
  }
  return pts;
}

function slerp(a, b, t) {
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const om = Math.acos(dot);
  if (om < 1e-4) return a;
  const s = Math.sin(om);
  const k1 = Math.sin((1 - t) * om) / s;
  const k2 = Math.sin(t * om) / s;
  return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2];
}

export default function HeroCanvas() {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const css = getComputedStyle(document.documentElement);
    const cyan = css.getPropertyValue('--cyan').trim() || '#22d3ee';
    const teal = css.getPropertyValue('--teal').trim() || '#2dd4bf';
    const lime = css.getPropertyValue('--lime').trim() || '#c6f432';

    let w = 0, h = 0, dpr = 1, raf = 0, visible = true;
    let rotY = 0.6, tiltX = -0.32, targetTilt = -0.32, targetSpin = 0;
    const small = window.innerWidth < 700;
    const points = fibonacciSphere(small ? 340 : 620);
    const nodeIdx = [12, 61, 140, 188, 233, 290, 318, 376, 402, 455, 501, 560, 587, 33].map((i) => i % points.length);
    const nodes = nodeIdx.map((i) => points[i]);
    const links = [[0, 3], [3, 5], [5, 8], [8, 11], [1, 4], [4, 7], [7, 10], [2, 6], [6, 9], [9, 12], [0, 13], [13, 2], [11, 1], [10, 5]];
    const packets = links.map((_, i) => ({ t: (i * 0.137) % 1, speed: 0.0025 + (i % 4) * 0.0009 }));

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const project = (p, R, cx, cy) => {
      const cY = Math.cos(rotY), sY = Math.sin(rotY);
      let x = p[0] * cY - p[2] * sY;
      let z = p[0] * sY + p[2] * cY;
      const cX = Math.cos(tiltX), sX = Math.sin(tiltX);
      const y = p[1] * cX - z * sX;
      z = p[1] * sX + z * cX;
      const persp = 2.6 / (2.6 + z);
      return { x: cx + x * R * persp, y: cy + y * R * persp, z, s: persp };
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const R = Math.min(w, h) * 0.36;
      const cx = w * 0.5, cy = h * 0.5;

      // atmosphere
      const g = ctx.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 1.55);
      g.addColorStop(0, 'rgba(34,211,238,0.10)');
      g.addColorStop(1, 'rgba(34,211,238,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.55, 0, TAU); ctx.fill();

      // orbit rings
      ctx.save();
      ctx.translate(cx, cy);
      [[1.32, 0.34, -0.35, 'rgba(45,212,191,0.28)'], [1.5, 0.22, 0.42, 'rgba(34,211,238,0.16)']].forEach(([k, sq, rot, col]) => {
        ctx.save(); ctx.rotate(rot); ctx.strokeStyle = col; ctx.lineWidth = 1;
        ctx.setLineDash([2, 6]);
        ctx.beginPath(); ctx.ellipse(0, 0, R * k, R * k * sq, 0, 0, TAU); ctx.stroke();
        const a = rotY * (k > 1.4 ? -1.4 : 2.1);
        ctx.setLineDash([]);
        ctx.fillStyle = k > 1.4 ? lime : teal;
        ctx.beginPath(); ctx.arc(Math.cos(a) * R * k, Math.sin(a) * R * k * sq, 3, 0, TAU); ctx.fill();
        ctx.restore();
      });
      ctx.restore();

      // sphere points
      for (const p of points) {
        const q = project(p, R, cx, cy);
        const front = (q.z * -1 + 1) / 2; // 0 back → 1 front
        ctx.fillStyle = `rgba(160,200,230,${0.08 + front * 0.5})`;
        const size = 0.6 + front * 1.1;
        ctx.fillRect(q.x - size / 2, q.y - size / 2, size, size);
      }

      // links
      links.forEach(([a, b], i) => {
        const A = nodes[a], B = nodes[b];
        ctx.beginPath();
        let started = false;
        for (let s = 0; s <= 32; s++) {
          const t = s / 32;
          const m = slerp(A, B, t);
          const lift = 1 + Math.sin(t * Math.PI) * 0.22;
          const q = project([m[0] * lift, m[1] * lift, m[2] * lift], R, cx, cy);
          if (!started) { ctx.moveTo(q.x, q.y); started = true; } else ctx.lineTo(q.x, q.y);
        }
        const mid = project(slerp(A, B, 0.5), R, cx, cy);
        const alpha = mid.z < 0.15 ? 0.55 : 0.12;
        ctx.strokeStyle = i % 5 === 0 ? `rgba(198,244,50,${alpha * 0.8})` : `rgba(34,211,238,${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // packet
        const pk = packets[i];
        const m = slerp(A, B, pk.t);
        const lift = 1 + Math.sin(pk.t * Math.PI) * 0.22;
        const q = project([m[0] * lift, m[1] * lift, m[2] * lift], R, cx, cy);
        if (q.z < 0.2) {
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = cyan; ctx.shadowBlur = 10;
          ctx.beginPath(); ctx.arc(q.x, q.y, 1.8, 0, TAU); ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // region nodes
      nodes.forEach((n, i) => {
        const q = project(n, R, cx, cy);
        if (q.z > 0.25) return;
        const front = (q.z * -1 + 1) / 2;
        ctx.strokeStyle = i % 5 === 0 ? lime : cyan;
        ctx.globalAlpha = 0.35 + front * 0.65;
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(q.x, q.y, 4 + front * 3, 0, TAU); ctx.stroke();
        ctx.fillStyle = i % 5 === 0 ? lime : cyan;
        ctx.beginPath(); ctx.arc(q.x, q.y, 1.8 + front, 0, TAU); ctx.fill();
        ctx.globalAlpha = 1;
      });
    };

    const tick = () => {
      rotY += 0.0024 + targetSpin;
      targetSpin *= 0.94;
      tiltX += (targetTilt - tiltX) * 0.05;
      packets.forEach((p) => { p.t = (p.t + p.speed) % 1; });
      draw();
      if (visible) raf = requestAnimationFrame(tick);
    };

    const onPointer = (e) => {
      const r = canvas.getBoundingClientRect();
      const ny = (e.clientY - r.top) / r.height - 0.5;
      targetTilt = -0.32 + ny * 0.5;
    };

    resize();
    draw();
    const ro = new ResizeObserver(() => { resize(); draw(); });
    ro.observe(canvas);

    let io;
    if (!reduced) {
      io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        cancelAnimationFrame(raf);
        if (visible) raf = requestAnimationFrame(tick);
      });
      io.observe(canvas);
      window.addEventListener('pointermove', onPointer, { passive: true });
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io && io.disconnect();
      window.removeEventListener('pointermove', onPointer);
    };
  }, [reduced]);

  return <canvas ref={ref} className="hero-canvas" aria-hidden="true" />;
}
