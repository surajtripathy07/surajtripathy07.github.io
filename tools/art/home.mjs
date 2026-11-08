// Home page art: the painted studio (phone and wide rooms), the wide and phone sheet edges and one paint dab per
// listed drop. Writes Hugo partials and data/dabs.json. Static inline SVG, seeded jitter.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { C } from './lib.mjs';
import { scene } from './scene.mjs';
import { sheetEdgeV, sheetEdgeH } from './tear.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const out = (p, body) => { const f = path.join(root, p); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, body); console.log(p, Buffer.byteLength(body), 'bytes'); };

const SP = scene('p'), SH = scene('h');

// tears: wide = vertical edge in a 120 x 900 strip; phone = horizontal edge in a 400 x 48 strip
const TV = sheetEdgeV(900, 40, 90, { at: 520, half: 80, depth: -56, min: 9 });
const TH = sheetEdgeH(400, 10, 16, { at: 262, half: 50, depth: 24, min: 38 });

// paint dabs: one seeded, directional blob per drop (deterministic by index)
function dabRng(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function dab(i){
  const r = dabRng(1000 + i * 97), f = n => n.toFixed(1);
  const ang = (-0.55 + r() * 0.9), ca = Math.cos(ang), sa = Math.sin(ang);
  const N = 14, pts = [];
  for (let k = 0; k < N; k++) {
    const t = k / N * Math.PI * 2;
    // long axis along the stroke, flat-ish tail, rounder loaded head
    let rad = 1 + (r() - .5) * .34 + .1 * Math.cos(2 * t);
    const ex = Math.cos(t) * 15 * rad * 1.08, ey = Math.sin(t) * 15 * rad * .8;
    const tail = ex < 0 ? 1 + ex / 60 : 1;
    pts.push([16 + ex * ca * tail - ey * sa, 16 + ex * sa * tail + ey * ca]);
  }
  let d = '';
  for (let k = 0; k < N; k++) {
    const p0 = pts[(k + N - 1) % N], p1 = pts[k], p2 = pts[(k + 1) % N], p3 = pts[(k + 2) % N];
    if (!k) d += 'M' + f(p1[0]) + ' ' + f(p1[1]);
    d += 'C' + f(p1[0] + (p2[0] - p0[0]) / 6) + ' ' + f(p1[1] + (p2[1] - p0[1]) / 6) + ' ' + f(p2[0] - (p3[0] - p1[0]) / 6) + ' ' + f(p2[1] - (p3[1] - p1[1]) / 6) + ' ' + f(p2[0]) + ' ' + f(p2[1]);
  }
  // bristle streaks: thin lines along the stroke direction, lighter then darker
  let st = '';
  for (let k = 0; k < 2; k++) {
    const off = (k ? 1 : -1) * (2.5 + r() * 3), len = 8 + r() * 5, bx = 16 - ca * 3 - sa * off, by = 16 - sa * 3 + ca * off;
    st += '<path class="' + (k ? 'sk' : 'sl') + '" d="M' + f(bx - ca * len) + ' ' + f(by - sa * len) + 'Q' + f(bx + sa * 1.2) + ' ' + f(by - ca * 1.2) + ' ' + f(bx + ca * len) + ' ' + f(by + sa * len) + '"/>';
  }
  const wet = i === 0;
  // wet: pale curved sheen up on the head plus a raised darker rim
  const sheen = wet ? '<path class="sh2" d="M' + f(16 + ca * 4 - sa * 7) + ' ' + f(16 + sa * 4 + ca * 7) + 'Q' + f(16 + ca * 9 - sa * 6) + ' ' + f(16 + sa * 9 + ca * 6) + ' ' + f(16 + ca * 11 - sa * 1) + ' ' + f(16 + sa * 11 + ca * 1) + '"/>' : '';
  return '<svg class="dab c' + (i % 5) + (wet ? ' wet' : '') + '" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><path class="bd" d="' + d + 'Z"/>' + st + sheen + '</svg>';
}


const LABEL = 'A painted studio. A man with a brush and palette faces a canvas on an easel; beside him are his wife, an older child and a baby. A keyboard of five keys is mounted on the wall, and paintings of his projects hang above.';
const rooms = `<svg class="room sp" id="room-p" viewBox="0 0 ${SP.W} ${SP.H}" preserveAspectRatio="xMidYMin slice" role="img" aria-label="${LABEL}">
${SP.svg}</svg>
<svg class="room sw" id="room-h" viewBox="0 0 ${SH.W} ${SH.H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${LABEL}">
${SH.svg}</svg>
`;
const wide = `<svg class="dshade" viewBox="0 0 120 900" preserveAspectRatio="none" aria-hidden="true" focusable="false"><defs><filter id="blur" x="-30%" y="-5%" width="160%" height="110%"><feGaussianBlur stdDeviation="4"/></filter></defs><path d="${TV.rim}" transform="translate(4 3)" fill="${C.ink}" opacity=".7" filter="url(#blur)"/></svg>
<svg class="dedge" viewBox="0 0 120 900" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="${TV.rim}" fill="#f7f3e8"/><path d="${TV.paper}" fill="${C.chalk}"/></svg>
`;
const phone = `<svg class="medge" viewBox="0 0 400 48" preserveAspectRatio="none" aria-hidden="true" focusable="false"><defs><filter id="blurm" x="-5%" y="-60%" width="110%" height="220%"><feGaussianBlur stdDeviation="3.2"/></filter></defs><path d="${TH.rim}" transform="translate(2 -2)" fill="${C.ink}" opacity=".6" filter="url(#blurm)"/><path d="${TH.rim}" fill="#f7f3e8"/><path d="${TH.paper}" fill="${C.chalk}"/></svg>
`;
out('layouts/partials/art/home-scene.html', rooms);
out('layouts/partials/art/home-edge-wide.html', wide);
out('layouts/partials/art/home-edge-phone.html', phone);
out('data/dabs.json', JSON.stringify(Array.from({ length: 5 }, (_, i) => dab(i))) + '\n');
