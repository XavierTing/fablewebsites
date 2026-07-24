/* 聞香 MONKŌ — incense smoke: a ribbon of nodes advected by curl noise.
   Laminar thread near the ember, folding curls above; click stirs the air. */
(() => {
'use strict';

const qs = new URLSearchParams(location.search);
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches || qs.get('rm') === '1';

const hero = document.getElementById('hero');
const canvas = document.getElementById('smoke');
const ctx = canvas.getContext('2d');
const emberMark = document.getElementById('ember-mark');

/* ---------------- value noise (3D, hashed lattice) ---------------- */
const P = new Uint8Array(512);
{
  const arr = new Uint8Array(256);
  for (let i = 0; i < 256; i++) arr[i] = i;
  let s = 987654321;
  for (let i = 255; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
  }
  for (let i = 0; i < 512; i++) P[i] = arr[i & 255];
}
const fade = t => t * t * t * (t * (t * 6 - 15) + 10);
function vn(x, y, z) {
  let ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
  const fx = x - ix, fy = y - iy, fz = z - iz;
  ix &= 255; iy &= 255; iz &= 255;
  const u = fade(fx), v = fade(fy), w = fade(fz);
  const A = P[ix] + iy, B = P[ix + 1] + iy;
  const AA = P[A & 255] + iz, AB = P[(A + 1) & 255] + iz;
  const BA = P[B & 255] + iz, BB = P[(B + 1) & 255] + iz;
  const c000 = P[AA & 255], c100 = P[BA & 255], c010 = P[AB & 255], c110 = P[BB & 255];
  const c001 = P[(AA + 1) & 255], c101 = P[(BA + 1) & 255], c011 = P[(AB + 1) & 255], c111 = P[(BB + 1) & 255];
  const x00 = c000 + (c100 - c000) * u, x10 = c010 + (c110 - c010) * u;
  const x01 = c001 + (c101 - c001) * u, x11 = c011 + (c111 - c011) * u;
  const y0 = x00 + (x10 - x00) * v, y1 = x01 + (x11 - x01) * v;
  return ((y0 + (y1 - y0) * w) / 255) * 2 - 1;
}

/* field sampled in noise space; curl gives divergence-free swirl */
const F1 = 0.004, TS = 0.06, VDRIFT = 55; /* field advects upward with the plume */
function field(u, v, t) {
  return vn(u, v, t) + 0.65 * vn(u * 2.3 + 37.2, v * 2.3 + 11.9, t * 1.6 + 5.0);
}
const _c = [0, 0];
function curlAt(x, y, t) {
  const u = x * F1, v = (y + VDRIFT * t) * F1, e = 0.35, tt = t * TS;
  const n1 = field(u, v + e, tt), n2 = field(u, v - e, tt);
  const n3 = field(u + e, v, tt), n4 = field(u - e, v, tt);
  _c[0] = (n1 - n2) / (2 * e);
  _c[1] = -((n3 - n4) / (2 * e));
  return _c;
}
const sm01 = t => { t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); };

/* ---------------- blends ---------------- */
const BLENDS = [
  { col: [96, 108, 122],  scent: 'Dark honey and cool resin — an old temple’s shadowed beam.' },
  { col: [124, 112, 98],  scent: 'Dry and warm — planed cedar, warm milk, one grain of white pepper.' },
  { col: [126, 102, 108], scent: 'Early plum in cold air; a green stem, just snapped.' }
];
const cur = { r: 96, g: 108, b: 122 };
let target = BLENDS[0].col;

/* soft round sprite for the dissolving haze */
const sprite = document.createElement('canvas');
sprite.width = sprite.height = 96;
const sctx = sprite.getContext('2d');
function paintSprite() {
  sctx.clearRect(0, 0, 96, 96);
  const g = sctx.createRadialGradient(48, 48, 0, 48, 48, 48);
  const c = `${cur.r | 0},${cur.g | 0},${cur.b | 0}`;
  g.addColorStop(0, `rgba(${c},0.5)`);
  g.addColorStop(0.5, `rgba(${c},0.16)`);
  g.addColorStop(1, `rgba(${c},0)`);
  sctx.fillStyle = g;
  sctx.fillRect(0, 0, 96, 96);
}
paintSprite();
let strokeCol = `rgb(${cur.r | 0},${cur.g | 0},${cur.b | 0})`;

/* ---------------- simulation state ---------------- */
const CFG = { rate: 66, life: 6.8, rise: 124, riseSlow: 46, laminar: 90, curlAmp: 26, curlBase: 0.07, drift: 5.5 };
let nodes = [];            // ordered by emission → drawn as one ribbon
const impulses = [];
let simT = 0, spawnAcc = 0;
let W = 0, H = 0, emberX = 0, emberY = 0;

function measure() {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const r = hero.getBoundingClientRect();
  W = r.width; H = r.height;
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const m = emberMark.getBoundingClientRect();
  emberX = m.left + m.width / 2 - r.left;
  emberY = m.top + m.height / 2 - r.top;
  const small = W < 640;
  CFG.rate = small ? 56 : 66;
  CFG.life = small ? 6.0 : 6.8;
  CFG.laminar = small ? 76 : 90;
  CFG.curlAmp = small ? 24 : 26;
}

function stepSim(dt) {
  simT += dt;
  for (let i = impulses.length - 1; i >= 0; i--) {
    if (simT - impulses[i].t0 > 1.4) impulses.splice(i, 1);
  }
  spawnAcc += dt * CFG.rate;
  while (spawnAcc >= 1) {
    spawnAcc -= 1;
    nodes.push({ x: emberX + (Math.random() - 0.5) * 1.1, y: emberY, age: 0, seed: 0.9 + Math.random() * 0.2 });
  }
  for (let i = 0; i < nodes.length; i++) {
    const p = nodes[i];
    p.age += dt;
    const hr = emberY - p.y;
    const lam = hr > 0 ? hr / CFG.laminar : 0;
    const ramp = (CFG.curlBase + Math.pow(lam > 1 ? 1 : lam, 1.7)) * (1 + 0.4 * sm01((hr - 120) / 240));
    const c = curlAt(p.x, p.y, simT);
    let vx = c[0] * CFG.curlAmp * ramp;
    let vy = c[1] * CFG.curlAmp * ramp;
    vy -= CFG.rise - CFG.riseSlow * sm01((p.age - 1.4) / 4.2);
    vx += Math.sin(simT * 0.33 + p.y * 0.005) * CFG.drift * sm01(hr / 70);
    for (let k = 0; k < impulses.length; k++) {
      const im = impulses[k];
      const dx = p.x - im.x, dy = p.y - im.y;
      const d2 = dx * dx + dy * dy;
      const g = Math.exp(-d2 / (im.r * im.r)) * Math.exp(-(simT - im.t0) / 0.35) * im.s;
      if (g > 0.4) {
        const d = Math.sqrt(d2) + 0.0001;
        vx += (dx / d) * g;
        vy += (dy / d) * g;
      }
    }
    p.x += vx * dt;
    p.y += vy * dt;
  }
  while (nodes.length && nodes[0].age > CFG.life) nodes.shift();
}

/* ---------------- render ---------------- */
const topFade = y => sm01(y / 120);
function alphaFor(age) {
  const inRamp = age < 0.15 ? age / 0.15 : 1;
  const lifeT = age / CFG.life;
  const dissolve = 1 - 0.8 * sm01((age - 4.0) / 2.4); /* core thins but folds stay legible */
  return 0.52 * inRamp * Math.pow(1 - (lifeT > 1 ? 1 : lifeT), 1.1) * dissolve;
}
function widthFor(age) {
  const t = age / CFG.life;
  return 1.35 + Math.pow(t > 1 ? 1 : t, 1.5) * 7.5;
}

function drawEmber() {
  const fl = REDUCED ? 0.55 : 0.5 + 0.5 * vn(simT * 2.2, 3.3, 7.7);
  const r = 4.2 + 2 * fl;
  const g = ctx.createRadialGradient(emberX, emberY, 0, emberX, emberY, r * 2.4);
  g.addColorStop(0, `rgba(255,178,116,${0.7 * (0.6 + 0.4 * fl)})`);
  g.addColorStop(0.3, `rgba(222,108,52,${0.4 * (0.55 + 0.45 * fl)})`);
  g.addColorStop(1, 'rgba(222,108,52,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(emberX, emberY, r * 2.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = `rgba(255,214,178,${0.55 + 0.3 * fl})`;
  ctx.beginPath();
  ctx.arc(emberX, emberY, 1.3 + 0.5 * fl, 0, Math.PI * 2);
  ctx.fill();
}

function render() {
  ctx.clearRect(0, 0, W, H);
  drawEmber();
  const n = nodes.length;
  if (n < 3) return;

  /* haze: old nodes dissolve wide */
  for (let i = 0; i < n; i += 2) {
    const p = nodes[i];
    if (p.age < 2.9) continue;
    const t = (p.age - 2.9) / (CFG.life - 2.9);
    const r = 13 + t * 44;
    const a = 0.05 * sm01(t / 0.3) * (1 - t) * topFade(p.y);
    if (a < 0.004) continue;
    ctx.globalAlpha = a;
    ctx.drawImage(sprite, p.x - r, p.y - r, r * 2, r * 2);
  }

  /* ribbon: two passes — soft halo then silk core */
  ctx.lineCap = 'butt';
  ctx.strokeStyle = strokeCol;
  for (let pass = 0; pass < 2; pass++) {
    const wMul = pass === 0 ? 2.3 : 1;
    const aMul = pass === 0 ? 0.3 : 1;
    for (let i = 1; i < n - 1; i++) {
      const p0 = nodes[i - 1], p1 = nodes[i], p2 = nodes[i + 1];
      const a = alphaFor(p1.age) * topFade(p1.y) * aMul;
      if (a < 0.005) continue;
      ctx.globalAlpha = a;
      ctx.lineWidth = widthFor(p1.age) * p1.seed * wMul;
      ctx.beginPath();
      ctx.moveTo((p0.x + p1.x) / 2, (p0.y + p1.y) / 2);
      ctx.quadraticCurveTo(p1.x, p1.y, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
}

/* colour lerp toward blend target */
function stepColor(dt) {
  const k = 1 - Math.exp(-dt * 2.6);
  const dr = target[0] - cur.r, dg = target[1] - cur.g, db = target[2] - cur.b;
  if (Math.abs(dr) + Math.abs(dg) + Math.abs(db) < 0.6) return;
  cur.r += dr * k; cur.g += dg * k; cur.b += db * k;
  strokeCol = `rgb(${cur.r | 0},${cur.g | 0},${cur.b | 0})`;
  paintSprite();
}

/* ---------------- loop ---------------- */
let raf = 0, last = 0, running = false;
function frame(ts) {
  raf = requestAnimationFrame(frame);
  const dt = Math.min(0.033, (ts - last) / 1000 || 0.016);
  last = ts;
  stepSim(dt);
  stepColor(dt);
  render();
}
function start() {
  if (running || REDUCED) return;
  running = true;
  last = performance.now();
  raf = requestAnimationFrame(frame);
}
function stop() {
  running = false;
  cancelAnimationFrame(raf);
}
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stop(); else start();
});

function prewarm(steps) {
  nodes = [];
  spawnAcc = 0;
  for (let i = 0; i < steps; i++) stepSim(1 / 60);
}

/* ---------------- interaction ---------------- */
hero.addEventListener('pointerdown', e => {
  if (e.target.closest('a,button')) return;
  const r = hero.getBoundingClientRect();
  impulses.push({ x: e.clientX - r.left, y: e.clientY - r.top, t0: simT, r: 95, s: 260 });
  if (REDUCED) return;
});

const scentLine = document.getElementById('scent-line');
document.querySelectorAll('.bs').forEach(btn => {
  btn.addEventListener('click', () => {
    const i = +btn.dataset.blend;
    target = BLENDS[i].col;
    document.querySelectorAll('.bs').forEach(b => {
      const on = b === btn;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    scentLine.classList.add('fade');
    setTimeout(() => {
      scentLine.textContent = BLENDS[i].scent;
      scentLine.classList.remove('fade');
    }, REDUCED ? 0 : 380);
    if (REDUCED) { stepColor(10); render(); }
  });
});

/* reveal on scroll */
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.rv').forEach(el => io.observe(el));

/* ---------------- init ---------------- */
function init() {
  const b = parseInt(qs.get('blend') || '0', 10);
  if (b > 0 && b < 3) {
    target = BLENDS[b].col;
    cur.r = target[0]; cur.g = target[1]; cur.b = target[2];
    strokeCol = `rgb(${cur.r},${cur.g},${cur.b})`;
    paintSprite();
    const btns = document.querySelectorAll('.bs');
    btns.forEach((el, i) => {
      el.classList.toggle('on', i === b);
      el.setAttribute('aria-pressed', String(i === b));
    });
    scentLine.textContent = BLENDS[b].scent;
  }
  measure();
  if (qs.get('lit') === '1' || REDUCED) prewarm(340);
  if (REDUCED) render(); else start();
}
let rsT = 0;
window.addEventListener('resize', () => {
  clearTimeout(rsT);
  rsT = setTimeout(() => {
    measure();
    prewarm(340);
    if (REDUCED) render();
  }, 160);
});
if (document.readyState === 'complete') init();
else window.addEventListener('load', init);

/* dev aid for pass screenshots: ?y=<px> jumps scroll */
const y = parseInt(qs.get('y') || '0', 10);
if (y > 0) window.addEventListener('load', () => setTimeout(() => window.scrollTo(0, y), 150));
})();
