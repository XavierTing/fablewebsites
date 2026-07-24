# 68-metro — critique passes

Screenshot tool: assets-pipeline/shot.mjs (captures console errors). All shots in `passes/`.

## Pass 1 — first full render (68-pass1-*.png)

**Verified working:** map geometry clean at 1440 (all 45°/90° segments, no kinks; parallel
C/E corridor evenly spaced at 16px centrelines; no label/line collisions found); trains
running with dwell behaviour; split-flap board legible with line-coloured letters and
DUE/BOARDING/ON TIME statuses; `?state=rush` densifies traffic and sets 17:42; zero console
errors at 1440×900 and 390×844. **Sim selftest: 7 pass / 0 fail** — for four
tooltip cases (A both directions, K at Halvorsen, E terminus departure at Meridian) and the
first three board rows, a train is provably AT the stop one sim-second before the promised
departure time (timetable = single source of truth for map, tooltip and board).

**Found (merciless read):**
1. Mobile map labels effectively ~10px — too small to read comfortably; pannable inner
   width 980px is too tight for a 1470-unit viewBox.
2. Desktop hero: the "Hover any station…" hint nearly touches the fixed XAVIER FABLE chip.
3. Trains (r 6.5) read slightly small against 10px-thick route lines; the dark dot can be
   mistaken for a station dot at a glance.
4. Mobile board: destination column clips mid-cell ("HARBOR BASI…") inside the frame —
   scrollable but looks accidental; platform column invisible anyway at 390.
5. `nextDeps` had a leftover no-op branch (code hygiene).
6. Board header column widths hardcode the 3px cell gap — breaks alignment if the gap
   changes responsively.

**Fixes for pass 2:** mobile map inner width → 1240px; rail bottom padding; trains r 7.5
with thicker halo + bigger colour pip; mobile board hides PL column and tightens cell
gap via a `--cg` var (header widths now derive from it) so all 18 visible cells fit 390
exactly; code cleanup.

## Pass 2 — DOM-level verification, two real bugs found (68-pass2*.png)

Reshot all states; also probed the live board DOM with puppeteer (read every flap cell's
static char + animation state at t=9s/12.5s/15s/19s) instead of trusting pixels.

**Found:**
1. **Mobile map still shrank to viewport width** despite `width: 1240px` — `.map-scroll`
   is a flex container, so `.map-inner` (flex item) was being flex-shrunk. Fixed with
   `flex: none`. Map is now a properly pannable 1240px panel centred on Meridian
   Exchange, labels ~12.7px and crisp (68-pass2b-390map.png).
2. **Split-flap state-machine bug (real, deterministic):** when a cell was retargeted
   while a previous spin was still queued behind its stagger delay, and the new target
   equalled the *currently shown* char, `set()` returned on `dist === 0` leaving the stale
   queue draining toward the old target — cells settled permanently wrong ("HALVOR EN",
   stray trailing "N" on shifted rows; visible in the DOM probe as settled-but-wrong
   cells). Fix: every retarget cancels the pending queue first. Re-probe: all six rows
   settle letter-perfect between cascades; cascades only run during genuine departures.
3. **Pan hint never appeared** — the programmatic `scrollLeft` centring fired a scroll
   event that consumed the `once:true` dismiss listener before paint. Dismiss handlers now
   arm 900ms after load.
4. Desktop hint/back-chip crowding resolved by pass-1 fix (confirmed); board columns
   align at both widths; rush state at 17:45 shows ~2× train density (68-pass2-rush.png).

**For pass 3:** full re-verify of every state + departures-vs-map logic check via
`?selftest=1`, footer + lines tail at both widths, mid-scroll shots.

## Pass 3 — full re-verification (68-pass3-*.png)

Reshot every state after the pass-2 fixes:
- **1440×900 hero** (68-pass3-1440.png): composition settled — poster rail left, live
  diagram right, no label/line collisions, C/E parallel corridor even, water band grounds
  the harbor. Zero console errors.
- **390×844** (68-pass3-390.png, 68-pass3-390lines.png, 68-pass3-390footer.png): pannable
  1240px map centred on Meridian Exchange reads as deliberate; line strips scroll; footer
  stats reflow to 2-col. Zero console errors.
- **Rush + tooltip** (68-pass3-1440-rush.png, `?state=rush&poke=Cathedral`): ~2× density,
  clock at 17:45, Cathedral tooltip shows exactly two next departures per direction for
  B and K, read from the timetable the trains run on.
- **Departures logic** (68-pass3-selftest.png): selftest re-run in rush state —
  **7 pass / 0 fail** (a train is at the stop one sim-second before every promised
  tooltip/board departure).
- **Board settle**: DOM probe sampled at 15s showed all six rows letter-perfect
  ("FAIRHOLT / DUE", "HARBOR BASIN / ON TIME"…); a second sample caught a genuine
  departure cascade mid-flight — exactly the intended behaviour.
- Small finds fixed this pass: back-link pill was ink-on-ink over the dark footer (added
  a faint rim); footer given an anchor id. Generated `assets/68-og.png` from the 1200×630
  rush state.

**Requirement notes:** rAF loop is fully cancelled on `visibilitychange` (single loop
drives sim, trains, clock, board and flap scheduler, so everything pauses together);
frame delta clamped to 100ms; no canvas is used anywhere so the devicePixelRatio≤2 rule
is satisfied by construction (vector SVG throughout); reduced-motion serves a frozen sim
with trains parked at platforms, instant board text, no draw-in, no reveals.

**Verdict:** pass 3 found only the two cosmetic items above, both fixed and re-shot.
Ship it.
