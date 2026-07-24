# 聞香 MONKŌ — iteration passes

Concept: a fictional Kyoto incense house (est. 1704, ten generations). Centerpiece: a live
smoke simulation — an ordered ribbon of particles emitted at the ember tip, advected by the
2D curl of a time-evolving 3D value-noise field (laminar thread for the first ~90–110 px,
then folding curls), drawn as midpoint-quadratic stroked segments (soft halo pass + silk core
pass) plus a sprite-based haze layer for the wide dissolve. Click/tap adds a decaying radial
velocity impulse that bends the ribbon. Three burnable blends retint the smoke and swap the
scent line. `?lit=1` pre-warms 340 sim steps so the full ribbon is present on load;
reduced-motion pre-warms once and renders a single static plume (no rAF). DPR capped at 2,
rAF paused on `visibilitychange`.

Fonts: **Noto Serif JP** (display, Japanese) + **Zen Kaku Gothic New** (English body/UI).

Dev aids: `?lit=1` (pre-warm), `?blend=1|2` (preselect blend), `?rm=1` (force reduced-motion
path), `?y=<px>` (scroll jump for screenshots). Screenshots via assets-pipeline/shot.mjs,
waitMs 5000, 1440×900 + 390×844. Every shot: NO_CONSOLE_ERRORS.

---

## Pass 1 — first build, hostile critique
Screens: `67-p1-desktop-lit`, `67-p1-mobile-lit`.

Found:
- **Mobile broken composition (real bug):** stick/bowl cropped at the fold and the smoke
  ribbon rose straight through the title and blend buttons; hero content overflowed 100svh.
- **Ember read as a detached orange bokeh blob** ~40px wide, floating above the tip.
- **Smoke scratchy up top:** the core polyline persisted as a pencil-scribble instead of
  dissolving; haze nearly invisible; curls tight and vertical.
- **Holder looked like a cartoon pot** — stacked ellipse edges, heavy outline.

Changed: mobile hero-stage became absolute, stick anchored bottom-right at 150px so the smoke
column rises along the right edge clear of the copy; scent line max-width to keep it clear;
holder redrawn as a low, wide dish with softer strokes; ember marker aligned exactly to the
SVG tip (45.45% / 12.5%); ember glow tightened (r ≈ 4–6, halo 2.4r, lower alphas).

## Pass 2 — smoke physics failure on desktop
Screens: `67-p2-desktop-lit`, `67-p2-mobile-lit`, `67-p2-desktop-blends`,
`67-p2-desktop-ritual-house`.

Found:
- **Desktop sim FAILED the "silk-thread" bar:** curl velocity exceeded rise speed, so the
  ribbon folded onto itself into a dense J-shaped worm with a visible gap below it.
- Mobile, by contrast, already read as real smoke — so the fix had to be parametric, not
  structural.
- Sections solid; small-caps meta text (#8b857b on card cream) failed WCAG AA.

Changed: noise field now **advects upward with the plume** (sample at y + 55t — curls travel
up the ribbon instead of smoke sliding through a static field), broader features
(F1 0.0046→0.004), slower time evolution, curlAmp 37→28, sustained rise (riseSlow 66→46),
halo pass 2.7×→2.3×, width growth 9.5→7.5; `--ink-faint` darkened to #6e695f (≥4.8:1).

## Pass 3 — fold density and laminar length
Screens: `67-p3-desktop-lit`, `67-p3-mobile-lit`.

Found:
- Desktop much better — thread + S-curve + one curl — but the top still clumped into a heavy
  hook: haze sprites over-accumulated where the ribbon folded, and the laminar zone ran
  ~250px before any fold (brief wants folds to begin after ~80–110px).

Changed: haze alpha 0.088→0.05 with smaller max radius (44px) and later onset; core dissolve
retains ~20% alpha so folds stay legible as thin lines through the veil; laminar length
112→90 (mobile 76); curl growth begins at hr 120; second noise octave weight 0.5→0.65 for
finer folding; curlAmp trimmed to 26/24.

## Pass 4 — verification sweep of every state
Screens: `67-p4-desktop-lit`, `67-p4-mobile-lit`, `67-p4-desktop-reduced`,
`67-p4-desktop-baika`, `67-p4-mobile-blends`, `67-p4-mobile-foot`, `67-p4-desktop-foot`.

Found & verified:
- Desktop and mobile hero now read as laminar-to-turbulent incense smoke: tight thread at the
  ember, gentle sway, folding curl dissolving into a faint veil. PASSED the sim bar.
- Reduced-motion (`?rm=1`): full static plume rendered once, no animation — composed, not empty.
- Blend preselect (`?blend=2`): rosy-grey Baika tint, button state + scent line correct.
- Blends/ritual/house/footer composed at both widths; no horizontal overflow; zero console
  errors at every width and state.
- Added `?blend=` and `?rm=` aids during this pass; no visual regressions.

## Pass 5 — natural load check
Screen: `67-p5-desktop-natural` (no `?lit`, 6s wait).

- Cold-start growth looks intentional: after ~6s the thread has climbed the full hero with an
  S-fold beginning to dissolve. Ship state confirmed.
