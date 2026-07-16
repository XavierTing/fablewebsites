# FURTHER — an open sea · iteration passes

Concept: a cinematic WebGL ocean at golden hour. A large water plane displaced
by summed **Gerstner waves** in the vertex shader (rolling swell), shaded with a
**fresnel reflection** of a procedural sky dome, **sun glitter / specular
sparkle** on the wave-faces, deep-to-teal depth colour, crest **foam**, and an
atmospheric **horizon haze**. Slow boat bob. Full day cycle: golden hour → dusk
→ moonlit night (stars + moon-glitter) → dawn, driven by a `time-of-day` control
and `?time=golden|dusk|night|dawn`. Three.js r0.160, single water mesh + sky
sphere, custom ShaderMaterials. DPR capped at 2, rendered at 0.75 scale (0.62 on
mobile). rAF pauses when the tab is hidden; reduced-motion renders one still
frame.

Screenshots taken with the pipeline `shot.mjs` / `scrollshot.mjs` over local HTTP
(`http://localhost:8925`), waitMs ~4500. Every capture reported
`NO_CONSOLE_ERRORS` at both 1440×900 and 390×844.

---

## Pass 1 — first light (`50-p1-golden.png`)

**Found (merciless art-director read):**
- The whole frame was washed-out and *desert-like*: a flat pale-beige sky with
  the blue zenith hazed out entirely, low overall contrast.
- The sun was a blown-white disk with no warm halo.
- Foam read like snow scattered on the crests; the far water looked like sunlit
  dunes rather than sea.
- The sun-glitter "road of light" toward the camera was weak and undefined.

**Changed:**
- Tightened the sun into a defined disk with a layered warm halo (tight + mid +
  broad glow terms) instead of one blown blob.
- Cut the horizon-haze strength and steepened its falloff so the sky gradient +
  blue zenith could show.
- Deepened & saturated the golden/dawn palette (darker deep-water teal, bluer
  zenith, warmer horizon), lowered exposure slightly.
- Concentrated foam on breaking tips (higher crest threshold), gated by noise.
- Boosted the glitter sparkle and added a broad specular sheen to shape the road.

## Pass 2 — colour & the road (`50-p2-golden/night/dusk/mobile/scroll1/scroll2`)

**Found:**
- Sky was richer but the broad sun glow still flooded the corners, hiding the
  blue; mid/far water still read like lit dunes because *every* crest caught warm
  light across the whole sea.
- Hero eyebrow was near-illegible over the bright horizon.
- **Layout bug:** the fixed HUD + controls panel overlaid the reading and footer
  while scrolling (the panel covered the third stanza and the footer rule).

**Changed:**
- Contained the sun glow (higher exponents, smaller broad weight) so the cool
  corners of the sky read blue; deepened mid-water (`pow(facing,0.78)`).
- Concentrated the golden sheen tightly along the sun azimuth so off-axis water
  stays teal — killed the dune look and made the road of light distinct.
- Pulled the horizon haze in (`near 260→185`, `far 1500→1120`) to soften the
  busy far crests into atmosphere.
- Added a warm text-shadow + brighter ink to the hero eyebrow.
- Verified night (moon-glitter, stars, cool teal-black sea) and dusk (mauve sky,
  pink-teal sea) — both cinematic.
- Scroll captures confirmed the verse/footer typography, but flagged the fixed
  chrome overlapping body text → fixed in pass 3.

## Pass 3 — chrome, mobile & the fine print (`50-p3-golden/mobile/scroll/reducedmotion`)

**Found & fixed:**
- **Hero instruments over content:** added a scroll listener that fades the HUD +
  controls out (opacity + `pointer-events:none`) once past ~0.58vh and back on
  return — the reading + footer are now unobstructed; the back-link stays.
- **Mobile controls overflow:** the `<input type=range>` flex items refused to
  shrink; switched the mobile panel to `flex-wrap` so time-of-day wraps to a
  second row (play + sea-state row 1, time-of-day row 2) — no horizontal clip.
- **Mobile HUD collision:** "SEA · MODERATE / GOLDEN" letters touched; reduced
  the state-row letterspacing + added a gap.
- Nudged the mobile back-link clear of the taller panel; compacted the HUD.
- **Reduced-motion / GSAP centering bug:** `clearProps:'transform'` and the CSS
  `transform:none` were stripping the panel's `translateX(-50%)`, and GSAP
  `x:'-50%'` was mis-centering in motion. Now: reduced-motion is CSS-only (panel
  keeps `translateX(-50%)`), and the motion entrance uses `xPercent:-50`. Panel
  centers correctly in both modes.
- Confirmed the reduced-motion path renders a single gorgeous static seascape.

**Result:** believable rolling swell with a defined sun-glitter road, fresnel sky
reflection, crest foam and horizon haze across golden / dusk / night; clean,
centered chrome that gets out of the way on scroll; responsive at 390×844; zero
console errors at both widths.
