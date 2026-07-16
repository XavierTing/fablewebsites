# 38-orbits — N-BODY · iteration passes

A gravitational n-body sandbox on 2D canvas. Softened-Newtonian gravity,
velocity-Verlet integration with fixed-`dt` substeps (substeps scale with the
time-warp so accuracy holds at 4×). Mass-based size & colour (cool planet-blues →
warm star-golds). Luminous additive trails that fade to space. Collisions merge,
conserving momentum, with a soft flash. Distinct from `30-orrery` (deterministic
Kepler ephemeris) — this one is chaotic, interactive, trail-painting.

Screenshots taken over local HTTP (`python3 -m http.server 8913`), read back with
the Read tool. `waitMs 5000` so trails accumulate. `NO_CONSOLE_ERRORS` on every
shot in every pass, both widths.

## Architecture notes (decided before pass 1, refined in pass 2)

- **Three stacked canvases** — `#bg` (static nebula + faint deterministic stars),
  `#sim` (persistent fading trails), `#ui` (cleared each frame: live bodies, merge
  flashes, aim vector, cursor-gravity ring). DPR capped at 2; `rAF` pauses on
  `visibilitychange`; `prefers-reduced-motion` builds a static painted frame and
  never starts the loop.
- **Physics**: `a = Σ G·mⱼ·(rⱼ−rᵢ)/(|Δ|²+ε²)^{3/2}` (softened), velocity-Verlet,
  `SIM_DT=0.14`, `4·warp` substeps. Presets zero total momentum and centre the
  barycentre so the show stays on screen. Circular/near-circular seed velocities
  from `v=√(GM/r)` keep the pre-seeded systems stable.

## Pass 1 — `38-p1-desktop.png`, `38-p1-mobile.png`

Found:
1. **Star saturated to a huge white blob.** Because the star is stationary,
   additive glow drawn every frame on the trail layer saturated its *entire*
   glow-radius (~216 px) to pure white — dominant, especially on mobile where it
   sat over half the viewport.
2. **Mobile legibility broken** — the bright star sat directly behind the "N-BODY"
   headline and the "N°38 …" overline; text was hard to read.
3. Rogue ingress trail read as a dull, wide grey smear (mass-130 colour ≈ warm
   white at low glow alpha).
4. Desktop composition and the core simulation (slingshots, one merge 6→5) already
   read well.

Changed:
- (deferred the big fix to pass 2) added a mobile hero bottom-scrim + shifted the
  system's centre upward in portrait (`cy = 0.40·H`) so the painting floats above
  the copy. Warmed & shrank the hot core. Made the rogue lighter (mass 46 → cyan
  comet) and start closer.

## Pass 2 — `38-p2b-desktop.png`, `38-p2b-mobile.png`, `38-p2b-static.png`, `38-p2b-scroll.png`, presets

Found (pass-1 fixes helped but the star blob persisted): additive-glow trails
inherently saturate a stationary bright body out to its glow radius — no amount of
alpha-tuning removes it without killing the trails.

Changed — **split the render into two responsibilities**:
- `#sim` now paints only a **thin trail stamp** (radius ≈ `r·1.15`) → luminous,
  well-defined orbit curves with elegant faint ghost-rings; lowered `TRAIL_FADE`
  to `0.016` for longer painted loops.
- `#ui` draws the **full body** (soft halo + crisp core + warm-white centre) fresh
  every frame, so nothing accumulates: the star became a compact golden sun and
  fast bodies keep bright heads.

Result: star is now a refined sun, trails are thin and gorgeous, mobile is fully
legible, the reduced-motion static frame is a composed still with pre-drawn trails,
and the mid-scroll "three-body problem" section reads cleanly.
Verified drag-to-launch (cleared 0 → drag → 1 → 2), pause (space), preset switch,
clear, cursor-gravity toggle, reset — all functional, `errors: []`.

## Pass 3 — `38-p3-desktop.png`, `38-p3-mobile.png`, `38-p3-binary.png`, `38-p3-solar.png`, `38-p3-static.png`

Found:
1. **Chaos preset collapsed too fast** — four heavy masses seeded close together
   merged to a binary within ~2 s (bodies 04 → 02), so the "chaos" showcase looked
   sparse and static.
2. Everything else (default, Binary, Solar, Rosette, mobile, reduced-motion) held
   up as a top-studio-grade frame.

Changed:
- Rebuilt **Chaos** as the canonical three-body problem: three comparable masses on
  a perturbed equilateral triangle, velocities set from the measured net inward
  acceleration (`v=√(a·R)`) at ~0.82–0.98× circular with a symmetry-breaking kick.
  It now survives the full 5 s as an intertwining three-body dance (bodies stay 03,
  merges 0 across three random re-rolls) that actually paints looping curves.

Final state: zero console errors at 1440×900 and 390×844 across default + all four
presets + static (reduced-motion). `rAF` pauses when hidden, DPR capped at 2,
reduced-motion renders a static pre-painted frame.
</content>
