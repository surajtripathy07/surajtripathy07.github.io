// Generates index.html: static inline SVG, hand-cut edges jittered at build time (seeded).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';
const here = path.dirname(fileURLToPath(import.meta.url));

let s = 7;
const rnd = () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const j = (a) => (rnd() * 2 - 1) * a;

const C = { ink: '#121512', green: '#17503f', deep: '#0d3329', shade: '#0b2a20', ochre: '#c79a35', ochre2: '#b48a2c', lit: '#dcb857', chalk: '#efe9d8', linen: '#d3c9a6', ver: '#d63a1f', ver2: '#a92b14' };

function cut(pts, amp = 1.6, seg = 24) {
  const out = [];
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % n];
    const len = Math.hypot(x2 - x1, y2 - y1) || 1;
    const k = Math.max(1, Math.round(len / seg));
    const nx = -(y2 - y1) / len, ny = (x2 - x1) / len;
    out.push([x1 + j(amp * 0.7), y1 + j(amp * 0.7)]);
    for (let m = 1; m < k; m++) {
      const t = m / k, o = j(amp);
      out.push([x1 + (x2 - x1) * t + nx * o, y1 + (y2 - y1) * t + ny * o]);
    }
  }
  return 'M' + out.map(([x, y]) => x.toFixed(1) + ' ' + y.toFixed(1)).join('L') + 'Z';
}
const rect = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
const ell = (cx, cy, rx, ry, n = 14, rot = 0) => Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2 + rot; return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]; });
const strip = (pts, w) => {
  const L = [], R = [];
  pts.forEach((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    const nx = -dy / l, ny = dx / l, ww = Array.isArray(w) ? w[i] : w;
    L.push([p[0] + nx * ww / 2, p[1] + ny * ww / 2]); R.push([p[0] - nx * ww / 2, p[1] - ny * ww / 2]);
  });
  return L.concat(R.reverse());
};
// piece: path with optional hard paper shadow
const P = (pts, fill, o = {}) => {
  const d = cut(pts, (o.amp ?? 1.4) * 1.5, o.seg ?? 24);
  const sh = o.sh ? `<path d="${d}" transform="translate(${o.sh[0]} ${o.sh[1]})" fill="${C.ink}" opacity="${o.sho ?? 0.35}"/>` : '';
  return sh + `<path d="${d}" fill="${fill}"${o.cls ? ` class="${o.cls}"` : ''}/>`;
};


function noisePng(n = 192) {
  const raw = Buffer.alloc((n * 4 + 1) * n);
  let q = 99; const r2 = () => { q = (q * 1664525 + 1013904223) >>> 0; return q / 4294967296; };
  for (let y = 0; y < n; y++) { raw[y * (n * 4 + 1)] = 0; for (let x = 0; x < n; x++) { const o = y * (n * 4 + 1) + 1 + x * 4; const r = r2(); if (r < 0.55) { raw[o] = 10; raw[o + 1] = 12; raw[o + 2] = 10; raw[o + 3] = Math.round((0.55 - r) * 150); } else { raw[o] = 255; raw[o + 1] = 248; raw[o + 2] = 225; raw[o + 3] = Math.round((r - 0.55) * 110); } } }
  const crcT = Array.from({ length: 256 }, (_, k) => { let c = k; for (let i = 0; i < 8; i++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
  const crc = (b) => { let c = 0xffffffff; for (const x of b) c = crcT[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (t, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
  const ih = Buffer.alloc(13); ih.writeUInt32BE(n, 0); ih.writeUInt32BE(n, 4); ih[8] = 8; ih[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ih), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]).toString('base64');
}
const GRAIN = noisePng();

// ---- invented Cubist-style faces: two planes, profile nose, mismatched eyes ----
function face(rx, ry, o = {}) {
  o = { c1: C.chalk, c2: C.lit, c3: C.ver, c4: C.ink, cn: C.chalk, ...o };
  const k = (pts) => pts.map(([x, y]) => [x * rx, y * ry]);
  const E = (x, y, ax, ay, n = 10) => ell(x * rx, y * ry, ax * rx, ay * ry, n);
  const grow = (pts, cx, cy, f) => pts.map(([x, y]) => [cx + (x - cx) * f, cy + (y - cy) * f]);
  const d = o.split ?? 0.08, ey = o.ey ?? 0.05, nl = o.nose ?? 0.34, mood = o.mood || 'calm';
  const lw = Math.max(1.1, ry * 0.075);
  const shape = o.shape || [[-.68, -1], [.7, -1], [1, -.4], [.88, .5], [.3, 1], [-.42, .96], [-.96, .42], [-1, -.4]];
  const T = !!o.tiny;
  let s = '<g class="fh"><g class="face">';
  s += P(k(shape.map(([x, y]) => [x * 1.09, y * 1.07])), C.ink, { amp: 0.5, seg: 9 });
  s += P(k([[-.68, -1], [d + .12, -1], [d - .12, .05], [d + .18, 1], [-.42, .96], [-.96, .42], [-1, -.42]]), o.c1, { amp: 0.3, seg: 9 });
  s += P(k([[d + .12, -1], [.7, -1], [1, -.4], [.88, .5], [.3, 1], [d + .18, 1], [d - .12, .05]]), o.c2, { amp: 0.3, seg: 9 });
  s += P(k([[.18, .12], [.92, 0], [.86, .5], [.3, .98], [.12, .62]]), o.c3, { amp: 0.3, seg: 9 });
  s += P(k(o.hair || [[-.78, -1.1], [-.3, -1.38], [.1, -1.08], [.6, -1.3], [.86, -.62], [.2, -.6], [-.2, -.78], [-.92, -.56]]), o.c4, { amp: 0.4, seg: 9 });
  if (!T) { s += P(E(-1.0, .04, .15, .24, 8), C.ink, { amp: .2, seg: 9 }); s += P(E(-.97, .04, .09, .16, 8), o.c1, { amp: .15, seg: 9 }); }
  // brows
  s += P(strip(k([[-.76, -.56 - ey], [-.1, -.5 + ey / 2]]), lw * 1.3), C.ink, { amp: .2, seg: 9 });
  s += P(strip(k([[.3, -.64 + ey], [.8, -.54]]), lw * 1.3), C.ink, { amp: .2, seg: 9 });
  // front eye (left plane) and profile eye (right plane), mismatched on purpose
  const es = o.eyeS ?? 1, ax = .27 * es, ay = .16 * es, ex = -.42, eyy = -.3 + ey;
  s += `<g class="eye">${P(E(ex, eyy, ax * 1.2, ay * 1.35), C.ink, { amp: .2, seg: 8 })}${P(E(ex, eyy, ax, ay), C.chalk, { amp: .15, seg: 8 })}<g class="pupil"><circle cx="${(ex * rx).toFixed(1)}" cy="${(eyy * ry).toFixed(1)}" r="${Math.max(0.9, ax * rx * .4).toFixed(1)}" fill="${C.ink}"/></g></g>`;
  const bx = .5, by = -.42 - ey, ba = .2 * es;
  const tri = k([[bx - ba, by - .06], [bx + ba, by - .14], [bx + ba * .8, by + .1], [bx - ba * .3, by + .1]]);
  s += `<g class="eye">${P(grow(tri, bx * rx, by * ry, 1.32), C.ink, { amp: .2, seg: 8 })}${P(tri, C.chalk, { amp: .15, seg: 8 })}<g class="pupil"><circle cx="${(bx * rx + 1).toFixed(1)}" cy="${(by * ry).toFixed(1)}" r="${Math.max(0.8, ba * rx * .36).toFixed(1)}" fill="${C.ink}"/></g></g>`;
  if (o.glasses) s += `<ellipse cx="${(ex * rx).toFixed(1)}" cy="${(eyy * ry).toFixed(1)}" rx="${(ax * 1.8 * rx).toFixed(1)}" ry="${(ay * 2.4 * ry).toFixed(1)}" fill="none" stroke="${C.ink}" stroke-width="${lw.toFixed(1)}"/><ellipse cx="${(bx * rx).toFixed(1)}" cy="${(by * ry).toFixed(1)}" rx="${(ba * 1.6 * rx).toFixed(1)}" ry="${(ay * 2 * ry).toFixed(1)}" fill="none" stroke="${C.ink}" stroke-width="${lw.toFixed(1)}"/>`;
  // nose, in profile, pushing out past the plane split
  const N = k([[d - .12, -.38], [d + nl, .2], [d - .04, .3]]);
  s += `<g class="nose">${P(grow(N, (d + .1) * rx, 0, 1.3), C.ink, { amp: .15, seg: 8 })}${P(N, o.cn, { amp: .15, seg: 8 })}</g>`;
  if (o.cheeks) s += `<g class="chk" style="--co:${o.cheeks}">${P(E(-.5, .38, .2, .12, 8), C.ver, { amp: .1, seg: 8 })}${P(E(.58, .3, .17, .11, 8), C.ver, { amp: .1, seg: 8 })}</g>`;
  if (o.freckles) s += [[-.55, .22], [-.35, .3], [-.18, .22], [.5, .16], [.66, .24]].map(([a, b]) => P(E(a, b, .045, .045, 5), C.ver2, { amp: .02, seg: 5 })).join('');
  // mouth
  const M = {
    joy: [[-.5, .5], [.45, .42], [.4, .7], [-.1, .84], [-.44, .7]],
    wry: [[-.45, .64], [.35, .52], [.52, .42], [.44, .66], [-.3, .76]],
    calm: [[-.4, .62], [.35, .6], [.35, .69], [-.38, .71]],
    stern: [[-.4, .66], [.36, .6], [.4, .72], [-.38, .74]],
    smile: [[-.46, .54], [.42, .5], [.22, .78], [-.1, .8]]
  }[mood];
  s += `<g class="mouth">${P(k(M), C.ink, { amp: .15, seg: 8 })}`;
  if (mood === 'joy') s += P(k([[-.4, .52], [.38, .46], [.35, .57], [-.38, .6]]), C.chalk, { amp: .1, seg: 8 }) + P(k([[-.1, .74], [.25, .68], [.15, .8]]), C.ver, { amp: .1, seg: 8 });
  if (mood === 'smile') s += P(k([[-.36, .56], [.34, .53], [.3, .6], [-.3, .62]]), C.chalk, { amp: .1, seg: 8 });
  if (mood === 'calm') s += P(k([[-.22, .56], [.2, .55], [.2, .6], [-.2, .6]]), C.ver, { amp: .1, seg: 8 });
  s += '</g>';
  return s + '</g></g>';
}
const PF = { c1: C.chalk, c2: C.lit, c3: C.ver, c4: C.ink, cn: C.chalk, mood: 'wry', ey: .12, nose: .46, split: .02,
  shape: [[-.62, -1], [.66, -1], [.98, -.5], [.78, .55], [.22, 1], [-.34, .98], [-.9, .5], [-1, -.5]],
  hair: [[-.8, -1.1], [-.5, -1.55], [-.15, -1.15], [.2, -1.62], [.5, -1.12], [.9, -1.3], [.9, -.6], [.2, -.62], [-.25, -.8], [-.95, -.55]] };
// ---- wall paintings: same graphic language (planes, heavy cut outline) ----
let clipN = 0;
const Pq = (pts, fill, o = {}) => P(pts, fill, { amp: 0.7, seg: 14, st: 1.5, ...o });
function frame(id, x, y, w, h, bg, paint, label, endLabel) {
  const ix = x + 9, iy = y + 9, iw = w - 18, ih = h - 18, cid = 'fc' + clipN++;
  const u = (f) => ix + f * iw, v = (f) => iy + f * ih;
  return `<g class="hot wallart" id="${id}" tabindex="0" role="button" aria-label="${label || 'Painting'}" data-ix="${ix}" data-iy="${iy}" data-iw="${iw}" data-ih="${ih}">
<g class="fr">${P(rect(x, y, w, h), C.ochre, { amp: 1.6, sh: [3, 4], sho: 0.4, st: 2 })}${P(rect(ix - 1, iy - 1, iw + 2, ih + 2), C.ink, { amp: 1 })}</g>
<clipPath id="${cid}"><rect x="${ix}" y="${iy}" width="${iw}" height="${ih}"/></clipPath>
<g clip-path="url(#${cid})">${P(rect(ix, iy, iw, ih), bg, { amp: 1, seg: 30 })}${paint(u, v, iw, ih, ix, iy)}</g>
${label ? `<text class="plq" x="${endLabel ? x + w - 2 : x + 2}" y="${y + h + 24}"${endLabel ? ' text-anchor="end"' : ''}>${label}</text>` : ''}<rect class="ring" x="${x - 6}" y="${y - 6}" width="${w + 12}" height="${h + 12}"/>
<rect class="hit" x="${x - 4}" y="${y - 4}" width="${w + 8}" height="${h + 8}"/>
</g>`;
}
function paintGeni(u, v, iw, ih) {
  let s = Pq(rect(u(.66), v(.05), iw * .31, ih * .9), C.chalk, { amp: .6, seg: 20 });
  s += Pq(rect(u(.7), v(.09), iw * .23, ih * .06), C.ver, { amp: .3 });
  [.2, .28, .36].forEach((f, i) => { s += Pq(rect(u(.7), v(f), iw * (.23 - i * .04), ih * .035), C.ink, { amp: .25 }); });
  s += Pq([[u(.7), v(.46)], [u(.93), v(.46)], [u(.93), v(.58)], [u(.8), v(.58)], [u(.73), v(.64)], [u(.74), v(.58)], [u(.7), v(.58)]], C.ochre, { amp: .3 });
  for (let i = 0; i < 3; i++) { s += Pq(rect(u(.7), v(.7 + i * .09), iw * .23, ih * .065), C.ink, { amp: .2 }); s += Pq(rect(u(.715), v(.712 + i * .09), iw * .2, ih * .04), i === 1 ? C.lit : C.linen, { amp: .15 }); }
  s += Pq(rect(u(.04), v(.08), iw * .58, ih * .4), C.ink, { amp: .5 }) + Pq(rect(u(.065), v(.11), iw * .53, ih * .34), C.green, { amp: .4 });
  s += Pq([[u(.26), v(.19)], [u(.26), v(.37)], [u(.43), v(.28)]], C.lit, { amp: .3 });
  s += Pq(rect(u(.04), v(.55), iw * .58, ih * .04), C.linen, { amp: .3 }) + Pq(rect(u(.04), v(.55), iw * .2, ih * .04), C.ver, { amp: .3 });
  for (const f of [.2, .36, .5]) s += Pq(rect(u(f), v(.51), iw * .03, ih * .12), C.lit, { amp: .2 });
  s += `<g class="sl" style="--sl:${(iw * .26).toFixed(1)}px">${Pq(ell(u(.24), v(.57), 4.6, 4.6, 8), C.chalk, { amp: .2 })}${Pq(ell(u(.24), v(.57), 2.6, 2.6, 6), C.ver, { amp: .1 })}</g>`;
  for (let i = 0; i < 3; i++) { s += Pq(rect(u(.04 + i * .205), v(.7), iw * .17, ih * .2), C.ink, { amp: .3 }) + Pq(rect(u(.058 + i * .205), v(.725), iw * .134, ih * .15), i === 1 ? C.lit : C.chalk, { amp: .2 }); }
  s += Pq(strip([[u(.11 + .205), v(.8)], [u(.14 + .205), v(.85)], [u(.2 + .205), v(.74)]], 2.4), C.ink, { amp: .15, seg: 8 });
  return s;
}
function paintMem(u, v, iw, ih) {
  // four small app windows (title bar + body), lines running into one store drawn as three discs
  const cx = u(.5);
  const W = [[.03, .05, .24, .27, C.ver, C.chalk], [.29, .12, .19, .17, C.green, C.ochre], [.52, .03, .16, .31, C.ink, C.lit], [.72, .09, .25, .22, C.ochre, C.chalk]];
  let s = '';
  W.forEach(([fx, fy, fw, fh], k) => { s += Pq(strip([[u(fx + fw / 2), v(fy + fh)], [k < 2 ? cx - (1 - k * 2) * 5 + k * 3 : cx + (k === 2 ? 3 : 7), v(.55)]], 1.7), C.chalk, { amp: .15, seg: 10 }); });
  W.forEach(([fx, fy, fw, fh, bar, body]) => {
    const x = u(fx), y = v(fy), w = iw * fw, h = ih * fh, tb = Math.max(4, h * .3);
    s += Pq(rect(x, y, w, h), C.ink, { amp: .35 }) + Pq(rect(x + 1.6, y + 1.6, w - 3.2, tb), bar, { amp: .2 }) + Pq(rect(x + 1.6, y + tb + 2.2, w - 3.2, h - tb - 3.8), body, { amp: .2 });
    s += Pq(rect(x + 3.4, y + tb + 5, (w - 6.8) * .7, 1.8), C.ink, { amp: .1 });
  });
  const rx = iw * .27;
  [.62, .76, .90].forEach((f, i) => {
    const cy = v(f), bh = ih * .045, ry = ih * .035;
    s += Pq(rect(cx - rx - 1.2, cy - 1, rx * 2 + 2.4, bh + 2), C.ink, { amp: .15 }) + Pq(ell(cx, cy + bh, rx + 1.2, ry + 1.2, 14), C.ink, { amp: .15 });
    s += Pq(rect(cx - rx, cy, rx * 2, bh), C.ochre, { amp: .2 }) + Pq(ell(cx, cy + bh, rx, ry, 14), C.ochre, { amp: .15 }) + Pq(ell(cx, cy, rx, ry, 14), i === 0 ? C.chalk : C.lit, { amp: .15 });
  });
  s += `<g class="mv" style="--mv:${(ih * .17).toFixed(1)}px">${Pq(ell(u(.15), v(.36), 3.2, 3.2, 8), C.ver, { amp: .1 })}</g>`;
  return s;
}
function paintWhim(u, v, iw, ih) {
  // a phone-shaped short-video screen: dark screen, vermilion play triangle, a chalk lightbulb doodle
  let s = Pq(rect(u(0), v(0), iw, ih), C.deep, { amp: .5, seg: 20 });
  s += Pq(rect(u(.08), v(.05), iw * .84, ih * .9), C.green, { amp: .4, seg: 20 });
  s += Pq(rect(u(.34), v(.075), iw * .32, ih * .02), C.ink, { amp: .15 });
  s += Pq([[u(.3), v(.2)], [u(.3), v(.4)], [u(.72), v(.3)]], C.ver, { amp: .3 });
  const bx = u(.5), by = v(.66), br = iw * .2;
  s += Pq(ell(bx, by, br + 1.4, br + 1.4, 12), C.ink, { amp: .2 }) + Pq(ell(bx, by, br, br, 12), C.lit, { amp: .2 });
  s += Pq(rect(bx - br * .5, by + br * .8, br, br * .5), C.ochre, { amp: .15 }) + Pq(rect(bx - br * .35, by + br * 1.3, br * .7, br * .22), C.ink, { amp: .1 });
  s += Pq(strip([[bx - br * .3, by + br * .1], [bx, by + br * .55], [bx + br * .3, by + br * .1]], 1.3), C.ochre, { amp: .1, seg: 8 });
  for (const a of [-2.2, -1.57, -.94]) s += Pq(strip([[bx + Math.cos(a) * br * 1.3, by + Math.sin(a) * br * 1.3], [bx + Math.cos(a) * br * 1.7, by + Math.sin(a) * br * 1.7]], 1.4), C.chalk, { amp: .1, seg: 6 });
  return s;
}
let LOOP = null;
function paintRoad(u, v, iw, ih) {
  const blocks = [[.03, .05, .22, .2, C.green], [.3, .02, .2, .14, C.ochre], [.58, .04, .18, .2, C.deep], [.8, .06, .17, .22, C.green], [.04, .7, .2, .25, C.ochre], [.3, .84, .22, .15, C.green], [.62, .86, .2, .14, C.deep], [.82, .7, .16, .26, C.ver2], [.36, .4, .26, .2, C.linen], [.02, .36, .1, .2, C.lit]];
  let s = '';
  for (const [a, b, c, d, f] of blocks) s += Pq(rect(u(a), v(b), c * iw, d * ih), f, { amp: 0.8, seg: 18 });
  const p = [[.2, .4], [.45, .2], [.78, .3], [.86, .6], [.62, .82], [.28, .76], [.14, .56]].map(([a, b]) => [u(a), v(b)]);
  LOOP = p;
  for (let i = 0; i < p.length; i++) { s += Pq(strip([p[i], p[(i + 1) % p.length]], 8), C.ink, { amp: 0.3, seg: 40, st: 0 }); s += Pq(ell(p[i][0], p[i][1], 4.4, 4.4, 8), C.ink, { amp: 0.3, st: 0 }); }
  s += `<path class="loop-path" d="M${p.map(([x, y]) => x.toFixed(1) + ' ' + y.toFixed(1)).join('L')}Z" fill="none" stroke="none"/>`;
  s += `<g class="car" style="transform:translate(${p[0][0].toFixed(1)}px,${p[0][1].toFixed(1)}px)">${Pq([[-7, -2], [-5, -6], [4, -6], [7, -2], [8, 3], [-8, 3]], C.ver, { amp: 0.2, seg: 30, st: 1.3 })}${Pq([[-3.5, -5], [3, -5], [4.5, -2], [-4.5, -2]], C.chalk, { amp: 0.2, seg: 30, st: 0 })}${Pq(ell(-4.5, 3.5, 2, 2, 6), C.ink, { amp: 0.1, st: 0 })}${Pq(ell(4.5, 3.5, 2, 2, 6), C.ink, { amp: 0.1, st: 0 })}</g>`;
  return s;
}
export { C, cut, rect, ell, strip, P, GRAIN, face, PF, Pq, frame, paintGeni, paintMem, paintRoad, paintWhim };
