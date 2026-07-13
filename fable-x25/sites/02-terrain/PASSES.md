# ALTIVA — iteration passes

> Note: after Pass 1 an unlogged interim pass converted the waypoint cards to sticky-centered wrappers and reworked terrain lighting/form. Pass 2 verified both fixes held (cards stay centered at all four waypoints on desktop and mobile; foreground keeps form in daylight) before critiquing further.

## Pass 1 (9 shots: hero/wp1/wp2/wp3/wp4/epilogue @1440, hero/wp2/wp4 @390 — zero console errors)

Found:
- **Waypoint cards scrolled out of frame at their own waypoints.** At the scroll fractions where the camera arrives at each peak (p=.22/.45/.67/.88) the card straddled the top viewport edge: titles clipped ("The Candra" lost, "Spires" beheaded), card head colliding with the top-right HUD coords, and on mobile with the FABLE ×25 backlink too.
- **Foreground terrain crushed to pure black.** No fill light — shadow-side faces were silhouette soup; hero bottom third and WP3 midground were dead black masses.
- **Night scene (WP4 → epilogue) nearly invisible.** Moonlight at 0.5 intensity left the terrain an undifferentiated void under the stars.
- **Mobile collisions.** Altimeter numeric readout overlapped hero-meta line and card meta text at 390px.

Changed:
- Cards now sit in a `position:sticky; top:0; height:100vh` wrapper inside each 150vh section — each card stays centered on screen the entire time its waypoint is active; added a card exit fade (GSAP) as the section releases.
- Added cool fill DirectionalLight (0x8fa3d8, 0.85 day → 0.4 night) opposite the sun; raised hemisphere 0.55→0.8; lightened valley base color 0x35304a→0x453f60; eased vertex AO floor 0.72→0.8.
- Night pass: moon 0.5→1.15 (0xa9bcf5), hemi 0.42→0.62, horizon/fog lifted, exposure 0.92→1.0, sun elevation 0.05→0.09.
- Mobile: hid rail readout (rail+diamond only, 20px wide), added altitude line to the top-right HUD block; capped hero-meta at 72vw; card centered at 86vw.
- Card entrance triggers moved from the (now sticky) card to its parent section.

## Pass 2 (9 shots in passes/02-p2-*: hero/wp1/wp2/wp3/wp4-night/epilogue @1440, hero/wp2/wp4-night @390 — zero console errors at both widths)

Found:
- **WP2 & WP3 compositions dead.** A giant unlit terrain mass filled 60–70% of the frame — camera flew too low, hero peaks were anchored only 430 u off the path, and the gaze bias (0.5) locked the view straight into the shadow-side wall. WP3's "alpenglow" copy sat over a mud-black scene because nightfall grading already reached ~23% at p=0.61.
- **Epilogue had no stars.** The flight path ends below ridge height, so the closing line floated over a black terrain wall — star layer fully occluded.
- **HUD coords illegible at WP2.** "SEREN RANGE · EXP IV" vanished against the bright orange sky; hero-meta lines on mobile likewise sat unshadowed on sunlit peaks.
- **Altimeter collision.** The amber marker readout ("4 871 M") printed directly over the fixed "4 800" tick label.
- Night terrain slightly crushed on the shadow side (fill 0.4 too weak).
- Verified held from interim pass: sticky-centered cards at all four waypoints (desktop + mobile), no title clipping, no HUD collision; foreground terrain keeps form in daylight.

Changed:
- Waypoint peaks pushed 430→660 u off the flight path; gaze bias 0.5→0.42 — peaks now read as framed subjects, not walls.
- Flight altitude raised (+135→+175 base, min clearance +70→+95).
- Final climb: path gains +430 u over the last 18% and the camera tilts up (+340 gaze) so the epilogue looks out over the starfield.
- Nightfall grading delayed sstep(0.5,0.85)→sstep(0.56,0.88) — WP3 keeps its embers; WP4 still ~90% night. Night fill 0.4→0.52.
- Text-shadows added to hud-coords, backlink, hero-meta (also lightened to #b9b5d0), scrollcue.
- Altimeter tick labels fade out when the marker passes within 5% of them.

## Pass 3 (9 shots in passes/02-p3-* + 6 verification shots in passes/02-p3v-* — zero console errors at both widths)

Found:
- Pass-2 fixes confirmed: WP2/WP3 now framed sunlit compositions, epilogue opens onto the starfield, HUD/hero-meta legible everywhere, altimeter labels yield to the marker, night fill keeps shadow form.
- **Cards occluded their own subjects.** Each waypoint peak was anchored on the same screen side as its card, and the gaze bias then parked the hero peak *behind* the card glass — WP1's spire hid behind the card + altimeter; WP2/WP3's peaks were the dark blurs under the card.
- **Altimeter marker readout washed out over the sun disc** at WP2 (amber text on white-hot sky; text-shadow alone couldn't win).
- Desktop epilogue was 100% empty sky — serene but slightly unmoored.

Changed:
- WP_SIDE flipped to [-1,1,-1,1] — each peak now rises on the opposite screen side from its card; card never covers its subject at any of the four waypoints.
- alt-read got a blurred dark pill (rgba(7,9,20,.5) + backdrop-blur) — legible over sun, snow, and stars.
- End-of-traverse camera tilt eased 340→255.

Verification (02-p3v-*): WP1 ridge left / card right; WP2 massif right / card left; WP3 alpenglow col left / card right; WP4 moonlit wall right / card left; epilogue starfield with anchored footer; mobile WP2 clean of the rail. Hard requirements re-checked: favicon, FABLE ×25 → /, zero console errors 1440 & 390, prefers-reduced-motion gates GSAP + camera drift + grain + scrollcue, rAF stops on visibilitychange, DPR capped (2 desktop / 1.75 mobile).
