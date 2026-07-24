# THOCK — iteration passes

A boutique mechanical-keyboard shop whose product page IS the product: a full 75%
board (85 keys + push-to-mute rotary knob) rendered in layered-shadow CSS 3D on a
64-track grid (0.25u resolution — 1u/1.25u/1.5u/1.75u/2u/2.25u/6.25u widths all
exact). It answers real `keydown`/`keyup` via `event.code` AND pointer taps; every
press plays a **synthesized** switch sound — no audio files. Three voices built
from a shared noise buffer + BiquadFilters + gain envelopes:

- **Coast (linear)** — 112 Hz low-passed body burst + 96 Hz sine resonance + soft 850 Hz cap contact
- **Ridge (tactile)** — 1.5 kHz band-passed tick, then the low body 16 ms later
- **Ratchet (clicky)** — 4.2 kHz Q6 band-passed snap + 4.3 kHz triangle ping + body, plus a click-bar reset tick on key-up

Per-press random pitch/level variance + random noise-buffer offset; keys ≥ 2u get a
delayed stabiliser rattle; wide-key/top-out ticks on release; DynamicsCompressor on
the master bus. AudioContext is created/resumed **only inside gesture handlers**
(keydown/pointerdown/click). Typing strip computes WPM as (correct chars ÷ 5) ÷
minutes, pauses its clock while the tab is hidden. `?colorway=tang&typed=1`
pre-fills the strip mid-sentence at 92 wpm for og shots; `?switch=` also supported.
No rAF loops anywhere (all motion is CSS transitions), no canvas (DPR cap n/a);
reveals are IntersectionObserver-driven and fully disabled under
`prefers-reduced-motion` (key travel drops to 1px, decorative motion off).

Served over `http://localhost:8969`; shots via shot.mjs at 1440×900 and 390×844,
waitMs 4500. **Every screenshot in all three passes reported NO_CONSOLE_ERRORS.**

---

## Pass 1 — build + first full audit

**Captured:** desktop hero, mobile hero+board, `?colorway=tang&typed=1`,
mid-scroll switches / specs / buy.

**Found:**
- Hero at 1440 had a dead zone right of the wordmark — composition tipped left.
- Ratchet's riff button ("hear five strokes") wrapped to two lines: `.sw-foot`
  min-content (176 px button + "fit ratchet") exceeded the 294 px card interior.
- Spec sheet (max-width 760) left the right half of a 1440 viewport empty.
- Typing HUD read "100 acc%" — label order was awkward.
- Board itself (milk + tang) held up: strict grid, correct widths, F-row gap +
  nav column reading like a real Q1-style 75%, knob/Esc/Enter accents working.

**Changed:** queued the four items for pass 2.

## Pass 2 — composition fixes + two real bugs

**Changed:** right-aligned mono spec ladder (`.hero-meta`) now balances the hero;
riff buttons shortened to "▶ hear it ×5" + `white-space:nowrap`; spec sheet is a
true two-column grid (6 + 6 rows); HUD reads "92 wpm · 100% acc".

**Found (bug 1):** mobile horizontal overflow — probe showed `scrollWidth 414 vs
390`, caused by `.cw-card` min-content (5 mini keycaps + padding = 188 px) blowing
out the 2-col colorway grid; Terminal/Tang cards were clipped at the right edge.
**Fixed:** `min-width:0` on cards + single-column colorway grid ≤ 640 px.

**Found (bug 2, code review):** pointer presses could stick — release was listened
on `matrix` via `pointerleave`, which doesn't bubble, so dragging off a cap left it
depressed forever. **Fixed:** active-key ref released on document-level
`pointerup`/`pointercancel`.

Also chased a suspected "orange sliver" artifact at the mobile left edge — pixel
zoom proved it was just the chip's own rounded end at thumbnail scale; no bug.

## Pass 3 — instrumented interaction probe + AA/focus polish

**Probe (Puppeteer, real input):** typed 24 chars into the strip → value tracked,
24/24 chars marked correct, WPM 160 (math verified: 4.8 words ÷ 1.8 s), acc 100;
`KeyH` held → cap `.down`, released → cleared; knob toggles `aria-pressed` and
mute both ways; ratchet riff runs clean; switch/colorway selectors update
`data-sw`/`data-cw`, captions and "fitted" pills; notify form → "noted ✓" with no
network; **Space with the board in view does not scroll the page** (y 700 → 700)
while still allowed elsewhere. Zero console/page errors throughout.

**Found + fixed (visual audit):**
- Tang page accent #c74812 measured ~4.1:1 on paper — darkened to #b23f0e (≈4.9:1);
  all four accents now clear AA for the small mono labels they color.
- Global `:focus-visible` rule forced `border-radius:4px`, which would deform the
  circular swatch buttons when keyboard-focused — radius override removed.
- Colorway swaps snapped instantly on the caps — added a 350 ms background/color
  cross-fade on cap faces (press transform stays at 70 ms).
- Re-verified: two-column spec sheet now bottoms out flush (knob line shortened),
  mobile colorways single-column with Pool's selected state visible, pool/terminal
  full-board shots (legends, homing bars, case badge, ground shadow) all clean.

Final state: desktop + mobile + og-param screenshots all composed, zero console
errors at both widths.
