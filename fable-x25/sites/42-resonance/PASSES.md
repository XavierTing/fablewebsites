# 42-resonance — RESONANCE · iteration passes

**Concept:** *RESONANCE — music you can see.* A generative audio-reactive
visualiser. A lush, slowly-evolving ambient piece is synthesised **live in the
browser** with WebAudio (no audio files): detuned pad drone through a slow LFO
low-pass, a gentle random-walk arpeggio, filtered-noise "air", a sub pulse on a
tremolo LFO, plus a drifting chord-colour voice. An `AnalyserNode` (FFT 2048)
taps the master bus and drives **one cohesive visual system** — a centred radial
"bloom": a bass-breathing core, two mirrored spectrum petals plotted in polar
space, a field of luminous motes lit by the highs, and echo rings that pulse on
beats. Four moods (Dusk / Rain / Aurora / Ember) re-tune key, tempo, timbre and
palette together. Play/pause, volume, mood selector and a mic-input toggle in a
glass dock; a now-playing readout with a generated track name, elapsed time and
live LOW/MID/AIR meters.

Served over local HTTP (`python3 -m http.server 8917`). Screenshots via
`shot.mjs` at 1440×900 and 390×844, `waitMs` ~4200. A `?demo=1` mode skips the
gesture veil and drives the visuals from a synthetic animated FFT so the bloom
looks alive in a static headless shot; `?mood=` and `?scroll=` were added to
capture moods and content sections. **Every shot in every pass reported
`NO_CONSOLE_ERRORS`.** DPR capped at 2; rAF pauses on `visibilitychange`;
`prefers-reduced-motion` renders one calm static bloom and does not auto-start
or audio-drive.

## Pass 1 — `42-p1-desktop.png`, `42-p1-mobile.png`

Found (art-director critique):
1. **Desktop bloom lopsided** — the two overlaid spectrum blooms rotated in
   opposite directions, tearing a big off-centre lobe on the right; the petal
   edge read a little spiky.
2. **Meters looked dead** — LOW/MID/AIR flat. The demo bass pulse dipped to the
   floor at the ~4s capture instant, so bands read near zero.
3. **Mobile collisions** — the "RESONANCE · live" wordmark overlapped the
   top-right NOW PLAYING panel, and the fixed back-link overlapped the wrapped
   control dock at the bottom.

Changed:
- Both blooms now rotate the **same direction** with a small phase offset →
  concentric doubled outline instead of a lopsided lobe. Widened petal smoothing
  to a **5-tap** average for a graceful edge.
- Raised the demo synth bass baseline (0.72 + 0.28·sin) so the visual and meters
  always read alive off the floor.
- Mobile: **hid the wordmark**, moved the back-link to top-left (clear of the
  HUD), let the dock own the bottom row.

## Pass 2 — `42-p2-desktop/mobile/aurora/ember/content.png`

Found:
1. **Meters still rendered empty** despite a DOM probe reporting fill widths of
   ~53–63%. Investigated with `getBoundingClientRect`: the `.fill` element was a
   **0×0 box**. Root cause — `.fill` is a `<span>` (inline), so `width`/`height`
   were ignored and it never had a box to paint.
2. **Fixed hero chrome overlaid the content** — scrolling into section 01, the
   heading collided with the wordmark / HUD / dock.
3. Confirmed all four moods re-palette and re-tune cleanly (Aurora, Ember shots).

Changed:
- `display:block` on `.fill` (plus 4px height and a soft glow) — meters now read
  as live LOW/MID/AIR bars. Verified by probe: 59% / 73% / 29%.
- Added a `body.scrolled` state that **fades the brand, HUD, dock and cue** once
  you scroll past ~55% of the first viewport, so the content sections read clean;
  they return near the bloom.
- Added `?mood=` and `?scroll=` query hooks for deterministic screenshots.

## Pass 3 — `42-p3-desktop/mobile/rain/content/content-mobile/footer.png`

Found:
1. In the footer, the fixed bottom-left back-link pill **covered the footer's
   own meta line** ("RESONANCE · a generative visualiser").
2. On mobile the top-left back-link overlapped body copy while scrolling.
3. Otherwise composition, hierarchy, colour harmony and legibility held up across
   Dusk/Rain/Aurora/Ember at both widths.

Changed:
- `IntersectionObserver` on the footer toggles `body.at-footer` → the floating
  pill fades out (the footer carries its own "← XAVIER FABLE ×50" link).
- Mobile: the floating back-link also fades under `body.scrolled` (still present
  at the hero and in the footer).

Also verified beyond screenshots (headless Puppeteer, 0 console errors):
- **Reduced-motion, no demo** → veil stays up, canvas shows a calm static lit
  bloom, no AudioContext auto-created.
- **Real audio path** → clicking *Press to begin* builds the full WebAudio graph
  without error; elapsed clock runs; switching Dusk→Ember→Aurora and pause/play
  all work cleanly.

**Result:** a cinematic planetarium sound-bath — genuinely audio-reactive,
cohesive across four moods, zero console errors at 1440×900 and 390×844.
