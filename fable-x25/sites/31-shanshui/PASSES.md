# 31-shanshui — 山水 · SHAN SHUI · iteration passes

An infinite, procedurally **painted** Chinese ink-wash handscroll (手卷). Every mountain, mist
bank, pine, pavilion, boat, bird, waterfall, seal and the silk grain itself is drawn in canvas
code — no photographs, no image assets. The scene is a function of a horizontal world coordinate
built from seeded 1-D value-noise + fbm, so it unrolls forever, never repeats, and any position is
reproducible via `?x=N`.

Served over local HTTP (`python3 -m http.server 8906`). Screenshots at 1440×900 and 390×844,
waitMs 3500–4500. Every shot in every pass reported `NO_CONSOLE_ERRORS` at both widths.

## Architecture notes (for reproducibility)

- **Chunked painting**: the world is cached in 1000px chunks, each painted once onto an offscreen
  canvas and blitted per frame — the rAF loop only does `drawImage`, so drift stays cheap.
- **Seamless generation**: ridgelines are continuous global noise functions (identical across chunk
  borders); discrete elements are placed by deterministic cell-hash and painted into *every* chunk
  they overlap. Chunks are rendered with a 54px **overpaint margin** and only their centres are
  blitted, so shadow-blur haloes and edge elements never clip at a seam.
- DPR capped at 2; rAF cancelled on `visibilitychange`; `?x=N` jumps + pauses drift;
  `prefers-reduced-motion` → a single static painted vista, drift off (still scrub-able).

## Pass 1 — `31-p1-open/mid/far/mobile.png`

Found:
1. **Vertical seams** at every chunk boundary — the ink-bleed shadow-blur on ridgelines was being
   clipped at the offscreen-chunk edge, leaving a faint pale line top-to-bottom.
2. **Waterfall rendered as a stark floating white bar** in the water/mist zone (worst offender) —
   read as a glitch, not water.
3. **Cùn (皴) texture strokes read as scattered scratches / rain** floating over the mist rather
   than as rock modelling — too long, too opaque, too spread out.
4. Colophon gloss (pinyin + English) dropped into the bottom-right corner and **collided with the
   controls** (a `writing-mode` + `margin-top:auto` interaction).
5. Painted latin subtitle clipped at the top; colophon/title cramped and colliding on mobile.

Changed: introduced margin-overpaint chunk rendering (seams gone); redesigned the waterfall as a
narrow bright cleft framed by dark rock walls, length-clamped to stay on the mountain face and fade
before the water; tightened cùn strokes (fewer, fainter, clustered near the crest, angled to the
local slope); rebuilt the colophon as a flex column (vertical couplet above, right-aligned gloss
below, clear of the controls); repositioned the latin subtitle to read downward beside the column.

## Pass 2 — `31-p2-open/far/mobile.png`, `31-p2-survey-{0,1500,4500,8200,11500}.png`, `31-p2-mobile0.png`

Found:
1. Auto-drift advances during the 4.5s screenshot wait, so the **landing title slid off** within
   seconds (and beauty shots must be taken paused via `?x=0`). Real UX problem, not just a shot
   artifact — the title needs to linger on load.
2. Ranges read as gentle misty hills — **not enough vertical drama** for "a thousand li of
   mountains".
3. In the opening, a periodic scene-**seal collided with the colophon** couplet.
4. Latin subtitle sat *behind* the 山水 strokes, nearly illegible.
5. Pines looked like **telephone poles** (tall straight trunk + two horizontal branches).

Changed: added a ~2.9s intro **hold** then an eased-in drift (cancelled on first interaction), so the
title breathes on load; raised the mid-range amplitude/sharpness and strengthened the rare
"dominant summit" term (surveys now yield real 主峰 peaks rising from mist — see `survey-4500`);
suppressed periodic seals in the opening world region (`x < 1650`); moved the latin subtitle clear
to the right of the column; rebuilt pines with a rounded dry-brush crown and drooping branch
strokes.

## Pass 3 — `31-p3-open/peak/essay/essay2/footer/reduced-motion/x15000/x23000/final-*.png`

Found:
1. Desktop essay: the 臥遊 card heading **stacked its two hanzi vertically** while the other two
   cards stayed horizontal — the long pinyin was squeezing the flex item to min-content width.
2. Everything else verified clean: opening title + downward latin subtitle + name seal + colophon
   compose correctly (`p3-open`); a strong misty peak with boat + pavilion at `x=4500`; the
   bilingual essay (留白 / 手卷 / 臥遊 + couplet) and footer are elegantly typeset; far positions
   (`x=15000`, `x=23000` → 行 44 里) show fresh peaks, a stamped 山水 seal, boats and trees with
   **no seams, no repetition, no artifacts**.
3. `prefers-reduced-motion` (emulated) → a single composed static vista, drift off, `行 0 里`,
   zero console errors — confirmed.

Changed: made the card CN glyph `white-space:nowrap; flex:0 0 auto` and let the pinyin wrap (all
three headings now consistent); set the play button to its drift-off icon under reduced motion.
No defects remained; `NO_CONSOLE_ERRORS` at 1440×900 and 390×844 on every final shot.
