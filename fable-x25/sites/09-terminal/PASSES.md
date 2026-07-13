# FABLE-DOS v5.0 — Iteration Passes

Site: `sites/09-terminal/` — "FABLE-DOS v5.0", a playable retro terminal OS
(boot sequence → working shell → fake filesystem, snake, matrix, themes).

Screenshots saved in `passes/` (`09-p{N}-*.png`). Each pass was verified with a
Puppeteer functional harness (`assets-pipeline/term-test-09.mjs`) that boots the
page, waits for the auto-typed `help`, then types real commands and dispatches
arrow keys before screenshotting at 1440×900 (desktop) and 390×844 (mobile):
`cat poems/dawn.txt`, an unknown command, `TAB` completion, `ArrowUp` history,
`theme amber`, `matrix` (canvas visible + exits on key), `snake` (grid renders +
responds to `ArrowUp` + quits on `q`), a reduced-motion boot probe, and a mobile
command-chip tap. All 14 checks PASS with **zero console errors** on every pass.

---

## Pass 1 — baseline critique + the box-glyph rendering bug

**Verified working:** boot pacing (help prompt ready ~4.6s after nav, well under
the 6s budget), reduced-motion boot near-instant (~0.99s), amber/green/paper
themes, matrix, snake steering, tab-completion, history, mobile chips (18), all
commands. Zero console errors. Bezel, phosphor glow, scanlines, vignette and
glass reflection all read convincingly.

**Found (merciless):**
- **Snake board showed a stray full-height vertical line** crossing both borders
  — a real rendering artifact (visible in `09-p1-snake.png`). Probing the grid's
  `textContent` proved the data was clean (every row exactly 30 chars, perfectly
  aligned), so the defect was purely visual/font.
- **Root cause:** the author deliberately routed all grid-shaped output (snake
  board + ASCII logo) to a box-drawing-safe mono stack via
  `.grid, .ascii-logo { font-family: Menlo… }` (specificity 0,1,0), *because
  VT323 has no box/block glyphs*. But `.term pre { font-family: inherit }`
  (specificity 0,1,1) **won the cascade**, so the grid actually rendered in
  VT323 → box/block chars fell back inconsistently → misaligned seam. The
  author's stated intent was silently defeated.

**Changed:**
- Raised the grid-font rule specificity to `.term pre.grid, .term pre.ascii-logo`
  (0,2,1) so it beats `.term pre`. Confirmed via computed style that the board now
  resolves to `Menlo, …` and the stray vertical line is **gone** — box borders and
  block cells render crisp and consistent.

---

## Pass 2 — composition + immersion polish

**Found:**
- **Snake board felt lost on desktop** — a 28×14 grid at ~15px sat in the upper-
  left ~30% of the 1440-wide "CRT", leaving a large dead zone. The game read as an
  afterthought rather than a centerpiece.
- **Matrix rain left the bottom third empty** — the seeding put ~half the columns
  above the screen (`Math.random()*-40`), so at any snapshot the lower screen was a
  dark void instead of full top-to-bottom rain (`09-p1-matrix.png`).

**Changed:**
- Made the snake board responsive: **32×16 default, 40×19 on ≥1200px**, mobile
  unchanged (21×13). Bumped `.grid` font from `clamp(11,1.15vw,15)` to
  `clamp(12,1.35vw,19)`. The board is now a substantial, crisp presence
  (`09-p2-snake.png`) while staying authentically left-aligned in the text flow.
- Reseeded matrix so **every column spans the full height** with a small
  above-screen lead (`Math.random()*rows*1.15 - rows*0.15`). Rain now fills the
  screen instantly with no dead zone (`09-p2-matrix.png`). devicePixelRatio still
  capped at 2; rAF still pauses on tab-hidden.
- Re-ran the harness: all 14 checks PASS, zero console errors, snake still steers
  (head row 11→7), boot still ~4.6s.

---

## Pass 3 — final verification

**Reviewed** every fresh shot (`09-p3-*`): boot (well-paced, glowing phosphor),
auto-typed `help` at prompt, `cat` a poem, unknown-command error, amber theme
(P3 amber phosphor, poem typography intact), enlarged snake board, full-height
matrix, and mobile at 390×844 with the two-row command-chip palette + `FABLE ×25`
back-link visible bottom-left.

**Verified hard requirements:**
- Favicon present (inline SVG data-URI `>_` — no 404 noise).
- `FABLE ×25` back-link → `/`, fixed, styled to the phosphor aesthetic.
- **Zero console errors** at both widths (harness, every pass).
- `prefers-reduced-motion`: flicker animation gated behind the media query;
  `sleep()` collapses to 0ms and boot/memory-count/matrix skip their delays under
  reduce — boot completes in ~0.99s.
- Responsive at 1440×900 and 390×844; no horizontal overflow; `::selection`,
  `:focus-visible`, and styled scrollbars all themed.

**Micro-nit checked, left as-is:** the slight glyph "doubling" on bright headers
(e.g. the `M` in `Memory Test`) is the intended `.bright` filter + phosphor
text-shadow on the VT323 pixel font — reads as authentic bloom, not a defect.

**Result:** no regressions, no new defects. 14/14 functional checks PASS, zero
console errors. Ship.
