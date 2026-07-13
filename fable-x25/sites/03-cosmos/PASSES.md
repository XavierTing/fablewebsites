# 03-cosmos — HELIOPAUSE — iteration passes

Screenshots live in `passes/` (naming: `03-p<pass>-<d|m><scroll>.png`, d = 1440×900, m = 390×844,
scroll suffix = `?p=` value with the dot dropped: 0 / 03 / 06 / 09).

> Note: a prior session did unlogged tuning (particle exposure/alpha, formation generators) and
> sketched — but only half-implemented — a mobile camera pull-back (`zBoost` was a weak 1.22).
> This log restarts the formal pass protocol from a verified baseline.

## Pass 1 — baseline audit (03-p1-*.png)

**Found (desktop):**
- Hero (`d0`): sun corona renders gorgeously, but the overline ("A SCROLL TO THE EDGE…") and the
  subtitle sit directly on the brightest particles — both marginal-to-unreadable. Hero scrim too weak.
- Inner Worlds (`d03`): orbit-ring formation is distinct and beautiful; body copy crosses two bright
  ring arcs and loses contrast. Also a faint "phantom rectangle" mid-frame — traced to the stroked
  numeral "02" (Unbounded's flat-bottomed "2" reads as a UI box fragment where rings back-light it).
- `d06` is a mid-morph state (belt→giant), intentionally amorphous — acceptable, revisit in pass 2.
- Heliopause (`d09`): bow-shock formation + violet palette excellent; text fully legible.
- Console: zero errors at both viewports, all four scroll positions.

**Found (mobile):**
- Hero (`m0`): FAIL. The corona floods the 390px frame; subtitle drowned in bright particles.
  The planned camera pull-back was never finished (zBoost 1.22 far too weak in portrait).
- Inner Worlds (`m03`): paragraph sits on bright ring arcs; mobile scrim too thin (.34/.66 alphas).
- `m09`: good, legible.

**Hard-requirement check:** favicon ✓ (inline SVG ☀️ data URI) · FABLE ×25 back-link → / ✓ ·
zero console errors ✓ · prefers-reduced-motion ✓ (COUNT drop to 24k, uTime frozen, cue anim off,
instant scroll) · rAF pauses on visibilitychange ✓ · DPR capped at 2 ✓.

**Fixed:**
- Mobile camera pull-back finished: `zBoost = 1.5 + 0.25·max(0, 1−curU)` for aspect < 0.8
  (hardest retreat at the sun, easing to 1.5× for later chapters).
- Hero scrim strengthened (.6→.78 core, wider ellipse) + layered text-shadows on overline/subtitle;
  subtitle color lifted to rgba(214,220,240,.78).
- Chapter scrim: desktop 100deg gradient .78/.5 → .86/.62; mobile vertical gradient .34/.66 → .5/.8.
- Numeral stroke alphas .14/.13/.16 → .10/.10/.13 so glyph fragments stop reading as artifacts.

## Pass 2 — verify + typography armour (03-p2-*.png)

**Found:**
- Hero fixed at both widths (`d0`, `m0`): subtitle and overline now clearly legible, corona still
  reads as a sun, mobile framing intentional after the pull-back. Zero console errors, all 8 shots.
- Inner Worlds (`d03`): scrim increase barely registers where white-hot ring arcs cross the copy —
  words like "circle close to" / "clouds at" still dip below comfortable contrast. More scrim would
  dull the artwork; the right tool is glyph-local text-shadow. Numeral "2" bar still faintly boxy.
- Mid-morph (`d06`/`m06`, belt→giant at u≈2.5): the transition reads as a uniform noise ball —
  least gorgeous state of the journey. Cause: low per-particle stagger (S=0.6) puts every particle
  mid-flight simultaneously, plus a large outward flourish (up to 0.83 units) that shreds structure.
- Heliopause (`d09`/`m09`): excellent at both widths, no action.

**Fixed:**
- Layered dark text-shadows on chapter h2 / p / .ch-meta / .data dd (and kept hero shadows) —
  copy now carries its own contrast instead of leaning on scrims.
- Morph restructured: stagger S 0.6 → 0.85 (at mid-morph ~40% of particles have already arrived,
  ~40% are still in the old formation — two structures coexist instead of mush) and flourish
  amplitude 0.18+0.65r → 0.10+0.38r.
- Chapter-2 numeral stroke .10 → .07 (bright rings back-light it more than any other chapter).

## Pass 3 — final verification (03-p3-*.png)

**Found:**
- Hero (`d0`/`m0`): title gradient, corona and subtitle all read cleanly; mobile framing intentional.
- Inner Worlds (`d03`/`m03`): copy legible at both widths (verified with a 1:1 crop of the worst
  ring-crossing lines); phantom numeral rectangle gone.
- Mid-morph (`d06`/`m06`): transformed — the gas-giant sphere now emerges as a defined orb with a
  bright rim inside the dissolving belt disc; reads as intentional choreography, not noise.
- Heliopause (`d09`/`m09`): bow shock + termination shock + faraway sun all distinct; violet
  palette shift on odometer/rail dot working.
- Zero console errors across all 8 shots. No further changes needed — pass closed clean.

**Final state:** five distinct formations (corona sun → orbit rings → asteroid belt → ringed giant
→ heliopause bow shock), one 92k-particle GPU field (34k mobile / 24k reduced-motion), scroll-driven
uU blend with per-particle stagger, AU odometer + tick rail HUD, ?p= deep-link for screenshots.
All hard requirements verified (favicon, FABLE ×25 back-link, zero console errors, reduced-motion
guards, rAF pause on hidden tab, DPR ≤ 2).
