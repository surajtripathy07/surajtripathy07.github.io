// Clankers page meme: the expanding-brain format, painted from scratch. One root svg, four rows (caption card on the
// left, a dark cell with a growing brain in a faceless profile head on the right). Writes
// layouts/partials/art/meme-tokens.html. Seeded jitter comes from lib.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { C, rect, ell, strip, P } from './lib.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const W = 800, H = 1040, X0 = 20, Y0 = 20, RH = 250, CX = 436, RX1 = 780;
const f = (n) => n.toFixed(1);
const q = (pts, fill, o = {}) => P(pts, fill, { amp: 0.7, seg: 18, ...o });
const lim = (pts, w, fill, o = {}) => q(strip(pts, w), fill, { amp: 0.3, seg: 40, ...o });
const FONT = "'Hanken Grotesk','Helvetica Neue',Arial,sans-serif";
const LINES = [['Write the code'], ['Ask AI to', 'write the code'], ['Have AI', 'send agents', 'to write it'], ['Agents briefing', 'agents briefing', 'agents']];
const LABEL = 'Expanding brain meme. Write the code. Ask AI to write the code. Have AI send agents to write it. Agents briefing agents briefing agents.';

// loose brush strokes: wide, low-opacity bands that give a ground a painted look
function strokes(x, y, w, h, cols, n, op) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const yy = y + (i + 0.5) * (h / n), x0 = x - 20 + ((i * 97) % 60), x1 = x + w + 20 - ((i * 53) % 70);
    s += `<g opacity="${op}">${q(strip([[x0, yy], [(x0 + x1) / 2, yy + (i % 2 ? 5 : -5)], [x1, yy]], (h / n) * 1.5), cols[i % cols.length], { amp: 3, seg: 60 })}</g>`;
  }
  return s;
}
const halo = (cx, cy, rx, ry, col, op) => `<g opacity="${op}">${q(ell(cx, cy, rx, ry, 14), col, { amp: 3, seg: 30 })}</g>`;

// faceless side-profile head facing right, local to a cell origin
const HEAD = [[60, 118], [78, 62], [130, 28], [196, 24], [252, 52], [282, 100], [292, 124], [314, 152], [292, 162], [294, 180], [282, 206], [244, 218], [206, 226], [200, 250], [86, 250], [80, 196], [62, 156]];
const head = (ox, oy, fill) => q(HEAD.map(([x, y]) => [ox + x * 1.04 - 6, oy + y * 1.04 - 4]), C.ink, { amp: 0.5, seg: 14 }) + q(HEAD.map(([x, y]) => [ox + x, oy + y]), fill, { amp: 0.8, seg: 14 });

// a brain: five lobes, a cerebellum, a stem and a few folds
function brain(cx, cy, s, col, hi, ln) {
  const L = [[-34, -6, 34, 26], [0, -18, 36, 28], [34, -8, 32, 26], [-20, 14, 30, 22], [20, 16, 30, 22]];
  let o = lim([[cx + 6 * s, cy + 22 * s], [cx + 12 * s, cy + 52 * s]], 12 * s + 5, C.ink, { amp: 0.2 }) + lim([[cx + 6 * s, cy + 22 * s], [cx + 12 * s, cy + 52 * s]], 12 * s, ln, { amp: 0.2 });
  o += q(ell(cx + 32 * s, cy + 34 * s, 20 * s + 2.5, 13 * s + 2.5, 10), C.ink, { amp: 0.3, seg: 10 }) + q(ell(cx + 32 * s, cy + 34 * s, 20 * s, 13 * s, 10), ln, { amp: 0.3, seg: 10 });
  o += L.map(([dx, dy, rx, ry]) => q(ell(cx + dx * s, cy + dy * s, rx * s + 2.6, ry * s + 2.6, 11), C.ink, { amp: 0.3, seg: 10 })).join('');
  o += L.map(([dx, dy, rx, ry]) => q(ell(cx + dx * s, cy + dy * s, rx * s, ry * s, 11), col, { amp: 0.3, seg: 10 })).join('');
  o += L.map(([dx, dy, rx, ry]) => q(ell(cx + (dx - 4) * s, cy + (dy - 7) * s, rx * s * 0.55, ry * s * 0.4, 9), hi, { amp: 0.25, seg: 10 })).join('');
  [[[-52, -2], [-40, -12], [-26, -6]], [[-8, -26], [4, -14], [18, -20]], [[24, 0], [36, -8], [50, 0]], [[-30, 18], [-14, 12], [2, 20]], [[10, 20], [26, 12], [42, 20]]].forEach((pts) => { o += lim(pts.map(([x, y]) => [cx + x * s, cy + y * s]), 2.6 * s, ln, { amp: 0.15, seg: 12 }); });
  return o;
}
// thin tapered rays from a centre; lengths vary per ray
function rays(cx, cy, n, r0, r1, half, cols, a0) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = a0 + (i / n) * Math.PI * 2, len = r1 * (0.7 + 0.3 * ((i * 37) % 10) / 10), h = half * (0.8 + 0.4 * ((i * 17) % 7) / 7);
    const pt = (r, da) => [cx + Math.cos(a + da) * r, cy + Math.sin(a + da) * r];
    s += q([pt(r0, -h), pt(len, 0), pt(r0, h)], cols[i % cols.length], { amp: 0.4, seg: 60 });
  }
  return s;
}
const dots = (ox, oy, pts) => pts.map(([x, y, r]) => q(ell(ox + x, oy + y, r, r, 6), C.chalk, { amp: 0.15, seg: 6 })).join('');

// brain fill, highlight, fold colour and scale per row: dim grey-green, ochre glow, bright ver/ochre, blazing
const BRAINS = [[C.green, C.soft, C.deep, 0.75], [C.ochre2, C.lit, C.ver2, 1.0], [C.ochre, C.lit, C.ver, 1.1], [C.ochre, C.lit, C.ver, 1.3]];

// the four right cells
function cell(i) {
  const ox = CX, oy = Y0 + i * RH, bx = ox + 178, by = oy + 100;
  let s = q(rect(ox, oy, RX1 - ox, RH), i === 3 ? C.ink : C.deep, { amp: 1, seg: 40 }) + strokes(ox, oy, RX1 - ox, RH, [C.shade, C.green, C.ink], 5, 0.3);
  if (i === 1) s += halo(bx, by, 150, 120, C.ochre, 0.14) + halo(bx, by, 100, 80, C.ochre, 0.18);
  if (i === 2) s += halo(bx, by, 190, 150, C.ver, 0.2) + halo(bx, by, 130, 100, C.ochre, 0.24) + halo(bx, by, 80, 65, C.lit, 0.3);
  if (i === 3) s += halo(bx, by, 330, 260, C.ver2, 0.3) + halo(bx, by, 230, 180, C.ochre, 0.3) + halo(bx, by, 150, 120, C.lit, 0.4) + halo(bx, by, 90, 75, C.chalk, 0.5);
  s += head(ox, oy, [C.soft, C.green, C.ver2, C.chalk][i]);
  if (i === 2) s += rays(bx, by, 9, 56, 120, 0.07, [C.ochre, C.ver, C.lit], 0.3);
  if (i === 3) s += rays(bx, by, 26, 70, 330, 0.05, [C.lit, C.chalk, C.ochre], 0.1) + rays(bx, by, 13, 70, 210, 0.09, [C.ochre, C.ver], 0.35);
  const [bc, bh, bl, bs] = BRAINS[i];
  s += brain(bx, by, bs, bc, bh, bl);
  if (i === 3) s += dots(ox, oy, [[22, 24, 3.2], [300, 30, 2.6], [320, 120, 3], [30, 150, 2.4], [310, 220, 3.4], [40, 228, 2.6], [150, 14, 2.2], [262, 14, 2.4], [14, 90, 2.2], [330, 70, 2]]);
  return `<clipPath id="mt-r${i}"><rect x="${ox}" y="${oy}" width="${RX1 - ox}" height="${RH}"/></clipPath><g clip-path="url(#mt-r${i})">${s}</g>`;
}
// the left caption card: linen paper, bold sans, left-aligned and vertically centred
function card(i) {
  const oy = Y0 + i * RH, ls = LINES[i], y1 = oy + RH / 2 - ((ls.length - 1) * 48) / 2 + 13;
  return q(rect(X0, oy, CX - X0, RH), C.chalk, { amp: 1, seg: 40 }) + strokes(X0, oy, CX - X0, RH, [C.linen, C.chalk], 4, 0.35) +
    `<text x="${X0 + 30}" y="${f(y1)}" font-family="${FONT}" font-size="40" font-weight="700" fill="${C.ink}">${ls.map((t, k) => `<tspan x="${X0 + 30}" dy="${k ? 48 : 0}">${t}</tspan>`).join('')}</text>`;
}

let body = `<defs><filter id="mt-g" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 .07  0 0 0 0 .08  0 0 0 0 .07  0 0 0 1.6 -.55"/></filter></defs>`;
body += q(rect(4, 4, W - 8, H - 8), C.ochre, { amp: 1.5, seg: 40, sh: [3, 4], sho: 0.4 }) + q(rect(12, 12, W - 24, H - 24), C.ink, { amp: 1, seg: 40 });
for (let i = 0; i < 4; i++) body += card(i) + cell(i);
for (let i = 1; i < 4; i++) body += q(rect(X0, Y0 + i * RH - 3, RX1 - X0, 6), C.ink, { amp: 0.8, seg: 40 });
body += q(rect(CX - 3, Y0, 6, 4 * RH), C.ink, { amp: 0.8, seg: 40 });
body += `<rect x="12" y="12" width="${W - 24}" height="${H - 24}" filter="url(#mt-g)" opacity=".55"/>`;
const out = `<div class="meme-tk" role="img" aria-label="${LABEL}"><svg class="meme-tk-p" viewBox="0 0 ${W} ${H}" aria-hidden="true" focusable="false">\n${body}\n</svg></div>\n`;
const rel = 'layouts/partials/art/meme-tokens.html';
const file = path.join(root, rel);
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, out);
console.log(rel, Buffer.byteLength(out), 'bytes');
