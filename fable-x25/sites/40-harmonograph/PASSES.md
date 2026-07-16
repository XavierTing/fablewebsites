# 40-harmonograph — HARMONOGRAPH · iteration passes

**Concept:** *HARMONOGRAPH — a Victorian drawing machine.* A simulated pendulum
harmonograph. Both axes are the sum of two decaying sinusoids (lateral + rotary
pendulums):

```
x(t) = A1·sin(f1·t+φ1)·e^(−δ1·t) + A2·sin(f2·t)·e^(−δ2·t)
y(t) = A3·sin(f3·t+φ2)·e^(−δ3·t) + A4·sin(f4·t)·e^(−δ4·t)
```

The pen path is one continuous fine ink line traced live over ~18s on aged cream
paper (#efe8d6). A tiny detune between each carrier and its companion (f2≈f1,
f4≈f3) makes the rosette slowly precess into the classic drifting web; the e^(−δt)
envelope decays so the figure spirals inward to near-stillness. Controls are brass
rotary dials — four frequencies, two phases, damping, pen weight — plus five ink
swatches (sepia / indigo / iron-gall / oxblood / verdigris) and **New plate**
(always-beautiful ratio), **Redraw**, **Save PNG**. The frequency ratio is shown
big and reduced (with `≈` when a dial is dragged off a whole ratio).

**Fonts:** Space Grotesk (display/body) + Space Mono (dial readouts, data).
Rendered on a **2D canvas**; served over local HTTP (`:8915`). Screenshots via
`shot.mjs`, `waitMs 6000`. `?seed=X` = deterministic plate (mulberry32);
`&done=1` = completed plate rendered instantly; `?scroll=0..1` for section shots.
DPR capped at 2; rAF pauses on `visibilitychange`; `prefers-reduced-motion` and
`&done=1` render a finished plate with no live draw. **Every shot in every pass
reported `NO_CONSOLE_ERRORS`**, and a headless interaction test (knob drag +
keyboard, swatch, New plate, Redraw, Save PNG, reduced-motion) reported
`ALL_CLEAN_NO_CONSOLE_ERRORS`.

## Pass 1 — `40-p1-plateA/plateB/mobile/math/minis/live/footer/mobileconsole`

Found (art-director critique):
1. **Critical bug:** the figure + paper only painted the top-left ~300×150 of the
   plate. Cause: `#plate` is a *replaced* element, and `position:absolute; inset;
   width:auto` used the canvas's **intrinsic 300×150 size** instead of filling the
   square — so everything drew into a 2:1 corner box.
2. Default plates were **too sparse / open** — thin Lissajous bands, not lush webs.
3. Hero didn't fit at 1440×900: the plate pushed the **brass console below the
   fold**, so the instrument's defining feature (the dials) wasn't visible.

Changed:
- Wrapped the canvases in a `.sheet{aspect-ratio:1}` and set them
  `inset:0; width:100%; height:100%` → the pen now fills the full square plate.
- Generator reworked for lush drifting webs: **detune ±0.04–0.08** (companion
  precesses ~1 turn over T), **T=150** with **low damping (δ 0.02–0.036)** →
  many oscillations before rest; N=30000 samples for a smooth continuous line.
- Tightened hero rhythm (plate `min(86vw,48vh,510px)`, centred column) so
  masthead + plate + caption + full console fit in one 900px view.

## Pass 2 — `40-p2-footer`, `40-p2-seed3/11/55/99/137`

Found:
1. Big win — figures now read as real harmonograph plates (winged rosettes,
   butterflies, spindles). Console shows all dials + swatches + New plate / Redraw
   / Save PNG on one brass row; mobile stacks them into a clean knob grid.
2. **Footer masthead overflowed** — the giant "Harmonograph" was clipped mid-letter
   (13vw was far too large at 1440).
3. **Over-inked centre knot** on dense, low-damping plates (worst on seed 11: a
   solid black bar) where the pen converged onto one point and retraced it.

Changed:
- Footer `.big` → `clamp(40px,8.4vw,116px)` — full word, contained.
- Added **per-pendulum friction variation (±11%)** so the four terms decay at
  slightly different rates and the pen rests *off* a single point (authentic).
- Added a **tail lift**: the pen path stops once the slowest envelope falls below
  `TAIL` of full swing (`Nend`), so the figure tightens to a clean small centre
  instead of a filled blob. Live draw + `renderFull` + pen-tip + resume all honour
  `Nend`.

## Pass 3 — `40-p3-plateA` (1:2 oxblood butterfly), `40-p3-plateB` (4:5 indigo web), `40-p3-mobile`, `40-p3-minis`

Refined & verified:
- Raised `TAIL` to 0.075 (trims the densest spindles a touch more) and lowered ink
  opacity to **0.38** so heavy crossings read as **deep sepia tone** rather than
  solid black — every plate now reads as *fine ink*, with delicate figures (3:2,
  1:2) staying crisp and lacy.
- **Desktop hero** (seed 3 / seed 55): masthead + big frequency ratio + framed
  plate with engraved double platemark, corner marks & caption (`PLATE No.40 —
  SEED 0003` · `AT REST`) + the full brass console. Two visually distinct plates
  (oxblood butterfly vs. indigo horizontal web) confirm the always-beautiful
  generator across colours and forms.
- **Mobile** (390×844): masthead stacks, ratio prominent, plate square and full,
  console becomes a tidy knob grid with all three action buttons reachable.
- **Math section**: `x(t)/y(t)` equation card in Space Mono + four static mini
  plates (2:3, 3:4, 4:5, 5:6) rendered by the same engine, lazy-drawn near the
  viewport. **History / quote / footer** all clean.
- **Live draw** (`40-p1-live`): confirmed the pen draws progressively with a brass
  pen-tip glow and a `DRAWING · NN%` status; settles to `AT REST`.
- **Interaction + reduced-motion** headless test: all controls fire without errors;
  reduced-motion shows a finished plate instantly (no live draw). Zero console
  errors at both widths throughout. OG image (`assets/og.jpg`, 1200×630) rendered
  from a live plate.
