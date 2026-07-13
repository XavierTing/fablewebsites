# EPHEMERA — Iteration Passes (site 20-generative)

A generative-art gallery: a seeded mulberry32 PRNG drives four from-scratch algorithms
(FLOW curl-noise streamlines, LATTICE golden-ratio subdivision, STRATA layered sediment,
BLOOM radial botanical growth), each drawn progressively onto a framed canvas plinth with a
museum placard (seeded title, edition hash, palette name). Global NEW VISIT reseed, per-piece
Redraw + Save-PNG, and `?seed=HEX` reproduction.

**Verification method.** The four canvases render lazily via IntersectionObserver, so the stock
`shot.mjs` (viewport-only, no scroll) captures blank rooms below the fold. For evaluation I used a
full-page variant (`assets-pipeline/fullshot.mjs`) that dwells at each viewport step to reliably
trigger every lazy render, then captures `fullPage`. Deliverable screenshots for TWO seeds at
1440×900 plus one mobile 390×844 are in `passes/`. Every capture reported `NO_CONSOLE_ERRORS`.
Seeds used to prove variety: `?seed=A3F29C41` (seedA) and `?seed=5E1B0079` (seedB); additional
random seeds `00FF1234` and `DEADBEEF` used as stress tests for the "gallery-worthy for ANY seed"
guarantee.

Served over local HTTP (`python3 -m http.server 8020`) so `history.replaceState`/clipboard behave.

---

## Pass 1 — baseline audit (seedA, seedB @ 1440; mobile @ 390)

**Found**
- Layout, typography, frames, placards, hero, process section and footer all read as a genuine
  museum wall: gallery-white ground, layered frame shadows, elegant italic-serif placard titles
  with gold algorithm labels, palette chips, edition hash. Mobile stacks art-over-placard cleanly.
  Zero console errors at both widths. FLOW and LATTICE are outstanding at any seed.
- **Problem:** STRATA under the bold **Bauhaus Muted** palette produced near-JET-BLACK bands
  abutting bright cadmium/brick — a "circus textile" read rather than refined sediment. This risks
  the brief's "palettes always harmonious / no ugly compositions" guardrail.

**Changed**
- Reworked STRATA band shading so sediment reads chalky and sun-faded: lift every band's lightness
  (no band ever goes jet-black; darkest now reads as charcoal shale/basalt seam) and pull
  saturation back a touch, so even bold palettes stay harmonious. r() call-count preserved, so seed
  reproduction stays deterministic on this version.

## Pass 2 — verify strata fix + stress unseen seeds

**Found**
- STRATA fix confirmed: brick reds → muted clay/terracotta, darkest bands now charcoal (plausible
  coal/basalt seams). Desert-varnish strata even softer and more elegant. Harmonious across palettes.
- Stress-tested two unseen random seeds (`00FF1234`, `DEADBEEF`). Three pieces flawless, but
  **seed `00FF1234` exposed a SPARSE BLOOM** — the base branch motif terminated early, leaving a
  large empty band inside the guide circle. Thin/underpowered vs. the frame; violates "densities
  clamped so bad compositions are impossible."

**Changed**
- Raised BLOOM density floor so the bloom always fills its circle: minimum recursion depth 4→5
  (5 or 6), higher secondary/tertiary branch probabilities, and guaranteed THREE fanned primary
  stems (was one guaranteed + one optional) so every symmetry sector is populated. Pulled the
  composition radius outward (`R = W/2-140 → W/2-118`) and tightened the guide ring to shrink the
  empty margin. The existing 230-segment cap still prevents overcrowding at high symmetry.

## Pass 3 — final verification (deliverable shots)

**Found**
- Previously-sparse `00FF1234` bloom is now a full, richly branched mandala filling the circle;
  `DEADBEEF` bloom (Bauhaus) is an ornate rose-window without overcrowding — center medallion stays
  legible. All four algorithms gallery-worthy across all four tested seeds; palettes harmonious.
- Re-verified: `prefers-reduced-motion` renders every piece's FINAL state instantly (generators run
  to completion, no progressive animation; reveals shown, nothing stuck at opacity 0). Favicon
  present (inline SVG ❋ data-URI), `FABLE ×25` back-link → `/` present and styled. Zero console
  errors at 1440×900 and 390×844.
- No further defects found.

**Changed**
- Nothing — pass 3 was clean. Captured final `20-p3-*` deliverable screenshots.

---

### Screenshots (in `passes/`)
- `20-p1-seedA.png`, `20-p1-seedB.png`, `20-p1-mobile.png`
- `20-p2-seedA.png`, `20-p2-seedB.png`, `20-p2-mobile.png`
- `20-p3-seedA.png`, `20-p3-seedB.png`, `20-p3-mobile.png`

### Fonts
Display/placards: **Cormorant** (italic serif). UI/labels/body: **Archivo** (sans, wide-tracked caps).
