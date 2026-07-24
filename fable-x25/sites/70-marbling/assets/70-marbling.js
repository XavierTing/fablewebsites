/* ————————————————————————————————————————————————
   MARMOR · closed-form marbling engine
   Every ink drop is a polygon. Three exact transforms:
     drop:  p' = c + (p−c)·√(1 + r²/|p−c|²)      (area-preserving displacement)
     tine:  p' = p + m·u·z/(z+d)                  (d ⟂ distance to stylus line)
     comb:  tine over a rack of parallel lines    (d = distance to nearest tine)
   After Lu et al. / Jaffer, "Mathematical Marbling".
   ———————————————————————————————————————————————— */
(() => {
'use strict';

/* ————— constants ————— */
const LW = 1000, LH = 700;            // logical tank space
const MAXDROPS = 60;                  // cap: discard oldest beyond this
const MAXV = 4200;                    // per-drop vertex cap
const BATH = '#e9e0ca';
const PAL = ['#6e2b25', '#2e4a3d', '#2c3a5e', '#b98a33', '#241f1a'];
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const DPR = () => Math.min(window.devicePixelRatio || 1, 2);

const mulberry32 = seed => () => {
  seed |= 0; seed = seed + 0x6D2B79F5 | 0;
  let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};

/* ————— engine ————— */
class Marbler {
  constructor(){ this.drops = []; }
  clear(){ this.drops = []; }

  /* subdivide long edges so nonlinear transforms bend smoothly */
  static refine(v, maxLen){
    const n = v.length >> 1;
    if (v.length >= MAXV) return v;
    const out = [];
    const ml2 = maxLen * maxLen;
    for (let i = 0; i < n; i++){
      const x0 = v[2*i], y0 = v[2*i+1];
      const j = (i + 1) % n;
      const x1 = v[2*j], y1 = v[2*j+1];
      out.push(x0, y0);
      const dx = x1 - x0, dy = y1 - y0, d2 = dx*dx + dy*dy;
      if (d2 > ml2){
        const k = Math.min(Math.ceil(Math.sqrt(d2) / maxLen), 10);
        for (let s = 1; s < k; s++) out.push(x0 + dx * s / k, y0 + dy * s / k);
      }
      if (out.length >= MAXV){
        for (let r = i + 1; r < n; r++) out.push(v[2*r], v[2*r+1]);
        return out;
      }
    }
    return out;
  }

  /* drop collinear vertices (long combed streaks are straight — huge savings) */
  static simplify(v){
    const n = v.length >> 1;
    if (n < 500) return v;
    const out = [v[0], v[1]];
    for (let i = 1; i < n - 1; i++){
      const ax = out[out.length - 2], ay = out[out.length - 1];
      const bx = v[2*i], by = v[2*i+1];
      const cx = v[2*i+2], cy = v[2*i+3];
      const area = Math.abs((bx-ax)*(cy-ay) - (cx-ax)*(by-ay));
      const base = Math.hypot(cx-ax, cy-ay) || 1;
      if (area / base < 0.18) continue;         // b is (near) collinear — drop it
      out.push(bx, by);
    }
    out.push(v[2*n-2], v[2*n-1]);
    return out;
  }

  /* 1 · ink drop — exact area-preserving displacement */
  drop(cx, cy, r, color){
    const r2 = r * r;
    for (const d of this.drops){
      let v = Marbler.refine(d.v, 6);
      for (let i = 0; i < v.length; i += 2){
        const dx = v[i] - cx, dy = v[i+1] - cy;
        const l2 = dx*dx + dy*dy || 1e-9;
        const s = Math.sqrt(1 + r2 / l2);
        v[i]   = cx + dx * s;
        v[i+1] = cy + dy * s;
      }
      d.v = Marbler.simplify(v);
    }
    const n = 110, cv = new Array(n * 2);
    for (let i = 0; i < n; i++){
      const a = (i / n) * Math.PI * 2;
      cv[2*i]   = cx + r * Math.cos(a);
      cv[2*i+1] = cy + r * Math.sin(a);
    }
    this.drops.push({ color, v: cv });
    if (this.drops.length > MAXDROPS) this.drops.splice(0, this.drops.length - MAXDROPS);
  }

  /* 2 · tine (stylus) line — split into passes so refinement tracks the bend */
  tine(ax, ay, mx, my, u, z = 42){
    const ml = Math.hypot(mx, my) || 1; mx /= ml; my /= ml;
    let rest = u;
    while (rest > 0.01){
      const step = Math.min(rest, 110); rest -= step;
      for (const d of this.drops){
        let v = Marbler.refine(d.v, 3);
        for (let i = 0; i < v.length; i += 2){
          const px = v[i] - ax, py = v[i+1] - ay;
          const dist = Math.abs(px * my - py * mx);
          const f = step * z / (z + dist);
          v[i]   += mx * f;
          v[i+1] += my * f;
        }
        d.v = Marbler.simplify(v);
      }
    }
  }

  /* 3 · comb — a rack of parallel tines (lines ∥ m, spaced `spacing` apart) */
  comb(ax, ay, mx, my, spacing, u, z){
    const ml = Math.hypot(mx, my) || 1; mx /= ml; my /= ml;
    let rest = u;
    while (rest > 0.01){
      const step = Math.min(rest, 100); rest -= step;
      for (const d of this.drops){
        let v = Marbler.refine(d.v, 2.0);
        for (let i = 0; i < v.length; i += 2){
          const px = v[i] - ax, py = v[i+1] - ay;
          let t = px * my - py * mx;               // signed ⟂ offset from rack origin
          t = ((t % spacing) + spacing) % spacing;
          const dist = Math.min(t, spacing - t);   // distance to nearest tine
          const f = step * z / (z + dist);
          v[i]   += mx * f;
          v[i+1] += my * f;
        }
        d.v = Marbler.simplify(v);
      }
    }
  }

  renderTo(ctx, w, h){
    ctx.setTransform(w / LW, 0, 0, h / LH, 0, 0);
    ctx.fillStyle = BATH;
    ctx.fillRect(0, 0, LW, LH);
    for (const d of this.drops){
      const v = d.v;
      if (v.length < 6) continue;
      const p = new Path2D();
      p.moveTo(v[0], v[1]);
      for (let i = 2; i < v.length; i += 2) p.lineTo(v[i], v[i+1]);
      p.closePath();
      ctx.fillStyle = d.color;
      ctx.fill(p);
      ctx.strokeStyle = d.color;   // hairline stroke smooths AA seams
      ctx.lineWidth = 0.6;
      ctx.stroke(p);
    }
  }
}

/* ————— pattern vocabulary ————— */
function stoneShower(m, rng, clusters, opts = {}){
  const x0 = opts.x0 ?? 50,        x1 = opts.x1 ?? LW - 50;
  const y0 = opts.y0 ?? 50,        y1 = opts.y1 ?? LH - 50;
  const gall = opts.gall ?? 0.3;
  for (let i = 0; i < clusters; i++){
    const cx = x0 + rng() * (x1 - x0);
    const cy = y0 + rng() * (y1 - y0);
    const base = Math.floor(rng() * PAL.length);
    const rings = 2 + (rng() < 0.65 ? 1 : 0);
    let r = (opts.rBase ?? 58) + rng() * (opts.rVar ?? 40);
    for (let k = 0; k < rings; k++){
      const isGall = k === rings - 1 && rng() < gall;
      const col = isGall ? BATH : PAL[(base + k * 2) % PAL.length];
      m.drop(cx + (rng() - .5) * 6, cy + (rng() - .5) * 6, r, col);
      r *= 0.6;
    }
  }
}
/* an even battal ground: stones thrown on a jittered grid until the bath is covered */
function stoneGround(m, rng, opts = {}){
  const cols = opts.cols ?? 6, rows = opts.rows ?? 4;
  const x0 = opts.x0 ?? -40, x1 = opts.x1 ?? LW + 40;
  const y0 = opts.y0 ?? -40, y1 = opts.y1 ?? LH + 40;
  const gall = opts.gall ?? 0.3;
  const cw = (x1 - x0) / cols, ch = (y1 - y0) / rows;
  const cells = [];
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) cells.push([i, j]);
  for (let i = cells.length - 1; i > 0; i--){        // seeded shuffle — layering order matters
    const j = Math.floor(rng() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }
  for (const [i, j] of cells){
    const cx = x0 + (i + .5) * cw + (rng() - .5) * cw * .55;
    const cy = y0 + (j + .5) * ch + (rng() - .5) * ch * .55;
    const base = Math.floor(rng() * PAL.length);
    const rings = rng() < 0.68 ? 2 : 1;
    let r = 100 + rng() * 30;
    for (let k = 0; k < rings; k++){
      const isGall = k === rings - 1 && rings > 1 && rng() < gall;
      const col = isGall ? BATH : PAL[(base + k * 2) % PAL.length];
      m.drop(cx + (rng() - .5) * 8, cy + (rng() - .5) * 8, r, col);
      r *= 0.55;
    }
  }
}
/* the marbler's row ground: ~40 big stones thrown in same-colour rows —
   drop displacement squeezes each row into a horizontal band of colour */
function rowGround(m, rng){
  const rows = 7, cols = 8;
  const rowCol = ['#2c3a5e', '#6e2b25', '#b98a33', '#241f1a', '#6e2b25', '#2e4a3d', '#b98a33'];
  for (let j = 0; j < rows; j++){
    const cy = 160 + j * 85;           // rows drift upward as later rows push in
    for (let i = 0; i < cols; i++){
      const cx = -60 + (i + .5 + (j % 2) * .5) * (1120 / cols) + (rng() - .5) * 16;   // brick-lay covers the coin-gap pockets
      m.drop(cx, cy + (rng() - .5) * 14, 68 + rng() * 9, rowCol[j % rowCol.length]);
    }
  }
}
/* depth of a comb's scallop = u·(1 − z/(z + s/2)) — keep depth ≈ 1–2 × spacing */
const combNonpareil = m => m.comb(0, 0, 0, 1, 22, 80, 5);
const combGelGit = m => {
  m.comb(0, 0, 0, 1, 92, 90, 34);
  m.comb(46, 0, 0, -1, 92, 90, 34);
};
const combFeather = m => {
  m.comb(6, 0, 0, 1, 22, 80, 5);
  m.comb(0, 0, 0, -1, 84, 130, 14);
};
/* deterministic opening pattern for ?pattern=nonpareil (seeded, ~40 drops) */
function presetNonpareil(m, seed = 0x70AB1E){
  const rng = mulberry32(seed);
  rowGround(m, rng);
  combNonpareil(m);
}

/* ————— main tank ————— */
const tank = document.getElementById('tank');
if (!tank) return;
const tctx = tank.getContext('2d');
const trayWrap = tank.parentElement;
const guide = document.getElementById('guide');
const guideLine = guide.querySelector('line');
const guideDot = guide.querySelector('circle');
const M = new Marbler();

let dirty = false, raf = 0;
function schedule(){
  dirty = true;
  if (!raf) raf = requestAnimationFrame(flush);
}
function flush(){
  raf = 0;
  if (document.hidden || !dirty) return;   // paused while tab hidden; resumes on visibilitychange
  dirty = false;
  M.renderTo(tctx, tank.width, tank.height);
}
document.addEventListener('visibilitychange', () => { if (!document.hidden && dirty) schedule(); });

function sizeTank(){
  const r = tank.getBoundingClientRect();
  if (r.width < 4) return;
  tank.width = Math.round(r.width * DPR());
  tank.height = Math.round(r.width * (LH / LW) * DPR());
  schedule();
}

/* ————— interaction ————— */
let mode = 'drop';
let inkColor = PAL[0];
let dragging = null;
let pullCount = 0;

const toLogical = e => {
  const r = tank.getBoundingClientRect();
  return [ (e.clientX - r.left) / r.width * LW, (e.clientY - r.top) / r.height * LH ];
};
const updatePullBtn = () => {
  const b = document.getElementById('pull');
  if (b) b.disabled = M.drops.length === 0;
};

tank.classList.add('mode-drop');
tank.addEventListener('pointerdown', e => {
  if (e.button !== 0 && e.pointerType === 'mouse') return;
  e.preventDefault();
  const [x, y] = toLogical(e);
  if (mode === 'drop'){
    M.drop(x, y, 20 + Math.random() * 18, inkColor);
    schedule(); updatePullBtn();
  } else {
    dragging = { x0: x, y0: y, x1: x, y1: y };
    tank.setPointerCapture(e.pointerId);
    guideDot.setAttribute('cx', x); guideDot.setAttribute('cy', y);
    drawGuide();
    guide.classList.add('on');
  }
});
tank.addEventListener('pointermove', e => {
  if (!dragging) return;
  const [x, y] = toLogical(e);
  dragging.x1 = x; dragging.y1 = y;
  drawGuide();
});
const endDrag = apply => e => {
  if (!dragging) return;
  const { x0, y0, x1, y1 } = dragging;
  dragging = null;
  guide.classList.remove('on');
  if (!apply) return;
  const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy);
  if (len > 10){
    M.tine(x0, y0, dx, dy, Math.min(len * 0.85, 480), 42);
    schedule();
  }
};
tank.addEventListener('pointerup', endDrag(true));
tank.addEventListener('pointercancel', endDrag(false));
function drawGuide(){
  guideLine.setAttribute('x1', dragging.x0); guideLine.setAttribute('y1', dragging.y0);
  guideLine.setAttribute('x2', dragging.x1); guideLine.setAttribute('y2', dragging.y1);
}

/* mode toggle */
for (const btn of document.querySelectorAll('[data-mode]')){
  btn.addEventListener('click', () => {
    mode = btn.dataset.mode;
    for (const b of document.querySelectorAll('[data-mode]')) b.setAttribute('aria-pressed', String(b === btn));
    tank.classList.toggle('mode-drop', mode === 'drop');
  });
}
/* ink palette */
for (const sw of document.querySelectorAll('.swatch')){
  sw.addEventListener('click', () => {
    inkColor = sw.dataset.color;
    for (const s of document.querySelectorAll('.swatch')) s.setAttribute('aria-pressed', String(s === sw));
  });
}
/* pattern bench */
const act = {
  stone(){ stoneShower(M, Math.random, 9, { gall: 0.35 }); },
  nonpareil(){ combNonpareil(M); },
  gelgit(){ combGelGit(M); },
  feather(){ combFeather(M); },
  clear(){ M.clear(); },
};
for (const btn of document.querySelectorAll('[data-act]')){
  btn.addEventListener('click', () => { act[btn.dataset.act](); schedule(); updatePullBtn(); });
}

/* ————— pull the sheet ————— */
const pullsEl = document.getElementById('pulls');
const pullsEmpty = document.getElementById('pulls-empty');

function pullSheet(){
  if (!M.drops.length) return;
  const snap = document.createElement('canvas');
  snap.width = LW; snap.height = LH;
  M.renderTo(snap.getContext('2d'), LW, LH);
  const url = snap.toDataURL('image/png');
  M.clear();
  schedule(); updatePullBtn();
  addPull(url);
  if (!REDUCED) liftSheet(url);
}
function liftSheet(url){
  const sheet = document.createElement('div');
  sheet.className = 'sheet';
  const img = new Image();
  img.src = url; img.alt = '';
  sheet.appendChild(img);
  trayWrap.appendChild(sheet);
  sheet.animate([
    { transform: 'translateY(0) rotate(0deg) scale(1)', opacity: 1, offset: 0 },
    { transform: 'translateY(-4%) rotate(-1deg) scale(1.005)', opacity: 1, offset: 0.4 },
    { transform: 'translateY(-40%) rotate(-3.5deg) scale(.86)', opacity: 0, offset: 1 },
  ], { duration: 1350, easing: 'cubic-bezier(.3,.65,.2,1)', fill: 'forwards' })
  .finished.then(() => sheet.remove()).catch(() => sheet.remove());
}
function addPull(url){
  pullCount++;
  if (pullsEmpty) pullsEmpty.style.display = 'none';
  const fig = document.createElement('figure');
  fig.className = 'pull';
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  fig.innerHTML = `<div class="pull-mat"><img alt="Marbled sheet, pull number ${pullCount}"></div>
    <figcaption>Pull № ${pullCount} — ${hh}:${mm} · 48 × 66</figcaption>`;
  fig.querySelector('img').src = url;
  pullsEl.prepend(fig);
  while (pullsEl.querySelectorAll('.pull').length > 3) pullsEl.querySelector('.pull:last-of-type').remove();
  requestAnimationFrame(() => requestAnimationFrame(() => fig.classList.add('in')));
}
document.getElementById('pull')?.addEventListener('click', pullSheet);

/* ————— product-card sims (deterministic) ————— */
const cardDraws = [];
function card(id, build){
  const cv = document.getElementById(id);
  if (!cv) return;
  const m = new Marbler();
  build(m);
  const draw = () => {
    const r = cv.getBoundingClientRect();
    if (r.width < 4) return;
    cv.width = Math.round(r.width * DPR());
    cv.height = Math.round(r.width * (LH / LW) * DPR());
    m.renderTo(cv.getContext('2d'), cv.width, cv.height);
  };
  cardDraws.push(draw);
  draw();
}

/* ————— boot ————— */
const q = new URLSearchParams(location.search);
if (q.get('pattern') === 'nonpareil') presetNonpareil(M);
else {
  // the bath opens dressed: eight stones on an even jittered grid
  const rng = mulberry32(0xD0E5);
  for (let j = 0; j < 2; j++) for (let i = 0; i < 4; i++){
    const cx = 145 + i * 236 + (rng() - .5) * 120;
    const cy = 165 + j * 360 + (rng() - .5) * 120;
    const base = Math.floor(rng() * PAL.length);
    const rings = 2 + (rng() < .6 ? 1 : 0);
    let r = 62 + rng() * 26;
    for (let k = 0; k < rings; k++){
      const col = (k === rings - 1 && rng() < .45) ? BATH : PAL[(base + k * 2) % PAL.length];
      M.drop(cx, cy, r, col);
      r *= 0.58;
    }
  }
}

sizeTank();
updatePullBtn();

card('card-stone', m => {
  stoneShower(m, mulberry32(0xA11CE), 15, { gall: 0.45 });
});
card('card-nonpareil', m => presetNonpareil(m, 0xB0B171));
card('card-feather', m => {
  const rng = mulberry32(0xFEA7);
  rowGround(m, rng);
  combFeather(m);
});

let rT = 0;
window.addEventListener('resize', () => {
  clearTimeout(rT);
  rT = setTimeout(() => { sizeTank(); for (const d of cardDraws) d(); }, 150);
});

/* ————— reveals ————— */
const io = new IntersectionObserver(es => {
  for (const en of es) if (en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }
}, { threshold: 0.12 });
for (const el of document.querySelectorAll('.rv')) io.observe(el);

})();
