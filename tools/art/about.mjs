// About page art: a Mumbai street scene (huts in front, towers behind), phone and wide compositions, plus the torn
// bottom edge as a clip-path value. Writes Hugo partials. Seeded, static inline SVG.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
let seed = 99113;
const rnd = () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const R = (a, b) => a + (b - a) * rnd();
const pick = (a) => a[Math.floor(rnd() * a.length)];
let PREC = 10;
const f = (n) => Math.round(n * PREC) / PREC;
const J = (n, m = 1) => n + R(-m, m);
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export const mix = (a, b, t) => { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };
const rect = (x, y, w, h, fill, ex = '') => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${fill}"${ex}/>`;
const poly = (pts, fill, ex = '') => `<polygon points="${pts.map((p) => f(J(p[0], .5)) + ',' + f(J(p[1], .5))).join(' ')}" fill="${fill}"${ex}/>`;
const ln = (d, w = 1, c = INK, ex = '') => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${ex}/>`;
const circ = (x, y, r, fill, ex = '') => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${fill}"${ex}/>`;
const INK = '#16120f', BULB = '#ffd37a';
let SID = '';
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const wallBrick = ['#a8553c', '#94483a', '#b9684a', '#8d4636'];
const wallPly = ['#b99468', '#a68558', '#c4a27a', '#9a7a52'];
const wallPaint = ['#4f8a86', '#cfa04a', '#8fa0b2', '#c26a78', '#6f9a63'];
const tin = ['#9d5a3b', '#b36a45', '#7e5642', '#8e8c88', '#a5a29b', '#6f6d6a', '#b4532f', '#c08057'];
const tarp = ['#2f6fb3', '#2a5f9e', '#3a7cc0', '#1f4f86', '#2f6fb3'];
const clothes = ['#f1e6d2', '#c8453a', '#2f72b0', '#e6b84a', '#3e8d86', '#efa7a0'];

function roofLine(x, y, w, slope, col) {
  const y0 = y, y1 = y - slope;
  let s = poly([[x - 5, y0 + 5], [x + w + 5, y1 + 5], [x + w + 5, y1 - 7], [x - 5, y0 - 7]], col);
  let d = ''; for (let xx = x - 3; xx < x + w + 4; xx += 5) { const yy = y0 + (y1 - y0) * ((xx - x) / w); d += `M${f(xx)} ${f(yy - 7)} L${f(xx)} ${f(yy + 5)} `; }
  s += ln(d, .8, mix(col, INK, .5), ' opacity=".7"');
  s += ln(`M${f(x - 5)} ${f(y0 + 5)} L${f(x + w + 5)} ${f(y1 + 5)}`, 1.4, INK, ' opacity=".6"');
  return s;
}
function stones(x, y, n) { let s = ''; for (let i = 0; i < n; i++) s += `<ellipse cx="${f(x + R(0, 14))}" cy="${f(y - R(0, 2))}" rx="${f(R(2, 3.6))}" ry="${f(R(1.4, 2.4))}" fill="${pick(['#8a867e', '#6d6a64', '#a39f95'])}"/>`; return s; }
function tyre(x, y, r = 4.6) { return circ(x, y, r, INK) + circ(x, y, r * .45, '#4a403b'); }
function tarpOn(x, w, y, slope) {
  const c = pick(tarp), x0 = x - 3 + R(0, w * .15), x1 = x + w + 3 - R(0, w * .2);
  const ya = (xx) => y - slope * ((xx - x) / w);
  let s = poly([[x0, ya(x0) + 4], [x1, ya(x1) + 4], [x1 + 1, ya(x1) - 9], [(x0 + x1) / 2, ya((x0 + x1) / 2) - 12 - R(0, 4)], [x0 - 1, ya(x0) - 9]], c);
  s += ln(`M${f(x0 + 4)} ${f(ya(x0) - 6)} L${f((x0 + x1) / 2)} ${f(ya((x0 + x1) / 2) - 10)} L${f(x1 - 3)} ${f(ya(x1) - 6)}`, .9, mix(c, INK, .4));
  s += ln(`M${f(x0 + 8)} ${f(ya(x0) + 2)} L${f(x0 + 10)} ${f(ya(x0) - 8)} M${f(x1 - 9)} ${f(ya(x1) + 2)} L${f(x1 - 11)} ${f(ya(x1) - 7)}`, .8, mix(c, INK, .35));
  // tyres and stones holding it down
  const k = Math.max(1, Math.floor(w / 24));
  for (let i = 0; i < k; i++) { const xx = x0 + 6 + i * ((x1 - x0 - 12) / Math.max(1, k - 1 || 1)); s += rnd() < .6 ? tyre(xx, ya(xx) - 10, 4.2) : stones(xx - 6, ya(xx) - 8, 3); }
  return s;
}
function hut(x, base, w, h, tint, o = {}) {
  let s = '';
  const kind = o.kind || pick(['brick', 'ply', 'paint', 'ply', 'brick']);
  const wc = mix(o.wall || pick(kind === 'brick' ? wallBrick : kind === 'ply' ? wallPly : wallPaint), '#6b5560', tint);
  const top = base - h, slope = R(-6, 8);
  if (o.lite) { // far huts: wall, roof, a door, sometimes a tarp
    s += rect(x, top, w, h, wc) + poly([[x - 3, top + 3], [x + w + 3, top + 3 - slope], [x + w + 3, top - 5 - slope], [x - 3, top - 5]], mix(pick(tin), '#6b5560', tint * .6));
    if (w > 20 && rnd() < .7) s += rect(x + R(3, w - 9), base - Math.min(h * .55, 22), 6, Math.min(h * .55, 22), rnd() < .4 ? '#e2a54a' : INK, ' class="wd"');
    if (rnd() < .35) s += poly([[x + 2, top - 3], [x + w - 2, top - 3 - slope], [x + w - 2, top - 9 - slope], [x + 2, top - 9]], pick(tarp));
    return s;
  }
  s += rect(x + 2, top + 2, w, h, INK, ' opacity=".5"') + rect(x, top, w, h, wc);
  if (kind === 'brick') s += rect(x, top, w, h, `url(#brk${SID})`, ' opacity=".5"');
  if (kind === 'ply') { let d = ''; for (let xx = x + 8; xx < x + w; xx += R(8, 12)) d += `M${f(xx)} ${f(top)} L${f(xx)} ${f(base)} `; s += ln(d, .8, mix(wc, INK, .5), ' opacity=".7"'); }
  // patches: a tin sheet, a plank, a painted square
  if (rnd() < .8) s += rect(x + R(2, w * .5), top + R(4, h * .4), R(10, w * .4), R(10, h * .35), mix(pick(tin), '#6b5560', tint));
  if (rnd() < .5) s += rect(x + R(2, w * .5), top + R(h * .4, h * .8), R(8, w * .3), R(8, 16), mix(pick([...wallPly, ...wallPaint]), '#6b5560', tint));
  // doorway: dark, curtain, maybe a warm bulb
  if (!o.noDoor && w > 24) {
    const dw = Math.min(16, w * .3), dh = Math.min(h * .62, 38), dx = x + R(4, w - dw - 4);
    s += rect(dx, base - dh, dw, dh, INK);
    if (rnd() < .45) s += rect(dx + 2, base - dh + 2, dw - 4, dh - 2, pick(['#e2a54a', '#f1c15e']), ' class="wd"');
    if (rnd() < .55) s += rect(dx, base - dh, dw * .55, dh * .8, pick(clothes), ' opacity=".9"');
    if (rnd() < .35 && h > 40) { const wx = x + (dx - x > w / 2 ? 5 : w - 15); s += rect(wx, top + 7, 9, 8, INK) + (rnd() < .5 ? rect(wx + 1, top + 8, 7, 6, '#e8b857', ' class="wd"') : rect(wx + 1, top + 8, 7, 6, '#3b4660')) + ln(`M${f(wx + 4.5)} ${f(top + 7)} L${f(wx + 4.5)} ${f(top + 15)}`, .8, INK); }
  }
  s += roofLine(x, top, w, slope, mix(pick(tin), '#6b5560', tint * .6));
  const ry = (xx) => top - slope * ((xx - x) / w);
  if (!o.noTarp && rnd() < .5) s += tarpOn(x, w, top - 2, slope);
  else if (rnd() < .6) { s += stones(x + R(2, w * .5), ry(x + w * .4) - 8, 3); if (rnd() < .6) s += tyre(x + R(6, w - 8), ry(x + w * .5) - 11); }
  if (rnd() < .25) { const px = x + R(4, w - 6); s += rect(px, ry(px) - 24, 3, 20, '#5a504b') + rect(px - 1, ry(px) - 25, 5, 2, INK); }
  if (rnd() < .3) { const px = x + R(4, w - 12), dc = pick(['#2f72b0', '#e0782f', '#3c9a8f']); s += rect(px + 1.5, ry(px) - 25, 11, 17, INK) + rect(px, ry(px) - 26, 11, 17, dc) + rect(px, ry(px) - 21, 11, 1.6, mix(dc, INK, .4)); }
  if (rnd() < .24 && h > 40) { // laundry
    const y1 = top + h * .35, xa = x + 3, xb = x + w - 3;
    s += ln(`M${f(xa)} ${f(y1)} Q${f((xa + xb) / 2)} ${f(y1 + 6)} ${f(xb)} ${f(y1 + 1)}`, .7);
    for (let t = .2; t < .9; t += .25) s += rect(xa + t * (xb - xa) - 2, y1 + 2.5 * Math.sin(Math.PI * t) + .5, 4.5, R(8, 12), pick(clothes));
  }
  return s;
}

// ---------------- towers ----------------
function towers(defs, id, W, H, base, sky) {
  const lit = [], body = [];
  let n = 0;
  const tops = [];
  const one = (x, w, top, tier) => {
    const face = tier ? pick(['#7b8fa8', '#6c819b', '#8798ae', '#74869c']) : pick(['#a7b9cb', '#9db0c4', '#b4c2d0', '#a2b4c8']);
    const h = base - top, cols = Math.max(2, Math.floor((w - 6) / 8.5)), tw = (w - 6) / cols, th = 11, rows = Math.floor((h - 14) / th);
    const pid = `${id}p${n++}`;
    defs.push(`<pattern id="${pid}" width="${f(tw)}" height="${th}" patternUnits="userSpaceOnUse" x="${f(x + 3)}" y="${f(top + 10)}"><rect x="1.5" y="2" width="${f(tw - 3.4)}" height="${th - 5}" class="gl"/></pattern>`);
    let s = rect(x, top, w, h + 6, face) + rect(x + w * .7, top, w * .3, h + 6, '#0b0f1c', ' opacity=".16"') + rect(x, top, w * .1, h + 6, '#ffffff', ' opacity=".12"');
    s += rect(x - 1.5, top - 3, w + 3, 4, mix(face, '#ffffff', .18)) + rect(x + 3, top + 10, tw * cols, th * rows, `url(#${pid})`);
    for (let k = 0; k < 3; k++) s += rect(x, top + R(20, h - 20), w, 1.4, mix(face, INK, .3), ' opacity=".5"');
    if (rnd() < .7) s += rect(x + R(4, w - 16), top - 10, 10, 7, mix(face, INK, .22));
    if (rnd() < .4) s += ln(`M${f(x + w * R(.3, .7))} ${f(top - 3)} l0 -${f(R(10, 22))}`, 1, mix(face, INK, .4));
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const u = rnd(), wy = top + 10 + r * th + 2;
      if (u < .08 && wy < H - 300) lit.push(rect(x + 3 + c * tw + 1.5, wy, tw - 3.4, th - 5, '#ffd88a', u < .035 ? ' class="t1"' : ' class="t2"'));
    }
    body.push(s);
    tops.push([x, x + w, top]);
  };
  const [ox, oy] = sky;
  const cap = (x, w, top) => (x < ox + 34 && x + w > ox - 34 ? Math.max(top, oy + 36) : top);
  const tier = (t, wr, hr, ov) => { let x = -14; while (x < W + 10) { const w = R(wr[0], wr[1]); one(x, w, Math.max(12, cap(x, w, base - R(hr[0], hr[1]))), t); x += w * R(ov[0], ov[1]); } };
  tier(0, [W > 600 ? 40 : 36, W > 600 ? 70 : 62], [175, 290], [.6, .95]);
  tier(1, [W > 600 ? 46 : 42, W > 600 ? 80 : 70], [115, 215], [.7, 1.05]);
  return { body: body.join(''), lit: lit.join(''), tops };
}

// ---------------- the scene ----------------
export function scene(W, H, o) {
  seed = o.seed; SID = o.id; PREC = o.prec || 10;
  const id = o.id;
  const defs = [`<pattern id="brk${id}" width="14" height="8" patternUnits="userSpaceOnUse"><path d="M0 .5H14M0 4.5H14M0 .5V4.5M7 4.5V8M0 8.5" stroke="#2a1812" stroke-width=".9" fill="none" opacity=".6"/></pattern>`,
    `<radialGradient id="glow${id}"><stop offset="0" stop-color="#ffd37a" stop-opacity=".8"/><stop offset=".45" stop-color="#ffc062" stop-opacity=".3"/><stop offset="1" stop-color="#ffc062" stop-opacity="0"/></radialGradient>`,
    `<radialGradient id="pool${id}"><stop offset="0" stop-color="#ffd98a" stop-opacity=".7"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></radialGradient>`,
    `<radialGradient id="sun${id}"><stop offset="0" stop-color="#fff6c8"/><stop offset=".3" stop-color="#ffe9a0" stop-opacity=".7"/><stop offset="1" stop-color="#ffe9a0" stop-opacity="0"/></radialGradient>`,
    `<radialGradient id="moon${id}"><stop offset="0" stop-color="#dfe6ff" stop-opacity=".6"/><stop offset="1" stop-color="#dfe6ff" stop-opacity="0"/></radialGradient>`,
    `<radialGradient id="wash${id}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffe2a0" stop-opacity=".5"/><stop offset="1" stop-color="#ffe2a0" stop-opacity="0"/></radialGradient>`,
    `<linearGradient id="sd${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fb9de"/><stop offset=".6" stop-color="#cfe2e6"/><stop offset="1" stop-color="#f6dcc0"/></linearGradient>`,
    `<linearGradient id="sk${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#454b8c"/><stop offset=".55" stop-color="#c47c98"/><stop offset="1" stop-color="#f6a86c"/></linearGradient>`,
    `<linearGradient id="sn${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e1536"/><stop offset=".6" stop-color="#232b60"/><stop offset="1" stop-color="#3a3c70"/></linearGradient>`,
    `<linearGradient id="hz${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9b9c4" stop-opacity="0"/><stop offset="1" class="hzs" stop-color="#c9b9c4" stop-opacity=".75"/></linearGradient>`];
  const yb = H - 2, span = o.span, yEnd = yb - span;
  const tOf = (y) => clamp((yb - y) / span, 0, 1);
  const cxl = (t) => o.lx - o.curve * Math.pow(t, 1.7);
  const lwid = (t) => o.laneW * Math.pow(1 - t, 1.15) + 11;
  const edges = (y) => { const t = tOf(y), c = cxl(t), w = lwid(t); return [c - w / 2, c + w / 2]; };
  const SC = (y) => .42 + 1.08 * clamp((y - (H - 262)) / 262, 0, 1);
  const sky = [o.sunX, o.sunY];
  const glows = [];
  const glow = (x, y, r, cls = 'L') => glows.push(`<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="url(#glow${id})" class="${cls}"/>`);

  // sky
  let sk = rect(0, 0, W, H, `url(#sd${id})`, ' class="sd"') + rect(0, 0, W, H, `url(#sk${id})`, ' class="sk"') + rect(0, 0, W, H, `url(#sn${id})`, ' class="sn"');
  let clouds = '';
  for (let i = 0; i < Math.round(W / 130); i++) { const cx = R(10, W - 30), cy = R(30, 120); clouds += `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(R(26, 52))}" ry="${f(R(5, 9))}" fill="#fff" opacity=".4"/>`; }
  sk += `<g class="cl">${clouds}</g>`;

  const T = towers(defs, id, W, H, H - 246, sky);
  let world = T.body;
  world += rect(0, H - 330, W, 100, `url(#hz${id})`);
  // ground and lane
  world += rect(-10, yEnd - 8, W + 20, H - yEnd + 14, '#382d2a');
  const L = [], Rr = [];
  for (let k = -1; k <= 26; k++) { const t = k / 26, y = yb + 6 - (span + 6) * ((k + 1) / 27), [a, b] = edges(clamp(y, yEnd, yb + 6)); L.push([a + R(-1.3, 1.3), y]); Rr.push([b + R(-1.3, 1.3), y]); }
  const ptsS = (p) => p.map(([x, y]) => f(x) + ' ' + f(y));
  world += `<path d="M${ptsS(L).join('L')}L${ptsS(Rr.slice().reverse()).join('L')}Z" fill="#9b8d80"/>`;
  world += `<path d="M${ptsS(L).join('L')}" fill="none" stroke="#4a3d36" stroke-width="2.6"/><path d="M${ptsS(Rr).join('L')}" fill="none" stroke="#4a3d36" stroke-width="2.6"/>`;
  // a worn centre strip and the drain along the left edge
  const dr = L.map(([x, y]) => [x + 7 * SC(y) * .7, y + 1]);
  world += `<path d="M${ptsS(dr).join('L')}" fill="none" stroke="#2b2320" stroke-width="3.2" stroke-linecap="round"/><path d="M${ptsS(dr.map(([x, y]) => [x + 2, y - 1.5])).join('L')}" fill="none" stroke="#c2b6a6" stroke-width=".9" opacity=".7"/>`;
  for (let i = 0; i < 22; i++) { const y = R(yEnd + 20, yb), [a, b] = edges(y); world += rect(R(a + 8, b - 20), y, R(6, 16) * SC(y) * .7, 1.6, '#7e7064', ' opacity=".7"'); }
  // steps across the lane
  [.27, .275, .28].forEach((tt, i) => { const y = yb - span * (tt + i * .02), [a, b] = edges(y); world += rect(a, y, b - a, 3 * SC(y), i === 0 ? '#b8a999' : '#8b7e72') + rect(a, y + 3 * SC(y), b - a, 1.6, '#4a3d36', ' opacity=".6"'); });
  // puddles
  [[.1, .1], [.4, -.15], [.62, .12], [.2, -.2]].forEach(([tt, dx]) => { const y = yb - span * tt, [a, b] = edges(y), sc = SC(y); world += `<ellipse cx="${f((a + b) / 2 + dx * (b - a))}" cy="${f(y)}" rx="${f(R(14, 22) * sc * .8)}" ry="${f(R(2.6, 4) * sc)}" class="pud"/>`; });

  // rows of huts, back to front; the lane is the gap, and it is covered beyond its end
  const offs = [6, 46, 84, 118, 150, 180, 208, 232, 252], scs = [1.5, 1.32, 1.14, .98, .85, .73, .63, .54, .46];
  const shopW = 142, bMouth = H - 4, sx = edges(H - 4)[1] + 9;
  const mid = W / 2;
  // the shop sits one row back: row 1's scale against row 0, and row 1's baseline
  const K = scs[1] / scs[0], lift = offs[1] - offs[0];
  const shopT = `translate(0 ${f(-lift)}) translate(${f(mid)} ${f(bMouth)}) scale(${f(K * 1000) / 1000}) translate(${f(-mid)} ${f(-bMouth)})`;
  const shopX = (x) => mid + K * (x - mid), shopY = (y) => bMouth - lift + K * (y - bMouth);
  const shopRight = shopX(sx + shopW);
  for (let i = offs.length - 1; i >= 0; i--) {
    const b = H - offs[i], s = scs[i], tint = .04 + i * .055;
    const hasLane = b > yEnd + 4, lite = i >= (o.liteFrom || 4);
    const zones = hasLane ? [[-40, edges(b)[0] - 2], [i === 0 ? shopRight : edges(b)[1] + 2, W + 40]] : [[-40, W + 40]];
    zones.forEach(([a, z]) => {
      if (z - a < 14) return;
      const lo = (a - mid) / s + mid, hi = (z - mid) / s + mid;
      let g = '', x = lo;
      while (x < hi - 8) {
        let w = lite ? R(34, 60) : R(30, 52); if (x + w > hi + 3) w = hi + 3 - x; if (w < 16) break;
        const h = lite ? R(40, 66) : R(46, 76);
        g += hut(x, b + R(-2, 2), w, h, tint, { lite });
        if (i >= 2 && rnd() < .4 && w > 30) g += hut(x + R(2, 8), b - h + 3, w * R(.55, .7), R(26, 36), tint, { noDoor: true, lite });
        x += w + R(-6, 3);
      }
      world += `<g transform="translate(${f(mid)} ${f(b)}) scale(${s}) translate(${f(-mid)} ${f(-b)})">${g}</g>`;
    });
  }

  // wires, poles, washing lines and a string of festoon bulbs across the lane
  const bulbsW = [];
  const pole = (x, yBase, h) => { world += rect(x, yBase - h, 3, h, '#4a3b34') + rect(x - 12, yBase - h + 6, 28, 2.6, '#4a3b34') + rect(x - 9, yBase - h + 14, 22, 2.2, '#4a3b34'); };
  const p1x = edges(H - 150)[0] - 26, p2x = sx + 58;
  pole(p1x, H - 150, 130); pole(p2x, H - 120, 168);
  for (let k = 0; k < 5; k++) world += ln(`M${f(p1x + R(-10, 12))} ${f(H - 144 - 130 + 8 + k * 3)} Q${f((p1x + p2x) / 2 + R(-20, 20))} ${f(H - 200 + R(14, 30))} ${f(p2x + R(-10, 12))} ${f(H - 120 - 168 + 8 + k * 3)}`, .8);
  for (let k = 0; k < 5; k++) world += ln(`M${f(p1x + 1)} ${f(H - 270)} C${f(p1x + R(-40, 10))} ${f(H - 230)} ${f(p1x + R(-50, 0))} ${f(H - 200)} ${f(p1x + R(-60, -10))} ${f(H - 150 + R(-20, 30))}`, .8);
  for (let k = 0; k < 4; k++) world += ln(`M${f(p2x + 1)} ${f(H - 280)} C${f(p2x + R(0, 40))} ${f(H - 250)} ${f(p2x + R(10, 70))} ${f(H - 230)} ${f(W + 10)} ${f(H - 215 + R(-20, 20))}`, .8);
  for (let k = 0; k < 4; k++) { const tx = p1x + R(-14, 30), ty = H - 215 + R(-10, 20); world += `<ellipse cx="${f(tx)}" cy="${f(ty)}" rx="${f(R(6, 14))}" ry="${f(R(2.5, 6))}" transform="rotate(${f(R(-40, 40))} ${f(tx)} ${f(ty)})" fill="none" stroke="${INK}" stroke-width=".8"/>`; }
  const across = (y, hgt, n, sag) => { const [a, b] = edges(y), sc = SC(y), ya = y - hgt * sc; world += ln(`M${f(a - 4)} ${f(ya)} Q${f((a + b) / 2)} ${f(ya + sag)} ${f(b + 4)} ${f(ya + 1)}`, .8); return [a, b, ya, sc]; };
  { const [a, b, ya, sc] = across(H - 128, 50, 5, 12);
    for (let i = 1; i <= 4; i++) { const t = i / 5, x = a + (b - a) * t, y = ya + 12 * 2 * t * (1 - t) + .5; world += rect(x - .6, y, 1.2, 5 * sc, INK, ' opacity=".7"') + circ(x, y + 6 * sc, 2.4 * sc, BULB, ' class="bb"'); glow(x, y + 6 * sc, 15 * sc); } }
  { const [a, b, ya, sc] = across(H - 188, 44, 4, 9);
    for (let i = 1; i <= 3; i++) { const t = i / 4, x = a + (b - a) * t, y = ya + 9 * 2 * t * (1 - t) + .5; world += rect(x - .5, y, 1, 4 * sc, INK, ' opacity=".7"') + circ(x, y + 5 * sc, 2 * sc, BULB, ' class="bb"'); glow(x, y + 5 * sc, 12 * sc); } }
  { const [a, b, ya, sc] = across(H - 70, 40, 5, 10); // washing
    for (let t = .15; t < .9; t += .22) world += rect(a + (b - a) * t - 2.5 * sc, ya + 10 * 2 * t * (1 - t) + .6, 5.5 * sc, R(10, 15) * sc, pick(clothes)); }
  // eave bulbs on the hut walls beside the lane
  [[.06, -1], [.2, 1], [.44, -1], [.64, 1]].forEach(([tt, sd]) => { const y = yb - span * tt, [a, b] = edges(y), sc = SC(y), x = sd < 0 ? a - 7 * sc : b + 7 * sc, yy = y - 36 * sc; world += ln(`M${f(x)} ${f(yy - 8 * sc)} L${f(x)} ${f(yy)}`, .9) + circ(x, yy + 1.5 * sc, 2.5 * sc, BULB, ' class="bb"'); glow(x, yy + 1.5 * sc, 16 * sc); });
  // lamp posts along the lane
  [[.12, 1], [.3, -1], [.5, 1], [.72, -1]].forEach(([tt, sd]) => {
    const y = yb - span * tt, [a, b] = edges(y), sc = SC(y), x = sd > 0 ? b - 1 : a + 1, top = y - 64 * sc, hx = x - sd * 12 * sc;
    world += rect(x - 1.2 * sc, top, 2.6 * sc, 64 * sc, '#3b3430') + ln(`M${f(x)} ${f(top + 2 * sc)} Q${f(x - sd * 5 * sc)} ${f(top - 3 * sc)} ${f(hx)} ${f(top)}`, 1.6 * sc, '#3b3430') + rect(hx - 5 * sc, top - 1.5 * sc, 10 * sc, 3.2 * sc, '#2a2421') + circ(hx, top + 3.8 * sc, 2.8 * sc, BULB, ' class="bb"');
    glow(hx, top + 4 * sc, 40 * sc);
    glows.push(`<ellipse cx="${f(hx - sd * 8 * sc)}" cy="${f(y + 1)}" rx="${f(40 * sc)}" ry="${f(9 * sc)}" fill="url(#pool${id})" class="L"/>`);
  });

  // the shop at the lane's mouth
  const b0 = bMouth;
  let shop = '';
  shop += rect(sx + 3, b0 - 128, shopW, 128, INK, ' opacity=".5"') + rect(sx, b0 - 128, shopW, 128, '#d4b074') + rect(sx + shopW * .72, b0 - 128, shopW * .28, 128, '#3b2a20', ' opacity=".15"');
  shop += roofLine(sx, b0 - 128, shopW, -3, '#8e8c88') + tarpOn(sx + 6, shopW * .55, b0 - 130, -3) + tyre(sx + shopW - 16, b0 - 138) + stones(sx + shopW - 46, b0 - 138, 3);
  // awning of painted stripes
  { const k = (shopW + 6) / 11; for (let i = 0; i < 11; i++) shop += poly([[sx - 6 + i * k, b0 - 82], [sx - 6 + (i + 1) * k, b0 - 82], [sx - 9 + (i + 1) * k, b0 - 64], [sx - 9 + i * k, b0 - 64]], i % 2 ? '#efe3c8' : '#c8453a'); }
  shop += rect(sx - 8, b0 - 64, shopW + 6, 2, INK, ' opacity=".5"');
  // the opening: dark, shelves, warm light, jars, half-rolled shutter
  shop += rect(sx + 12, b0 - 62, shopW - 24, 58, INK) + rect(sx + 16, b0 - 56, shopW - 32, 48, '#caa05a', ' class="wd"');
  shop += rect(sx + 16, b0 - 40, shopW - 32, 1.8, '#3b2a20') + rect(sx + 16, b0 - 24, shopW - 32, 1.8, '#3b2a20');
  for (let i = 0; i < 11; i++) shop += rect(sx + 20 + i * 9.6, b0 - 49 + R(-1, 1), 6, 8, pick(['#c8453a', '#2f72b0', '#e6b84a', '#3e8d86', '#efe3c8'])) + rect(sx + 20 + i * 9.6, b0 - 33, 6, 8, pick(['#e6b84a', '#c8453a', '#efa7a0', '#3e8d86']));
  shop += rect(sx + 12, b0 - 62, shopW - 24, 8, '#7d8a90');
  for (let x = sx + 14; x < sx + shopW - 14; x += 5) shop += ln(`M${f(x)} ${f(b0 - 62)} L${f(x)} ${f(b0 - 54)}`, .7, '#4b575c');
  // hanging packets
  for (let i = 0; i < 11; i++) { const x = sx + 20 + i * 9.6; shop += ln(`M${f(x)} ${f(b0 - 62)} L${f(x)} ${f(b0 - 50 + (i % 3) * 3)}`, .6, '#3a302b') + rect(x - 2.6, b0 - 50 + (i % 3) * 3, 5.2, 9, pick(['#c8453a', '#e6b84a', '#2f72b0', '#3e8d86', '#efa7a0']), ' opacity=".95"'); }
  // counter, crates, a tea kettle
  shop += rect(sx + 8, b0 - 18, shopW - 16, 18, '#6b4a33') + rect(sx + 6, b0 - 20, shopW - 12, 3.4, '#8a6244') + rect(sx + 6, b0 - 1, shopW - 12, 2, INK, ' opacity=".4"');
  shop += rect(sx - 24, b0 - 17, 22, 17, '#a07a4c') + rect(sx - 22, b0 - 33, 19, 16, '#8f6d44') + ln(`M${f(sx - 24)} ${f(b0 - 9)} h22 M${f(sx - 22)} ${f(b0 - 25)} h19`, .8, '#4a3622') + rect(sx - 24, b0 - 17, 22, 2, INK, ' opacity=".3"');
  shop += circ(sx + shopW - 28, b0 - 26, 5.6, '#b9bdc0') + rect(sx + shopW - 34, b0 - 22, 12, 4, '#7d8a90') + ln(`M${f(sx + shopW - 31)} ${f(b0 - 30)} q3 -6 6 0`, 1.2, '#4b575c');
  world += `<g transform="${shopT}">${shop}</g>`;
  glow(shopX(sx + shopW / 2), shopY(b0 - 34), 60 * K);
  glow(shopX(sx + shopW / 2), shopY(b0 - 68), 18 * K);

  // the board: a weathered, faded teal board with chalk lettering. Small and quiet; it is a shop in the street, not the subject.
  // Authored at 0.6 of the old size (old: 128 x 33, 20px type, bright blue). It is in the lit layer so it stays readable after dark.
  const bw = 76, bh = 19.5, bx = sx + (shopW - bw) / 2, by = b0 - 122;
  let sign = rect(bx - 1.5, by - 1.5, bw + 3, bh + 3, INK, ' opacity=".4"') + rect(bx, by, bw, bh, '#4f7b77') + rect(bx, by, bw, bh, '#8a7a55', ' opacity=".16"');
  sign += rect(bx + 1.6, by + 1.6, bw - 3.2, bh - 3.2, 'none', ' stroke="#e9dfc4" stroke-width=".5" opacity=".35"');
  sign += ln(`M${f(bx + 4)} ${f(by + bh - 3)} L${f(bx + 30)} ${f(by + bh - 3.4)} M${f(bx + 44)} ${f(by + 2.5)} L${f(bx + bw - 6)} ${f(by + 3)}`, .6, '#2f4f4c', ' opacity=".35"');
  sign += `<text x="${f(bx + bw / 2)}" y="${f(by + 13.2)}" text-anchor="middle" font-family="'Young Serif',Georgia,serif" font-size="12" textLength="${bw - 14}" lengthAdjust="spacingAndGlyphs" fill="#ece3c8" fill-opacity=".92" stroke="#16120f" stroke-width=".25" paint-order="stroke">Mumbai 99</text>`;
  sign += rect(bx + bw / 2 - 7, by - 5, 14, 2.4, '#2a2421') + rect(bx + bw / 2 - .6, by - 3.8, 1.2, 3.2, '#2a2421');
  glow(shopX(bx + bw / 2), shopY(by + bh / 2), 22 * K);
  sign = `<g transform="${shopT}">${sign}</g>`;

  // sky objects above the dimmer, clear of the towers
  const [ox, oy] = sky;
  let lights = '';
  lights += `<g class="sunG"><circle cx="${f(ox)}" cy="${f(oy)}" r="52" fill="url(#sun${id})"/><circle cx="${f(ox)}" cy="${f(oy)}" r="15" fill="#fff4c4"/></g>`
    + `<g class="moonG"><circle cx="${f(ox)}" cy="${f(oy)}" r="34" fill="url(#moon${id})"/><circle cx="${f(ox)}" cy="${f(oy)}" r="12" fill="#f4efdc"/><circle cx="${f(ox + 4)}" cy="${f(oy - 3)}" r="2.6" fill="#d7d0b8"/><circle cx="${f(ox - 4)}" cy="${f(oy + 4)}" r="1.8" fill="#d7d0b8"/></g>`;
  let stars = '';
  for (let i = 0; i < 26; i++) { const x = R(6, W - 6), y = R(8, H * .42); const clear = T.tops.every(([a, b, t]) => !(x > a - 3 && x < b + 3 && y > t - 6)); if (clear && Math.hypot(x - ox, y - oy) > 30) stars += circ(x, y, R(.7, 1.3), '#fff', ` opacity="${f(R(.5, 1))}"`); }
  lights += `<g class="stars">${stars}</g>`;
  lights += `<g class="tl">${T.lit}</g>${glows.join('')}${sign}`;
  lights += `<rect x="${f(ox - W * .6)}" y="${f(oy - H * .6)}" width="${f(W * 1.2)}" height="${f(H * 1.2)}" fill="url(#wash${id})" class="wsh"/>`;

  return `<svg class="sv ${o.cls}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" role="img" aria-label="A lane of tin-roofed homes in Mumbai, a small shop at its mouth, and tall towers behind"><defs>${defs.join('')}</defs><g>${sk}</g><g>${world}</g><rect class="dim" width="${W}" height="${H}" fill="#0a1030"/><g>${lights}</g></svg>`;
}

// ---------------- output ----------------
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const out = (p, body) => { const f = path.join(root, p); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, body); console.log(p, Buffer.byteLength(body), 'bytes'); };

const scenes = scene(400, 560, { id: 'p', cls: 'sv-p', seed: 5, lx: 182, curve: 118, laneW: 124, span: 252, sunX: 95, sunY: 152, prec: 2 })
  + '\n' + scene(1280, 520, { id: 'w', cls: 'sv-w', seed: 9, lx: 660, curve: 330, laneW: 190, span: 236, sunX: 340, sunY: 100, prec: 1, liteFrom: 3 }) + '\n';
out('layouts/partials/art/about-scene.html', scenes);

// the torn bottom edge: a jittered polygon in % across, px up from the bottom, so it scales with the box
let cs = 77;
const crnd = () => { cs |= 0; cs = (cs + 0x6d2b79f5) | 0; let t = Math.imul(cs ^ (cs >>> 15), 1 | cs); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const pts = ['0% 0', '100% 0'];
for (let i = 40; i >= 0; i--) pts.push(`${(i / 40 * 100).toFixed(1)}% calc(100% - ${(1 + Math.abs((crnd() * 2 - 1) * 7)).toFixed(1)}px)`);
out('layouts/partials/art/about-scene-cut.html', `polygon(${pts.join(',')})`);
