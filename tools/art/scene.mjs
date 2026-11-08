// Scene pieces for Face Out. Reuses helpers from lib.mjs (copied from directions-2/j-painter/build.mjs).
import { C, rect, ell, strip, P, face, PF, frame, paintGeni, paintMem, paintRoad, paintWhim } from './lib.mjs';

const WOOD = '#7d5d22', WOOD2 = '#5a4216', LIN = '#cdc29c', LIN2 = '#a99e7a';
const plane = (pts, fill, o = {}) => P(pts, fill, { amp: 0.7, seg: 16, ...o });
const flip = (s) => `<g class="flip">${s}</g>`;
const figGroup = (id, cls, inner, hx, hy, hw, hh, label) =>
  `<g class="hot fig ${cls}" id="${id}" tabindex="0" role="button" aria-label="${label}">${inner}<rect class="ring" x="${hx - 4}" y="${hy - 4}" width="${hw + 8}" height="${hh + 8}"/><rect class="hit" x="${hx}" y="${hy}" width="${hw}" height="${hh}"/></g>`;

// ---- shelf: seven blank-spined books, one lying open face down, a small chessboard standing up
function piece(px, py, u, kind, white) {
  const col = white ? C.chalk : C.ink;
  const body = (g) => {
    let s = P([[px - .55 * u, py], [px + .55 * u, py], [px + .32 * u, py - .8 * u], [px - .32 * u, py - .8 * u]], g, { amp: .08, seg: 6 });
    s += P(ell(px, py - 1.15 * u, .5 * u, .5 * u, 7), g, { amp: .08, seg: 6 });
    if (kind === 'k') s += P(rect(px - .1 * u, py - 2.2 * u, .2 * u, .7 * u), g, { amp: .05, seg: 6 }) + P(rect(px - .35 * u, py - 1.95 * u, .7 * u, .2 * u), g, { amp: .05, seg: 6 });
    if (kind === 'r') s += P(rect(px - .55 * u, py - 1.8 * u, 1.1 * u, .55 * u), g, { amp: .05, seg: 6 });
    return s;
  };
  return white ? `<g transform="translate(${px} ${py}) scale(1.22) translate(${-px} ${-py})">${body(C.ink)}</g>` + body(col) : body(col);
}
function board(x, y, s) {
  const q = s / 8;
  let o = P(rect(x - 3, y - 3, s + 6, s + 6), C.ink, { amp: .5, sh: [2, 3], seg: 14 });
  o += P(rect(x, y, s, s), C.chalk, { amp: .3, seg: 16 });
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) if ((r + c) % 2) o += P(rect(x + c * q, y + r * q, q, q), C.green, { amp: .05, seg: 9 });
  const pcs = [[1, 6, 'p', 1], [2, 5, 'p', 1], [4, 4, 'p', 1], [5, 5, 'r', 1], [6, 7, 'k', 1], [1, 2, 'p', 0], [3, 3, 'p', 0], [4, 1, 'r', 0], [6, 2, 'k', 0]];
  for (const [c, r, k, w] of pcs) o += piece(x + (c + .5) * q, y + (r + 1) * q - 0.5, q * .66, k, !!w);
  return o;
}
export function shelf(x, y, k, id) {
  const bk = [[6, 18, 58, C.ochre], [24, 14, 50, C.chalk], [38, 20, 62, C.ver], [58, 15, 46, C.lit], [73, 19, 56, C.chalk], [92, 16, 52, C.ver2], [108, 18, 60, C.ochre]];
  let o = `<g transform="translate(${x} ${y}) scale(${k})">`;
  for (const [bx, w, h, f] of bk) o += P(rect(bx, -h, w, h), f, { amp: .5, seg: 18, st: 1.4, sh: [1.5, 0], sho: .3 }) + P(rect(bx, -h, w, 3), C.ink, { amp: .15, seg: 18 });
  o += P([[128, 0], [131, -17], [158, -25], [185, -17], [188, 0]], C.chalk, { amp: .5, seg: 14, sh: [1.5, 1.5] });
  o += P(strip([[158, -25], [158, -4]], 2.4), C.ink, { amp: .15, seg: 14 }) + P(rect(128, -4, 60, 4), C.ver, { amp: .2, seg: 14 });
  o += `<g class="hot" id="board-${id}" tabindex="0" role="button" aria-label="Chess board on the shelf"><g transform="rotate(-3 222 -26)">${board(196, -54, 52)}</g><rect class="ring" x="188" y="-64" width="72" height="72"/><rect class="hit" x="190" y="-60" width="64" height="66"/></g>`;
  o += P(rect(0, 0, 252, 9), C.ochre, { amp: .7, seg: 20, sh: [2, 3], sho: .45 });
  return o + '</g>';
}
export function mirror(id, x, y, w, h) {
  const cid = 'mc-' + id;
  let s = P(rect(x, y, w, h), C.ink, { amp: 1, sh: [3, 3], st: 1.6 }) + P(rect(x + 5, y + 5, w - 10, h - 10), C.ochre, { amp: .7 });
  s += `<clipPath id="${cid}"><rect x="${x + 9}" y="${y + 9}" width="${w - 18}" height="${h - 18}"/></clipPath>`;
  s += `<g clip-path="url(#${cid})">${P(rect(x + 9, y + 9, w - 18, h - 18), C.deep, { amp: .5 })}<g transform="translate(${x + w / 2} ${y + h * .56}) scale(-1 1)">${face(w * .3, w * .34, PF)}</g></g>`;
  return s;
}
// An open doorway in the back wall: warm daylight, a few lit steps rising into it, and the outdoors beyond
// (sky, distant towers, one coconut palm). Nobody stands in it. `hot` makes it the wide-screen exit card button.
export function door(L, x, y, w, h, hot) {
  const cid = 'dwc-' + L, gy = y + h * 0.66, y2 = y + h;
  let s = P(rect(x - 9, y - 9, w + 18, h + 9), C.ink, { amp: 1.4, sh: [3, 3] });
  s += `<clipPath id="${cid}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#${cid})">`;
  s += P(rect(x - 4, y - 4, w + 8, h * 0.5), '#9cc7cc', { amp: 0.8, seg: 30 });
  s += P(rect(x - 4, y + h * 0.4, w + 8, h * 0.28), '#f3e2a4', { amp: 0.8, seg: 30 });
  s += P(ell(x + w * 0.26, y + h * 0.36, w * 0.2, w * 0.2, 10), '#fbf0c4', { amp: 0.6 });
  // distant towers, a sliver on the left
  const tw = [[0.0, 0.2, 0.2, '#4f7f86'], [0.12, 0.16, 0.3, '#3f6e76'], [0.28, 0.14, 0.22, '#4f7f86'], [0.4, 0.1, 0.15, '#5b8a8f']];
  for (const [fx, fw, fh, col] of tw) {
    const bx = x + fx * w, bw = fw * w, bh = fh * h;
    s += P(rect(bx, gy - bh, bw, bh + 4), col, { amp: 0.5, seg: 14 });
    for (let r = 0; r < 4; r++) s += P(rect(bx + bw * 0.25, gy - bh + 6 + r * bh * 0.22, bw * 0.2, bh * 0.06), '#fbf0c4', { amp: 0.2, seg: 8 });
  }
  s += P(rect(x - 4, gy, w + 8, y2 - gy + 4), C.lit, { amp: 0.8, seg: 30 });
  s += P(rect(x - 4, gy + h * 0.03, w + 8, h * 0.025), C.ochre, { amp: 0.4, seg: 24 });
  // coconut palm: curved trunk, a crown of fronds, a few coconuts
  const bx0 = x + w * 0.7, cx = x + w * 0.58, cy = y + h * 0.26;
  s += P(strip([[bx0, gy + 6], [x + w * 0.67, y + h * 0.5], [x + w * 0.62, y + h * 0.38], [cx, cy]], [w * 0.1, w * 0.085, w * 0.07, w * 0.06]), '#5a4216', { amp: 0.5, seg: 14 });
  const fl = w * 0.5;
  for (const [dx, dy, bend] of [[-1, -0.25, 0.3], [-0.8, 0.35, 0.5], [-0.3, 0.7, 0.45], [0.3, 0.7, 0.45], [0.85, 0.3, 0.5], [1, -0.3, 0.3], [0, -0.7, 0.1]]) {
    const ex = cx + dx * fl, ey = cy + dy * fl * 0.9, mx = cx + dx * fl * 0.55, my = cy + dy * fl * 0.5 - fl * bend * 0.5;
    s += P(strip([[cx, cy], [mx, my], [ex, ey]], [w * 0.075, w * 0.06, w * 0.02]), dx > 0 ? C.green : C.deep, { amp: 0.4, seg: 10 });
  }
  s += P(ell(cx - w * 0.04, cy + w * 0.05, w * 0.045, w * 0.045, 7), C.ink, { amp: 0.2 }) + P(ell(cx + w * 0.05, cy + w * 0.06, w * 0.045, w * 0.045, 7), C.ink, { amp: 0.2 });
  // steps rising into the opening, lit from outside
  const n = 3, sh = h * 0.045;
  for (let i = 0; i < n; i++) {
    const yy = y2 - (i + 1) * sh, ins = i * w * 0.07;
    s += P(rect(x + ins, yy, w - 2 * ins, sh), C.chalk, { amp: 0.3, seg: 16 }) + P(rect(x + ins, yy + sh * 0.7, w - 2 * ins, sh * 0.3), C.ochre2, { amp: 0.2, seg: 16 });
  }
  s += '</g>';
  s += P(rect(x - 9, y - 9, w + 18, 8), C.ink, { amp: 0.5, seg: 20 });
  if (!hot) return `<g aria-hidden="true">${s}</g>`;
  return `<g class="hot" id="door" tabindex="0" role="button" aria-label="Doorway: other ways to reach him" aria-expanded="false" aria-controls="exit">${s}<rect class="ring" x="${x - 14}" y="${y - 14}" width="${w + 28}" height="${h + 14}"/><rect class="hit" x="${x - 14}" y="${y - 14}" width="${w + 28}" height="${h + 14}"/></g>`;
}

// ---- the painter: a brush raised toward the canvas in one hand, a palette in the other
function painter(id) {
  const inner = `
${plane([[-34, -100], [-6, -100], [-9, -10], [-36, -10]], C.ink)}
${plane([[6, -100], [34, -100], [36, -10], [9, -10]], C.ver2)}
${plane([[-42, -10], [-8, -10], [-8, 0], [-44, 0]], C.ink, { seg: 20 })}
${plane([[8, -10], [42, -10], [44, 0], [8, 0]], C.ink, { seg: 20 })}
${plane([[-41, -222], [0, -230], [-3, -96], [-47, -92], [-44, -150]], C.ink, { amp: 1, sh: [3, 3] })}
${plane([[0, -230], [43, -220], [49, -150], [46, -92], [-3, -96]], C.ver, { amp: 1 })}
${plane([[-15, -226], [17, -224], [3, -168]], C.chalk, { seg: 12 })}
${plane([[-8, -222], [9, -221], [2, -196]], C.green, { seg: 10 })}
${plane([[-48, -104], [48, -104], [47, -94], [-48, -94]], C.ochre, { seg: 18 })}
${plane([[-32, -214], [-52, -206], [-60, -190], [-44, -184], [-34, -196]], C.ink, { seg: 12, amp: 0.5 })}
${plane(strip([[-44, -206], [-70, -200], [-86, -238]], 15), C.ink, { seg: 12, amp: 0.5 })}
${plane(ell(-88, -243, 8, 7, 8), C.lit, { amp: 0.4 })}
${plane(strip([[-84, -240], [-120, -268], [-146, -292]], 5.5), C.ochre, { seg: 12, amp: 0.3, sh: [1.5, 1.5], sho: 0.4 })}
${plane(strip([[-108, -259], [-114, -264]], 8), C.chalk, { seg: 8, amp: 0.2 })}
${plane([[-143, -297], [-135, -290], [-153, -281], [-166, -296], [-154, -301]], C.ver, { seg: 7, amp: 0.4 })}
${plane(strip([[40, -208], [58, -178], [34, -154]], 15), C.ver2, { seg: 12, amp: 0.5, sh: [1.5, 2], sho: 0.35 })}
${plane(ell(20, -150, 38, 22, 12, -0.25), WOOD, { amp: 0.8, seg: 14, sh: [2, 2], sho: 0.4 })}
${plane(ell(22, -152, 31, 16, 12, -0.25), C.ochre2, { amp: 0.5, seg: 14 })}
${plane(ell(5, -154, 6, 5, 7), C.chalk, { amp: 0.3 })}${plane(ell(18, -160, 5.5, 4.5, 7), C.ver, { amp: 0.3 })}${plane(ell(32, -155, 6, 5, 7), C.green, { amp: 0.3 })}${plane(ell(36, -144, 5, 4, 7), C.deep, { amp: 0.3 })}${plane(ell(12, -142, 3, 2.4, 6), C.ink, { amp: 0.2 })}
${plane(ell(40, -152, 7.5, 6.5, 8), C.lit, { amp: 0.4 })}
<g class="p-head">
${plane([[-9, -240], [9, -240], [11, -214], [-11, -214]], C.ink, { amp: .5 })}
<g transform="translate(0 -252)"><g class="p-turn">${face(28, 33, PF)}</g></g>
</g>`;
  return figGroup('fig-painter-' + id, 'fpainter', inner, -58, -300, 116, 300, 'The man himself, a brush raised toward the canvas and a palette in his other hand, looking at you');
}

// ---- family: a wife, an older kid, a baby. Faces invented, none a likeness; each distinct in head shape, hair and proportions
function family(L, cx, yb, k, sp) {
  // wife: long oval face, hair falling past the chin, a bun, soft smile
  const adult = `<g class="bz">${plane([[-17, -108], [0, -112], [-2, -6], [-23, -6], [-20, -60]], C.ver2, { sh: [2, 2], sho: .25 })}
${plane([[0, -112], [19, -106], [23, -6], [-2, -6]], C.chalk)}
${plane([[-8, -108], [8, -108], [0, -80]], C.lit, { seg: 10 })}
${plane([[-20, -8], [-2, -8], [-2, 0], [-22, 0]], C.ink, { amp: .4 })}${plane([[2, -8], [24, -8], [26, 0], [2, 0]], C.ink, { amp: .4 })}
<g transform="translate(0 -130)">${flip(plane(ell(3, -42, 10, 8.5, 9), C.ver2, { amp: .4 }) + face(19, 28, { c1: C.lit, c2: C.chalk, c3: C.ver2, c4: C.ver2, cn: C.lit, mood: 'smile', ey: .06, nose: .3, split: .08, eyeS: 1.1, cheeks: '0',
    shape: [[-.55, -1], [.55, -1], [.85, -.4], [.7, .6], [.2, 1.05], [-.25, 1.05], [-.75, .6], [-.9, -.4]],
    hair: [[-1.05, .95], [-.95, -.5], [-.85, -1.15], [-.3, -1.3], [.35, -1.25], [.85, -1.0], [1.0, -.2], [1.08, .95], [.92, 1.25], [.78, .3], [.4, -.5], [-.2, -.7], [-.62, .3], [-.9, 1.25]] }))}</g></g>`;
  // older kid: wide round face, spiky hair, glasses, freckles, big grin, one arm that waves
  const kid1 = `<g class="bz">${plane([[-12, -4], [-2, -4], [-2, 0], [-14, 0]], C.ink, { amp: .4 })}${plane([[4, -4], [16, -4], [16, 0], [4, 0]], C.ink, { amp: .4 })}
${plane([[-15, -72], [0, -76], [-2, -8], [-36, -8], [-26, -40]], C.ver, { sh: [2, 2], sho: .3 })}
${plane([[0, -76], [17, -70], [28, -40], [36, -8], [-2, -8]], C.chalk)}
${plane([[-8, -72], [8, -71], [0, -50]], C.green, { seg: 10 })}
<g class="karm" style="transform-origin:15px -66px">${plane(strip([[15, -66], [24, -46], [28, -30]], 8), C.chalk, { amp: .3, seg: 10 })}${plane(ell(28, -27, 5.2, 5.2, 8), C.lit, { amp: .3 })}</g>
<g transform="translate(0 -100) rotate(-6)">${flip(face(25, 22, { c1: C.lit, c2: C.chalk, c3: C.ver, c4: C.ink, cn: C.lit, mood: 'joy', ey: .1, nose: .26, split: 0, glasses: true, freckles: true,
    shape: [[-.8, -1], [.8, -1], [1.05, -.3], [1.0, .5], [.55, 1], [-.55, 1], [-1.0, .5], [-1.05, -.3]],
    hair: [[-.95, -.4], [-.92, -1.1], [-.72, -1.7], [-.45, -1.1], [-.15, -1.85], [.15, -1.1], [.45, -1.78], [.65, -1.05], [.97, -1.45], [.97, -.45], [.3, -.62], [-.4, -.68]] }))}</g></g>`;
  // baby: head big against the body, huge eyes, tiny nose, a single curl of hair, rosy cheeks
  const kid2 = `<g class="bz">${plane([[-9, -9], [-1, -9], [-1, 0], [-12, 0]], C.ink, { amp: .3 })}${plane([[3, -9], [11, -9], [13, 0], [3, 0]], C.ink, { amp: .3 })}
${plane([[-13, -40], [0, -43], [-1, -9], [-17, -9], [-15, -24]], C.lit, { sh: [2, 2], sho: .3 })}
${plane([[0, -43], [14, -38], [19, -9], [-1, -9]], C.green)}
${plane([[-9, -41], [9, -40], [2, -31]], C.chalk, { seg: 10 })}
<g transform="translate(0 -62) rotate(7)">${flip(face(21, 19, { c1: C.chalk, c2: C.ochre, c3: C.lit, c4: C.ochre2, cn: C.chalk, mood: 'smile', ey: .16, nose: .13, split: .12, eyeS: 1.45, cheeks: '.55',
    shape: [[-.85, -.9], [.85, -.9], [1.05, -.1], [.8, .75], [.1, 1.05], [-.55, .85], [-1.0, -.1]],
    hair: [[-.45, -.95], [-.25, -1.35], [-.05, -1.9], [.3, -1.75], [.38, -1.4], [.12, -1.3], [.5, -.95], [.05, -.84]] }))}</g></g>`;
  const t = (x, y, sc) => `translate(${(cx + x * sp).toFixed(1)} ${(yb + y * k).toFixed(1)}) scale(${sc.toFixed(3)})`;
  const sk = k;
  return `<ellipse cx="${cx + 8 * sp}" cy="${yb + 22 * k}" rx="${58 * k * Math.min(sp, 1.4)}" ry="${5 * k}" fill="${C.ink}" opacity=".22"/>`
    + `<g transform="${t(34, 0, 1 * sk)}">${figGroup('fig-adult-' + L, 'wife', adult, -30, -190, 60, 192, 'Adult figure beside the canvas')}</g>`
    + `<g transform="${t(-24, 14, .78 * sk)}">${figGroup('fig-c1-' + L, 'c1 kid', kid1, -46, -132, 92, 134, 'Child figure')}</g>`
    + `<g transform="${t(16, 28, .86 * sk)}">${figGroup('fig-c2-' + L, 'c2 baby', kid2, -30, -92, 62, 94, 'Baby figure')}</g>`;
}

// ---- the easel with the full canvas, seen from behind; tap turns it to show the self-portrait ----
// local frame: canvas is 138 x 250 with its top-left at 0,0; floor at y=296. Scaled/placed by the caller.
const CW = 138, CH = 250, CCX = 69;
function construct(fstr) {
  const d = fstr.match(/d="(M[^"]+)"/)[1];
  const pts = d.replace(/[MZ]/g, '').split('L').map((p) => p.split(' ').map(Number));
  const g = (x1, y1, x2, y2) => `<path d="M${x1} ${y1}L${x2} ${y2}" class="cl"/>`;
  let s = g(0, -40, 0, 36) + g(-34, -9, 34, -9) + g(-34, 14, 34, 14) + `<path d="M-25 -29H25V29H-25Z" class="cl"/>`;
  const Lp = pts.map(([x, y]) => [-x, y]);
  const pick = [Lp.reduce((a, p) => (p[0] < a[0] ? p : a)), Lp.reduce((a, p) => (p[1] > a[1] ? p : a)), Lp.reduce((a, p) => (p[0] > a[0] ? p : a))];
  const labs = [[-1, 0, 'end'], [-1, 20, 'end'], [1, 0, 'start']];
  pick.forEach(([lx, ly], i) => {
    const o = pts.find(([x, y]) => -x === lx && y === ly);
    const [dx, dy, an] = labs[i];
    s += `<path d="M${lx - 2} ${ly}h4M${lx} ${ly - 2}v4" class="cl2"/>${g(lx, ly, lx + dx * 7, ly + dy * 0.5)}<text class="co" text-anchor="${an}" x="${lx + dx * 9}" y="${ly + dy * 0.5 - 1}">x ${o[0]}</text><text class="co" text-anchor="${an}" x="${lx + dx * 9}" y="${ly + dy * 0.5 + 9}">y ${o[1]}</text>`;
  });
  return s;
}
function portrait(L, depth, ann) {
  const open = ann ? `<g class="drw" clip-path="url(#wipe-${L})">` : '', close = ann ? '</g>' : '';
  const sk = (pts, w = 1.3, o = 0.75) => `<g opacity="${o}">` + P(strip(pts, w), C.ink, { amp: 0.35, seg: 9 }) + '</g>';
  let s = sk([[-8, 28], [-44, 42], [-58, 70], [-62, 120]]) + sk([[-58, 70], [-50, 126]], 1, 0.45) + sk([[66, 98], [70, 140], [72, 175]], 1, 0.45) + sk([[0, 78], [-3, 140]], 1, 0.4);
  s += P([[-12, 24], [12, 24], [46, 38], [64, 70], [60, 100], [-6, 82]], C.ink, { amp: 0.7, seg: 10 });
  s += P([[2, 28], [12, 24], [46, 38], [58, 62], [26, 58], [4, 50]], C.ver, { amp: 0.6, seg: 10 });
  s += P([[-10, 26], [10, 26], [2, 54]], C.chalk, { amp: 0.4, seg: 8 });
  const fstr = face(25, 29, PF);
  s += `<g transform="scale(-1 1)">${fstr}</g>`;
  s += sk([[60, 100], [64, 130], [46, 148]], 1.4, 0.7) + sk([[46, 148], [20, 130]], 1.6, 0.9);
  s += P(strip([[24, 132], [16, 127]], 3.4), C.ver, { amp: 0.3, seg: 8 });
  // his own smaller canvas, holding the same picture
  const X = -44, Y = 112, W = 76, H = 84;
  s += sk([[X, Y], [X + W, Y]], 1.6, 0.9) + sk([[X + W, Y], [X + W, Y + H]], 1.6, 0.9) + sk([[X + W, Y + H], [X, Y + H]], 1.6, 0.9) + sk([[X, Y + H], [X, Y]], 1.6, 0.9);
  if (depth > 0) s += `<g transform="translate(-12 125) scale(.34)">${portrait(L, depth - 1)}</g>`;
  return ann ? `<clipPath id="wipe-${L}"><rect class="wipe" x="-90" y="-60" width="200" height="290"/></clipPath>` + open + s + close + construct(fstr) : s;
}
function canvasObj(L, X, Y, k) {
  const cx0 = 0, cy0 = 0, cw = CW, ch = CH, ccx = CCX, leg = 296;
  const bw = 8;
  const bar = (x, y, w, h) => P(rect(x, y, w, h), WOOD, { amp: 0.45, seg: 30 }) + P(rect(x, y + h - 2.5, w, 2.5), WOOD2, { amp: 0.2, seg: 30 });
  const easel = `<g class="easel">
${P(rect(ccx - 5, cy0 - 46, 10, 70), WOOD2, { amp: 0.4, seg: 20 })}${P(rect(ccx - 17, cy0 - 14, 34, 9), WOOD, { amp: 0.4, seg: 20, sh: [2, 2], sho: 0.3 })}
${P(strip([[ccx + 4, cy0 + 90], [ccx + 30, leg]], 10), WOOD2, { amp: 0.5, seg: 22 })}
${P(strip([[cx0 + 14, cy0 + ch - 36], [cx0 + 4, leg]], 11), WOOD, { amp: 0.5, seg: 22 })}
${P(strip([[cx0 + cw - 14, cy0 + ch - 36], [cx0 + cw - 4, leg]], 11), WOOD, { amp: 0.5, seg: 22 })}
${P(rect(cx0 - 4, 274, cw + 8, 8), WOOD, { amp: 0.5, seg: 22 })}
${P(rect(cx0 - 4, cy0 + ch, cw + 8, 11), WOOD, { amp: 0.6, seg: 22, sh: [3, 4], sho: 0.4 })}
${P(rect(cx0 - 4, cy0 + ch + 8, cw + 8, 3), WOOD2, { amp: 0.3, seg: 22 })}
</g>`;
  let back = `<g>
${P([[cx0 + cw, cy0 + 2], [cx0 + cw + 10, cy0 - 4], [cx0 + cw + 10, cy0 + ch - 5], [cx0 + cw, cy0 + ch]], '#7b7152', { amp: 0.5, seg: 30 })}
${P([[cx0, cy0], [cx0 + 10, cy0 - 4], [cx0 + cw + 10, cy0 - 4], [cx0 + cw, cy0]], '#a89d77', { amp: 0.4, seg: 30 })}
${P(rect(cx0, cy0, cw, ch), LIN, { amp: 1.4, seg: 30, sh: [5, 5], sho: 0.45 })}
${bar(cx0 + 8, cy0 + 8, cw - 16, bw)}${bar(cx0 + 8, cy0 + ch - 8 - bw, cw - 16, bw)}${bar(cx0 + 8, cy0 + 8, bw, ch - 16)}${bar(cx0 + cw - 8 - bw, cy0 + 8, bw, ch - 16)}
${bar(cx0 + 8, cy0 + Math.round(ch * 0.46), cw - 16, bw - 1)}
${P([[cx0, cy0], [cx0 + 15, cy0], [cx0, cy0 + 15]], LIN2, { amp: 0.3, seg: 10 })}${P([[cx0 + cw, cy0], [cx0 + cw - 15, cy0], [cx0 + cw, cy0 + 15]], LIN2, { amp: 0.3, seg: 10 })}
${P([[cx0, cy0 + ch], [cx0 + 15, cy0 + ch], [cx0, cy0 + ch - 15]], LIN2, { amp: 0.3, seg: 10 })}${P([[cx0 + cw, cy0 + ch], [cx0 + cw - 15, cy0 + ch], [cx0 + cw, cy0 + ch - 15]], LIN2, { amp: 0.3, seg: 10 })}`;
  for (let x = cx0 + 22; x < cx0 + cw - 16; x += 24) back += `<circle cx="${x}" cy="${cy0 + 12.5}" r="1.5" fill="${C.chalk}"/><circle cx="${x}" cy="${cy0 + ch - 12.5}" r="1.5" fill="${C.chalk}"/>`;
  for (let y = cy0 + 30; y < cy0 + ch - 20; y += 26) back += `<circle cx="${cx0 + 12}" cy="${y}" r="1.5" fill="${C.chalk}"/><circle cx="${cx0 + cw - 12}" cy="${y}" r="1.5" fill="${C.chalk}"/>`;
  back += '</g>';
  // no nested <svg> here: Hugo's HTML minifier leaves SVG mode at the first inner </svg> and then drops the "/" of every later self-closing tag
  const cue = `<g class="cue" aria-hidden="true">
<g transform="translate(${cx0} ${cy0})"><clipPath id="shc-${L}"><rect width="${cw}" height="${ch}"/></clipPath><g clip-path="url(#shc-${L})"><g class="sheen"><path d="M-70 ${ch + 10}L-40 ${ch + 10}L30 -10L0 -10Z" fill="${C.chalk}" opacity=".85"/></g></g></g>
<g class="star">${P([[ccx + 2, cy0 + 22], [ccx + 11, cy0 + 48], [ccx + 37, cy0 + 57], [ccx + 11, cy0 + 66], [ccx + 2, cy0 + 92], [ccx - 7, cy0 + 66], [ccx - 33, cy0 + 57], [ccx - 7, cy0 + 48]], C.ver, { amp: 0.2, seg: 20, sh: [2, 2], sho: 0.5 })}</g>
</g>`;
  const front = `${P(rect(cx0, cy0, cw, ch), C.chalk, { amp: 1.4, seg: 30, sh: [5, 5], sho: 0.45 })}
<g transform="translate(${ccx - 4} ${cy0 + 54}) scale(.8)">${portrait(L, 2, true)}</g>`;
  // flip groups: origin sits on the canvas's vertical centre line, so scaleX turns it about its own middle
  const fl = (cls, inner) => `<g transform="translate(${ccx} 0)"><g class="${cls}"><g transform="translate(${-ccx} 0)">${inner}</g></g></g>`;
  return `<ellipse cx="${X + ccx * k}" cy="${Y + (leg + 4) * k}" rx="${92 * k}" ry="${7 * k}" fill="${C.ink}" opacity=".22"/>`
    + `<g id="canvas-${L}" class="hot cvs" transform="translate(${X} ${Y}) scale(${k})" tabindex="0" role="button" aria-pressed="false" aria-label="Turn the canvas around">`
    + easel + `<g transform="translate(${ccx} ${leg})"><g class="wob"><g transform="translate(${-ccx} ${-leg})">` + fl('cvb', back) + cue + fl('cvf', front)
    + `</g></g></g><rect class="ring" x="-8" y="-12" width="${cw + 28}" height="${ch + 26}"/><rect class="hit" x="-6" y="-8" width="${cw + 22}" height="${ch + 40}"/></g>`;
}

// ---- keyboard: five keys on a wall ledge, one tone each ----
function keyboard(L, x, y, kw, kh) {
  const names = ['C', 'D', 'E', 'G', 'A'], notes = [261.63, 293.66, 329.63, 392.0, 440.0];
  let s = `<g id="kbd-${L}">`;
  s += P(strip([[x + 14, y + kh + 6], [x + 14, y + kh + 26]], 6), WOOD2, { amp: .3, seg: 8 }) + P(strip([[x + kw * 5 - 14, y + kh + 6], [x + kw * 5 - 14, y + kh + 26]], 6), WOOD2, { amp: .3, seg: 8 });
  s += P(rect(x - 6, y + kh - 2, kw * 5 + 12, 10), C.ochre, { amp: .7, sh: [2, 3], sho: .35, st: 1.6, seg: 24 });
  notes.forEach((f, i) => {
    const kx = x + i * kw;
    s += `<g class="hot key" data-f="${f}" tabindex="0" role="button" aria-label="Piano key ${names[i]}"><g class="kc">${P(rect(kx + 1, y, kw - 2, kh), C.chalk, { amp: .6, seg: 22, st: 2 })}${P(rect(kx + 4, y + kh * .7, kw - 8, kh * .24), C.linen, { amp: .3, seg: 22, st: 0 })}</g><rect class="ring" x="${kx - 2}" y="${y - 4}" width="${kw + 4}" height="${kh + 8}"/><rect class="hit" x="${kx}" y="${y - 4}" width="${kw}" height="${kh + 8}"/></g>`;
  });
  for (const i of [0, 1, 3]) s += `<g style="pointer-events:none">${P(rect(x + (i + 1) * kw - kw * .2, y, kw * .4, kh * .62), C.ink, { amp: .35, seg: 20, st: 1.4 })}</g>`;
  return s + '</g>';
}

export function scene(L) {
  const p = L === 'p';
  const W = p ? 390 : 1440, H = p ? 844 : 900;
  let o = '';
  const add = (x) => { o += x + '\n'; };
  const floorY = p ? 312 : 796;
  add(`<rect width="${W}" height="${H}" fill="${C.ink}"/>`);
  add(P([[-20, -20], [W + 20, -20], [W + 20, H + 20], [-20, H + 20]], C.green, { amp: 1 }));
  const dy = p ? 214 : 300;
  add(P([[-20, -20], [W + 20, -20], [W + 20, dy - 6], [W * .66, dy + 2], [W * .33, dy - 4], [-20, dy + 2]], C.deep, { amp: 2.5, seg: 40 }));
  add(P([[-20, floorY - 10], [W + 20, floorY - 10], [W + 20, floorY + 2], [-20, floorY + 2]], C.shade ?? '#0b2a20', { amp: 1 }));
  // floor
  add(P([[-20, floorY], [W + 20, floorY], [W + 20, H + 40], [-20, H + 40]], C.ochre, { amp: 1.4, seg: 40 }));
  const stripes = p ? [[floorY + 40, 5], [floorY + 82, 6], [floorY + 140, 7]] : [[836, 6], [872, 8]];
  for (const [y, h] of stripes) add(P([[-20, y], [W + 20, y], [W + 20, y + h], [-20, y + h]], C.ochre2, { amp: 1.2, seg: 40 }));
  // one light, from the doorway side: pools of it fall across the floor in the same direction everywhere
  if (p) for (const x of [40, 170, 300]) add(P([[x, floorY + 56], [x + 56, floorY + 56], [x + 92, floorY + 150], [x + 30, floorY + 150]], C.lit, { amp: 1.2 }));
  if (!p) {
    for (const x of [1118, 1204, 1290]) add(P([[x, floorY + 20], [x + 70, floorY + 20], [x + 110, floorY + 80], [x + 40, floorY + 80]], C.lit, { amp: 1.2 }));
    add(P([[1352, floorY], [1424, floorY], [1440, floorY + 70], [1290, floorY + 70]], C.lit, { amp: 1.2 }));
  }

  const fr = (id, x, y, w, h, bg, fn, label, endLabel) => frame(id + '-' + L, x, y, w, h, bg, fn, label, endLabel);
  if (p) {
    add(shelf(14, 98, .8, L));
    add(fr('art-mem', 270, 8, 102, 88, C.deep, paintMem, 'Membral'));
    add(fr('art-whim', 222, 12, 38, 80, C.deep, paintWhim, 'Whimsical', true));
    add(keyboard(L, 176, 128, 40, 34));
  } else {
    add(shelf(1036, 424, 1.0, L));
    add(fr('art-mem', 716, 76, 146, 122, C.deep, paintMem, 'Membral'));
    add(fr('art-geni', 886, 68, 140, 130, C.deep, paintGeni, 'GeniusAIx'));
    add(fr('art-road', 1052, 80, 164, 116, C.linen, paintRoad, 'Mumbai Circuit Planner'));
    add(mirror('w', 1262, 96, 64, 96));
    add(fr('art-whim', 1344, 84, 62, 108, C.deep, paintWhim, 'Whimsical', true));
    add(keyboard(L, 1030, 246, 52, 58));
  }
  add(door(L, ...(p ? [214, 172, 54, 140] : [1310, 300, 104, 496]), !p));
  // easel with the full canvas
  add(p ? canvasObj(L, 14, 120, .72) : canvasObj(L, 690, 372, 1.45));
  // painter faces the canvas; family stands to the right
  if (p) {
    add(`<g transform="translate(166 320) scale(.62)"><g class="p-move" id="pm-p"><g class="p-body">${painter('p')}</g></g></g>`);
    add(family('p', 326, 318, .78, .95));
  } else {
    add(`<g transform="translate(990 800) scale(1.5)"><g class="p-move" id="pm-h"><g class="p-body">${painter('h')}</g></g></g>`);
    add(family('h', 1160, 812, 1.75, 2.1));
  }
  return { svg: o, W, H };
}
