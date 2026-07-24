# MARMOR — Iteration Passes

Concept: a bindery / paper-marbling atelier around a **working marbling tank** built on the
closed-form mathematics of ebru (Lu et al. / Jaffer): every drop is a polygon; the three exact
transforms are the ink-drop displacement `p' = c + (p−c)·√(1 + r²/|p−c|²)`, the tine line
`p' = p + m·u·z/(z+d)`, and the comb (tine over a rack of parallel lines, `d` = distance to the
nearest tine). Adaptive edge refinement before each transform + collinear simplification after
keep polygons smooth and bounded (per-drop vertex cap 4200, drop cap 60, oldest discarded).

Fonts: **Fraunces** (display serif, opsz axis) × **IBM Plex Mono** (labels/folios).
Palette: cream laid paper `#f2ecdf` · bath `#e9e0ca` · oxblood `#6e2b25` · marbling green
`#2e4a3d` · indigo `#2c3a5e` · gold ochre `#b98a33` · ink `#241f1a`.

Screenshots in `passes/` (served over local HTTP on :8937 so `?pattern=nonpareil` works).

---

## Pass 1 — making the nonpareil REAL (the physics fight)

Six sub-iterations on `?pattern=nonpareil` (`70-p1*-…nonpareil.png`), each shot at 1440 wide,
zero console errors throughout:

- **a–b · needles out of the tank.** First tuning (comb u≈430, z≈9) produced hyper-elongated
  spikes and dragged the whole pattern off the bottom — comb displacement was ~3× the scallop
  spacing and random stone placement left half the bath bare.
- **c · mountains.** Grid-jittered stones fixed coverage, but big round stones + shallow combs
  read as scalloped blob edges ("mountains"), not nonpareil. Derived the working rule:
  scallop depth = `u·(1 − z/(z+s/2))`, keep it ≈1–2× spacing `s`.
- **d–e · bands, off-canvas drift.** Nonpareil needs a ground of horizontal colour *bands*, so
  the ~40 seeded stones are now thrown in same-colour rows (drop displacement squeezes them
  into bands). First row layout injected ~2× the bath's area — the area-preserving drop
  transform pushed early rows clean off the canvas. Balanced ink area ≈1.3× bath and started
  rows lower to absorb the upward drift.
- **f–h · gutters and chevrons.** Cream coin-gap pockets aligned into vertical gutters — fixed
  with a brick-lay half-offset per row; dropped the gel-git from the preset (its macro-chevron
  fought the fine comb; the brief's stones + one nonpareil pass is also the authentic recipe).
- **i–j · the profile.** Symmetric zigzag teeth → sharpened the tine profile (z 13→5 at
  spacing 22, u 80): narrow pulled tongues at each tine, round arches between. Result
  (`70-p1j-tall-nonpareil.png`): tight rows of nested scallops with cream veining —
  reads as a genuine combed marble.

## Pass 2 — full-page art direction, both widths

`70-p2-desktop-{default,papers,foot}.png`, `70-p2-mobile-{nonpareil,papers}.png` — hero,
papers cards, craft grid, commissions, footer at 1440×900 and 390; zero console errors.

**Working:** Fraunces hero with tracked caps + fleuron rule; the three product cards render
*live deterministic sims* (stone rings / nonpareil / feather) that look like real sheets;
craft 2×2 grid with hairline dividers and ochre folio numerals; double-ruled commissions
block; mono footer. Mobile stacks cleanly, tank pattern identical (fixed logical space).

**Found & fixed:**
- Feather card was nearly indistinguishable from nonpareil → deepened the wide counter-comb
  (u 70→130, z 20→14) so the plumes break visibly.
- Card price rows didn't bottom-align across unequal copy → flex column with `margin-top:auto`.
- Default tank opened with one visible stone and a bare fold → seeded 8 concentric stones on
  an even jittered grid ("the bath opens dressed").

## Pass 3 — interaction QA (scripted puppeteer run) + polish

`70-p3-{ring,stylus,bench,pull,gallery}-test.png`, `70-p3-desktop-tank.png`,
`70-p3-mobile-{tank,hero}.png`. Drove the real UI: clicks, pointer drag, bench buttons, pulls.

- **Ring test:** dropping a second ink inside a first turns the first into a clean ring ✓
  (the exact-displacement acid test from the brief).
- **Stylus test:** a drag smears drops into long feathered tails along the stroke ✓; damped
  interactive u to 0.85×drag (cap 480) for finer control.
- **Bench test:** stone shower → gel-git → nonpareil produces combed marble from live state ✓.
- **Pull test:** sheet lifts (WAAPI peel, crossfade under reduced-motion), bath clears, pull
  button disables, gallery gains the print; after 4 pulls exactly 3 remain (keep-last-3) ✓.
- Raised faint mono captions from 45% → 56% ink for WCAG AA at small sizes.
- Re-verified fresh default + mobile bench composition; zero console errors at both widths.

Requirements audit: back-link chip "XAVIER FABLE ×70" → `/` ✓ · favicon (inline SVG rings) ✓ ·
title/meta ✓ · responsive 1440×900 + 390×844 ✓ · zero console errors ✓ · reduced-motion guard
(no idle animation; reveals/peel gated) ✓ · DPR cap 2 ✓ · rAF is render-on-demand and skips
while hidden, redraws on visibilitychange ✓ · styled `::selection`, scrollbar, `:focus-visible` ✓.
