// Interior pages: the painted ground, torn sheet edges, 24-hour dial, plus pools of hand-drawn hairlines and
// heading underlines. Writes Hugo partials, data/art.json and the grain texture. Static inline SVG, seeded jitter.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { C, cut, strip, GRAIN } from './lib.mjs';
import { tearEdge } from './tear.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const out = (p, body) => { const f = path.join(root, p); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, body); console.log(p, Buffer.byteLength(body), 'bytes'); };

// seeded rng (same family as river-2); cut() in lib uses its own, so brush strokes are jittered here too
let s = 41;
const rnd = () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const j = (a) => (rnd() * 2 - 1) * a;
const f = (n) => n.toFixed(1);

// ---------- paint helpers ----------
// a loose brush stroke: a curved centreline, width swelling then thinning, ragged outline
function brush(x1, y1, x2, y2, w, bow = 0.12, n = 9) {
  const pts = [], ws = [];
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
  const b = bow * len * (rnd() < 0.5 ? -1 : 1);
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1), c = Math.sin(t * Math.PI);
    pts.push([x1 + dx * t + nx * (b * c + j(w * 0.25)), y1 + dy * t + ny * (b * c + j(w * 0.25))]);
    ws.push(Math.max(1.5, w * (0.35 + 0.65 * Math.sin(Math.min(1, t * 1.15 + 0.08) * Math.PI)) * (0.8 + rnd() * 0.4)));
  }
  return cut(strip(pts, ws), 1.6, 14);
}
const mark = (d, fill, op) => `<path d="${d}" fill="${fill}" opacity="${op}"/>`;

// hand-drawn wobbly hairline, stretched to its box
function hairline(vw = 600, amp = 1.3) {
  const pts = [];
  for (let x = 0; x < vw; x += 22) pts.push([x, 4 + j(amp)]); pts.push([vw, 4 + j(amp)]);
  return `<svg class="hair" viewBox="0 0 ${vw} 8" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M${pts.map(([x, y]) => f(x) + ' ' + f(y)).join('L')}" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
// short vermilion brush underline for h2
function underline() {
  const d = brush(2, 6 + j(0.8), 118, 5 + j(1.2), 5.2, 0.05, 8);
  const d2 = brush(10, 8.4, 84, 8 + j(1), 2.2, 0.04, 6);
  return `<svg class="ul" viewBox="0 0 120 12" aria-hidden="true" focusable="false"><path d="${d}" fill="${C.ver}"/><path d="${d2}" fill="${C.ver}" opacity=".7"/></svg>`;
}
// torn edges (paper on the chalk side). Every sheet edge comes from tearEdge, then jittered with cut().
const gentle = [[110, 4.6], [34, 2]];
function tornH(top, seed) {
  const L = 1000, base = 15;
  const { edge, rim } = tearEdge({ len: L, seed, base: () => base, wander: gentle, chips: 5, rimMax: 5, rimDir: top ? -1 : 1, pad: 14, step: 8 });
  const clos = top ? [[L + 20, 44], [-20, 44]] : [[L + 20, -14], [-20, -14]];
  const m = (pts) => cut(pts.map(([t, o]) => [t, o]).concat(clos), 0.9, 20);
  return `<svg class="edge ${top ? 'et' : 'eb'}" viewBox="0 0 1000 30" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="${m(rim)}" fill="var(--rim)"/><path d="${m(edge)}" fill="var(--chalk)"/></svg>`;
}
function tornV(left, seed) {
  const L = 2000, base = left ? 14 : 10;
  const { edge, rim } = tearEdge({ len: L, seed, base: () => base, wander: gentle, chips: 14, rimMax: 5, rimDir: left ? -1 : 1, pad: 14, step: 10 });
  const clos = left ? [[34, L + 20], [34, -20]] : [[-10, L + 20], [-10, -20]];
  const m = (pts) => cut(pts.map(([t, o]) => [o, t]).concat(clos), 0.9, 24);
  return `<svg class="edge ${left ? 'el' : 'er'}" viewBox="0 0 24 ${L}" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="${m(rim)}" fill="var(--rim)"/><path d="${m(edge)}" fill="var(--chalk)"/></svg>`;
}

// loose abstract marks on the painted ground (fixed backdrop, viewBox 1440x900, slice)
const marks = [
  [760, 30, 1010, 46, 26, '#c79a35', .34], [640, 88, 940, 74, 18, '#d63a1f', .26], [520, 108, 700, 118, 12, '#0d3329', .5],
  [60, 120, 270, 90, 34, '#c79a35', .3], [30, 300, 250, 340, 22, '#0d3329', .55], [90, 470, 290, 440, 40, '#d63a1f', .22],
  [40, 640, 240, 700, 26, '#c79a35', .28], [130, 800, 300, 770, 18, '#0d3329', .5],
  [1180, 70, 1400, 110, 30, '#d63a1f', .24], [1150, 260, 1390, 220, 38, '#0d3329', .55], [1200, 430, 1410, 480, 20, '#c79a35', .32],
  [1160, 610, 1380, 570, 30, '#c79a35', .26], [1190, 780, 1400, 820, 24, '#d63a1f', .22], [1110, 870, 1330, 850, 14, '#0d3329', .5],
].map(([a, b, c, d, w, fill, op]) => mark(brush(a, b, c, d, w, 0.1), fill, op)).join('');
const backdrop = `<svg class="paint" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">${marks}</svg>`;

// optional 24-hour ring: 08:30, 09:00, 20:30
function ring() {
  const cx = 100, cy = 100, r = 74;
  const ang = (h) => (h / 24) * Math.PI * 2 - Math.PI / 2;
  const P = (h, rad) => [cx + Math.cos(ang(h)) * rad, cy + Math.sin(ang(h)) * rad];
  const loop = Array.from({ length: 36 }, (_, i) => { const a = (i / 36) * Math.PI * 2; const rr = r + j(1.6); return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]; });
  const ringPath = cut(strip(loop.concat([loop[0]]), Array.from({ length: 37 }, () => 6 + rnd() * 3)), 0.8, 16);
  const hours = [0, 6, 12, 18].map((h) => { const [x1, y1] = P(h, r - 10), [x2, y2] = P(h, r - 20), [tx, ty] = P(h, r - 32); return `<path d="M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}" stroke="${C.ink}" stroke-width="1.6" stroke-linecap="round"/><text x="${f(tx)}" y="${f(ty + 4)}" text-anchor="middle" font-size="11" fill="${C.ink}" style="font-family:var(--sans);font-variant-numeric:tabular-nums">${String(h).padStart(2, '0')}</text>`; }).join('');
  const tick = (h, col) => { const [x1, y1] = P(h, r - 12), [x2, y2] = P(h, r + 17); return `<path d="${cut(strip([[x1, y1], [x2, y2]], 4.6), 0.5, 8)}" fill="${col}"/>`; };
  return `<svg class="clock" viewBox="0 0 200 200" role="img" aria-label="A 24-hour dial with marks at 08:30, 09:00 and 20:30" focusable="false"><path d="${ringPath}" fill="${C.linen ?? '#d3c9a6'}" opacity=".7"/>${hours}${tick(8.5, C.ver)}${tick(9, C.ochre)}${tick(20.5, C.green)}</svg>`;
}

// ---------- outputs ----------
const HAIRS = 10, ULS = 8;
const clock = ring();
const hair = Array.from({ length: HAIRS }, () => hairline());
const ul = Array.from({ length: ULS }, () => underline());
const edges = tornH(true, 5) + tornV(true, 17) + tornV(false, 29) + tornH(false, 53);

out('layouts/partials/art/ground.html', backdrop + '\n');
out('layouts/partials/art/sheet-edges.html', edges + '\n');
out('layouts/partials/art/clock.html', clock + '\n');
out('data/art.json', JSON.stringify({ hair, ul }, null, 0) + '\n');
out('static/img/grain.png', Buffer.from(GRAIN, 'base64'));
