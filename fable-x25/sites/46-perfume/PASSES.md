# OLFACTA — iteration passes

Concept: **OLFACTA — a perfume, visualized.** An avant-garde niche-perfume maison where
each fragrance is rendered as a slow-drifting luminous particle cloud. Four opuses, each with
a distinct palette + motion signature; selecting one morphs the visual and repaints the whole
page; hovering/holding a note in the scent pyramid intensifies that note's colour in the cloud.

Engine: single 2-D `<canvas>` (additive `lighter` blending + per-fragrance trail fade) driving
three particle tiers — base fields (large, slow, deep), heart blooms (mid, pulsing), top motes
(small, quick, twinkling). Pre-rendered colour glow sprites (cached) for performance; smooth
palette/motion morph on selection. DPR capped at 2, rAF paused on `visibilitychange`,
reduced-motion renders a single settled frame.

Fonts: **Cormorant Garamond** (display / poetic copy) + **Space Grotesk** (UI / labels / meta).

Screenshots via `assets-pipeline/shot.mjs`, served over local HTTP :8921, waitMs ~4500.
`?scent=N` (1–4) preselects a fragrance; `?y=<px>` jumps scroll and `?reduced=1` forces the
reduced-motion path (both dev-only aids, harmless in production).

---

## Pass 1 — build + hostile critique
Screens: `46-p1-heliodor-desktop`, `46-p1-sanguine-desktop`, `46-p1-cendre-mobile`,
`46-p1-collection`, `46-p1-detail`, `46-p1-footer`.

Found:
- **Mobile horizontal overflow / edge-touching text (real bug).** `.hero`, `.sec`, `.footer`
  used a `padding: … 0 …` shorthand that zeroed out `.wrap`'s left/right padding. On desktop this
  was masked by the max-width centering margins; on mobile every heading and paragraph ran to the
  screen edge and "Olfacta" was clipped.
- Hero body copy lost legibility over the brighter clouds (Sanguine especially) — the veil didn't
  protect the text column.
- No way to screenshot lower sections (needed a scroll hook).
- Verdict on the art: the four palettes already read as clearly distinct (gold-green / crimson-amber
  / violet-grey / silver-cyan) — keep and refine, don't rework.

## Pass 2 — fixes + lower-section critique
Screens: `46-p2-cendre-mobile`, `46-p2-detail-maree`, `46-p2-footer-maree`,
`46-p2-reducedmotion`, `46-p2-interact-notes`.

Changed:
- Replaced the padding shorthands with `padding-top/bottom` so `.wrap`'s horizontal padding
  survives → mobile overflow gone (verified `scrollWidth == clientWidth == 390`).
- Reworked `#veil`: added a leftward hero scrim for the text column, plus a scroll-triggered
  `.deep` state that darkens the cloud once you pass the hero so section copy stays legible while
  the art still shows through.
- Added `?y=` scroll jump and `?reduced=1` test hooks.
- **Corner-UI collisions:** the fixed back-link (top-left) and maison mark (top-right) overlapped
  atelier/footer text mid-scroll. Added soft radial backing scrims behind both, and fade the
  (redundant-by-then) top-right mark out once scrolled past the detail section.
- **Flacon polish:** brightened the glass facet gradients (was reading dark/plasticky), made the
  liquid fuller ("to the shoulder") with an inner specular glow, and added an accent-tinted
  ground-glow + halo behind the bottle so it "catches light."
- Tightened the sillage/longevity gauge word labels (were floating too far below the arcs).
- Verified the signature interaction: holding **Amber** (base) + **Raspberry** (top) visibly surges
  those tiers' colours in the cloud with correct pressed-chip states. Reduced-motion renders a
  beautiful settled crimson bloom frame. No console errors at either width.

## Pass 3 — final polish + verification
Screens: `46-p3-cendre-desktop`, `46-p3-maree-desktop`, `46-p3-mobile-collection`,
`46-p3-mobile-detail`, `46-p3-mobile-footer`, `46-p3-default-{desktop,mobile}`,
`46-p3-cendre-smooth`.

Changed:
- Smoothed the glow sprite with an 8-stop falloff to kill faint concentric banding that showed in
  the large additive plumes (most visible in Cendre's smoke) — now reads as soft, organic smoke.
- Confirmed all four opuses distinct in both palette AND motion at desktop and mobile: Héliodor
  (gold sparks rising over green drift), Cendre (slow swirling violet-grey smoke, long trails),
  Sanguine (dense crimson→amber blooming pulse), Marée (cool silver-cyan horizontal fizz).
- Confirmed mobile layout is intentional throughout (stacked selector cards, wrapped pyramid,
  enlarged flacon), no horizontal overflow.

Result: **zero console errors** at 1440×900 and 390×844 across the default load and all
`?scent=1..4` variants; motion pauses when the tab is hidden; DPR capped at 2; reduced-motion
serves a still, luminous scent-cloud frame.
