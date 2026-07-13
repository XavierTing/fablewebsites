# Iteration passes — 05-kinetic-type

## Pass 1 (1440×900, 390×844, scroll 0.28 / 0.62 / 0.85)
Found:
- Wall grid repetitive: combo generator used `ci % 8` across an 8-column grid, so entire columns shared identical settings (col 1 was "RF 100 60" five times). Kills the "forty ways" claim.
- "rumor" acid underline (border-bottom on inline span) floats detached below the descender line — looks broken.
- Fixed FABLE ×25 back-link uses mix-blend multiply, so it disappears/collides over black display text at mid-scroll (wall heading).
- Weight statement leaves a dead right zone; statement labels are static ranges only — missing the "live font editor" energy.
- Minor: rAF loop runs two `querySelector` calls per frame for cursor hover state; one is unused.
- No console errors at either width. Hero proximity-weight gradient reads dramatically in the static shot (goal met).

Changed:
- Decorrelated wall combos (prime-stepped indexing + per-row offsets) so no column/row repeats.
- Rumor underline → `text-decoration underline` with acid color, thickness and offset.
- Back-link gets a bone chip background instead of blend mode.
- Added live acid value chips to each manifesto statement (wght / wdth / slnt / SOFT·WONK values update per frame from scroll progress).
- Cleaned the rAF loop to a single hover query.

## Pass 2 (1440×900 top / 0.30 / 0.55 / 0.80, 390×844 top / 0.50)
Found:
- REAL BUG — mobile playground overflows the right edge: the ≤1024px media query reset `.play-grid` to plain `1fr` (not `minmax(0,1fr)`), so the nowrap `.readout` min-content forced the grid column wider than the 390px viewport. Glyph stage border ran off-screen and all four slider value chips (outputs) were pushed out of view.
- Width statement (`white-space:nowrap`, 12.5vw) clips "STRETCHES." at 390px once wdth animates toward 151.
- Dead vertical band between manifesto statements reads as empty page in static shots (min-height 92svh each).
- Stray dead statement `el.parentNode;` left in the wall cell IIFE.
- Confirmed fixed from Pass 1: wall combos genuinely diverse (no repeating column), rumor underline hugs the word, back-link chip legible over black display text. Hero shows hairline-E → black-AST → hairline-IC gradient in the static shot. No console errors at either width.

Changed:
- `.play-grid` mobile column → `minmax(0,1fr)` + `min-width:0` on `.glyph-stage`/`.controls`; sliders and value chips now fit 390px.
- Mobile width statement → 10.5vw, letter-spacing 0 (no clip at full wdth 151).
- `.stmt` min-height 92svh → 86svh to tighten inter-statement rhythm.
- Removed dead `el.parentNode;` line.

## Pass 3 (1440×900 top / 0.66 playground / 1.0 colophon, 390×844 top / 0.24 width / 0.52 playground / 0.85 wall)
Found:
- Mobile playground now fully composed at 390px: all four sliders custom-styled (ink track with fill gradient, ring thumb), acid value chips visible, readout code block scrolls inside its own box.
- Mobile width statement "LANGUAGE STRETCHES." fits at 10.5vw with its small caption; live chip reads WDTH 98 mid-scroll — no clipping.
- Desktop playground: Fraunces R sits on the drawn baseline, BASELINE annotation legible, glyph picker chips styled, `font-variation-settings` readout inverted ink block reads as a spec sheet. Sliders show three distinct thumb positions — clearly custom, not default browser controls.
- Colophon: bone-on-ink contrast strong, acid axis glossary scannable, footer Fable ×25 link present. Mobile wall (2-col) cells remain visually distinct pair by pair.
- Hero verified at both widths: hairline E → black AST → hairline IC weight gradient dramatic in a static frame.
- Zero console errors at 1440×900 and 390×844 across all seven screenshot states.
- Tooling note (not a site bug): generic screenshot filenames collided with parallel builders sharing the scratchpad; retook final shots with site-unique names to confirm.

Changed:
- Nothing — no site defects found this pass; shipped as-is.
