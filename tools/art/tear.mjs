// The torn edge. One generator, three uses: the sheet's vertical edge (wide), the sheet's top edge (phone),
// and the remnant left on the easel. Low-frequency wander + a few chips + the painting's own jitter helper
// (cut() from lib.mjs) for the fibres, plus a lighter rim of exposed paper that comes and goes in width.
import { cut } from './lib.mjs';

function mk(seed) {
  let s = seed | 0;
  return () => { s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function vnoise(rng, cells) {
  const v = Array.from({ length: cells + 4 }, () => rng());
  return (u) => { const i = Math.max(0, Math.floor(u)), f = u - Math.floor(u); const t = (1 - Math.cos(f * Math.PI)) / 2; return v[i] + (v[i + 1] - v[i]) * t; };
}

// o: { len, base(t), wander:[[period,amp]..], chips, bite:{at,half,depth,min?}, rimMax, rimDir, seed, pad, step }
// returns { edge:[[t,off]..], rim:[[t,off]..] }; off is the edge position along the axis, rim sits rimDir (+1/-1) beyond it.
export function tearEdge(o) {
  const rng = mk(o.seed), pad = o.pad ?? 14, step = o.step ?? 8;
  const layers = (o.wander || [[150, 9], [45, 3.2]]).map(([p, a]) => ({ p, a, n: vnoise(rng, Math.ceil((o.len + 2 * pad + 40) / p) + 3) }));
  const rn = vnoise(rng, Math.ceil((o.len + 2 * pad + 40) / 17) + 3);
  const chips = Array.from({ length: o.chips ?? 5 }, () => ({ y: rng() * o.len, h: 10 + rng() * 20, d: (rng() < 0.5 ? -1 : 1) * (2.2 + rng() * 3.6) }));
  const edge = [], rim = [];
  for (let t = -pad; t <= o.len + pad + 0.01; t += step) {
    let off = o.base(t);
    layers.forEach((L) => { off += (L.n((t + pad) / L.p) - 0.5) * 2 * L.a; });
    chips.forEach((c) => { const u = (t - c.y) / c.h; if (u > 0 && u < 1) off += c.d * Math.min(1, Math.min(u, 1 - u) * 6); });
    if (o.bite) {
      const b = o.bite, u = (t - b.at) / b.half;
      const k = u < 0 ? Math.pow(Math.max(0, 1 + u), 1.7) : Math.pow(Math.max(0, 1 - u * 1.6), 0.8);
      off += b.depth * k;
      if (b.min !== undefined && k > 0.02) off = b.depth < 0 ? Math.max(off, b.min) : Math.min(off, b.min);
    }
    const w = Math.max(0.4, rn((t + pad) / 17) * (o.rimMax ?? 6.5) - 1.2);
    edge.push([t, off]);
    rim.push([t, off + (o.rimDir ?? 1) * w]);
  }
  return { edge, rim };
}

const f = (n) => n.toFixed(1);
// closed polygon through mapped points, then the closure points (outside the viewBox), jittered by cut()
export function tornPath(pts, map, closure, amp, seg) {
  const poly = pts.map(([t, off]) => map(t, off)).concat(closure);
  return cut(poly, amp, seg);
}

// vertical torn edge, paper on the side of smaller x
export function sheetEdgeV(len, baseA, baseB, bite, seed = 31) {
  const { edge, rim } = tearEdge({
    len, seed, rimDir: 1, rimMax: 7, chips: 6,
    base: (t) => baseA + (baseB - baseA) * (t / len),
    wander: [[170, 8], [52, 3.4], [19, 1.1]],
    bite,
  });
  const map = (t, off) => [off, t];
  const clo = [[-60, len + 14], [-60, -14]];
  return { paper: tornPath(edge, map, clo, 0.9, 5), rim: tornPath(rim, map, clo, 1.6, 5) };
}
// horizontal torn edge, paper below
export function sheetEdgeH(len, baseA, baseB, bite, seed = 47) {
  const { edge, rim } = tearEdge({
    len, seed, rimDir: -1, rimMax: 5.5, chips: 4,
    base: (t) => baseA + (baseB - baseA) * (t / len),
    wander: [[110, 2.6], [34, 1.5], [14, 0.7]],
    bite,
  });
  const map = (t, off) => [t, off];
  const clo = [[len + 14, 49], [-14, 49]], clo2 = [[len + 14, 56], [-14, 56]];
  return { paper: tornPath(edge, map, clo2, 0.7, 5), rim: tornPath(rim, map, clo, 1.2, 5) };
}
// strip left on the stretcher: torn edge faces left, paper to its right, ends at xr
export function remnantPaths(xr, y1, y2, w0, seed = 59) {
  const len = y2 - y1;
  const { edge, rim } = tearEdge({
    len, seed, rimDir: -1, rimMax: 3.4, chips: 3, pad: 0, step: 6,
    base: (t) => xr - w0 + 2 * Math.sin(t / 38),
    wander: [[70, 4], [24, 1.6]],
    bite: { at: len * 0.55, half: 26, depth: 7 },
  });
  const map = (t, off) => [off, y1 + t];
  const clo = [[xr, y2], [xr, y1]];
  return { paper: tornPath(edge, map, clo, 0.5, 6), rim: tornPath(rim, map, clo, 0.9, 6) };
}
