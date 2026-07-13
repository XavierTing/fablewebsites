# RAW MATTER — iteration passes

## Pass 1 — 1440×900, 390×844, grid-on 1440, mid-scroll #feature

Found:
- **Masthead overflow (real bug).** "MATTER" rendered 1405.8px into a 1348px
  track and clipped at the viewport edge on BOTH widths; "RAW" was 23.6px over
  its 6-column track too. Root cause (measured in headless Chrome): the fit
  routine's letter-spacing fine-tune set `span.style.letterSpacing` to a tiny
  px value, which *overrode* the inherited −.035/−.038em display tracking that
  was active during measurement — the line then grew by n×tracking after fit
  (6 × .038em × 253px = 57.8px, exactly the overflow observed).
- Grid-on shot: every other edge sits on the 12-col overlay — RAW ends flush
  on col 6, issue box spans 7–12, marginalia 1–3, prose 4–9, pull col 10–12.
- "IMAGE WITHHELD" block draws only one diagonal; a censor block reads as an X
  (`::after` was scaffolded but `display:none`).
- Console: zero errors at both widths.

Fixed:
- Replaced the letter-spacing fine-tune with a second font-size refinement
  iteration (all metrics are em-based, so width scales linearly — no override
  of inherited tracking possible).
- Enabled the mirrored second diagonal on `.withheld::after` → proper X.
- Added `?grid=1` query param so grid-overlay state is screenshotable.

## Pass 2 — 1440×900, 390×844, grid-on 1440, mid-scroll #feature
Shots: `passes/06-p2-desktop.png`, `06-p2-grid.png`, `06-p2-mobile.png`, `06-p2-scroll.png`
plus a headless measurement audit (fit widths, edge coords, computed styles).

Found:
- **Masthead fit confirmed fixed**: RAW 664/664px, MATTER 1347.97/1348px —
  sub-pixel flush on both tracks; mobile 358/358 both lines.
- **Stamp broke the margin (real bug).** The rotated POURED QUARTERLY stamp's
  bounding box ended at 1398px vs the 1393.92px right margin (4px overhang;
  2.6px at 390w). Rotation corners poked past the one line everything else
  obeys — read as sloppy, not defiant.
- **Issue box right edge floated off-grid.** `.mastmeta` was a loose flexbox
  (`flex:1` + space-between), so the issue box ended at 1240.1px — mid
  column 11, on no boundary. The only unaligned edge on the page.
- Computed-style sweep: zero non-zero border-radius, zero transition-duration
  on any interactive element (hard cut verified), ticker 72.4px/s (2750px set
  / 38s) — comfortable read speed, kept.
- Reduced-motion emulation: ticker animation `none`, blink `none`, entrance
  cuts skipped (opacity rules live inside no-preference block). Correct.
- Console: zero errors at both widths and under reduced motion.

Fixed:
- `.mastmeta` flexbox → 6-track subgrid (repeat(6,1fr) + same gutter
  reproduces parent cols 7–12 exactly): issue box spans tracks 1–4, now ends
  flush on col 10 (1165.94 vs 1165.96 computed edge; col 8 at 390w).
- Stamp moved to tracks 5–6, `justify-self:end`, and `translateX(-5px)`
  BEFORE `rotate(-8deg)` (−4px at 390w) — rotated bbox now 1392.99, inside
  the margin at both widths.

## Pass 3 — 1440×900, 390×844, grid-on 1440, mid-scroll #feature, hover state
Shots: `passes/06-p3-desktop.png`, `06-p3-grid.png`, `06-p3-mobile.png`,
`06-p3-scroll.png`, `06-p3-hover.png` (row 02 under a real mouse hover).

Found:
- Grid-on: pass-2 fixes verified visually — issue box right edge sits exactly
  on the col-10 line, stamp lives in cols 11–12 inside the right margin.
  Every structural edge on the page lands on a column boundary; the stamp is
  now the only element that breaks the grid, and it does so on purpose.
- Hover shot: full-row inversion is a clean hard cut (computed
  transition-duration 0s everywhere), deck appears in cols 8–10 on the
  shared baseline, tag stays alarm-red on ink. Correct.
- Ticker pacing re-checked: 72.4px/s, hover-pause works, `aria-label` on the
  ticker — but the JS-cloned second `.set` duplicated all eight headlines
  for screen readers.
- `role="table"` on the issue box had no row/cell descendants — ARIA misuse.
- Final sweep: masthead still sub-pixel flush (664/664, 1347.97/1348;
  358/358 ×2 at 390w), scrollWidth == innerWidth at both widths (no
  overflow), zero non-zero border-radius, zero transitions, reduced-motion
  kills ticker + blink + entrance cuts, zero console errors in all runs.

Fixed:
- Cloned ticker set gets `aria-hidden="true"`.
- Issue box `role="table"` → `role="group"` (label preserved).
- No visual defects remaining — pass 3 closes clean.

## Hard-requirement checklist
- Favicon: inline SVG data-URI (ink square + alarm square) — no 404 noise.
- `FABLE ×25` back-link → `/`, top-left in the sticky topbar, hard-cut hover.
- Zero console errors at 1440×900 and 390×844 (and under reduced motion).
- `prefers-reduced-motion: reduce`: ticker static, blink static, entrance
  cuts disabled; content fully visible.
- Responsive: composed at both target sizes; masthead refits on resize.
- border-radius 0 / box-shadow none / 2px rules / 0ms hovers — verified by
  computed-style sweep, not by eye.
