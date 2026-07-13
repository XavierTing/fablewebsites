# VIVARIUM — iteration passes

Screenshots in `passes/`, taken over local HTTP (port 8901). `?t=0..1` freezes the
day/night cycle for deterministic shots; `?scroll=1` jumps to field notes; `?rm=1`
forces the reduced-motion path.

## Pass 1 — `26-p1-desktop.png` (noon), `26-p1-night.png`, `26-p1-mobile.png`, `26-p1-scroll.png`
Found:
- School reads coherently (polarisation 0.98) but is over-clumped — a dense blob, fish overlapping.
- Kelp reads as sparse bare beanstalks: blades too small and too rare, stems too thin.
- Caustic surface bands look like two bold cartoon wavy lines — too solid/graphic.
- Night: bioluminescent glints too sparse and dim; sky pitch black with no surface sheen.
- Mobile panel census wraps raggedly ("MEDUSAE / 3" orphan); card meta lines wrap to 2 lines on cards 2–3.
- Hero title legibility suffers when the school swims behind it; predator reads as a smudge.
- Console: zero errors at 1440×900 and 390×844.

Changed: boid separation radius 21→26 and weight 1.85; kelp blades on every joint
(alternating sides, occasional opposite leaflet), thicker tapered stems; caustics
split into 5 thinner, fainter bands; glow plankton 30%→50% with stronger halo; deep-night
moonlight sheen gradient; census stats wrapped in nowrap spans; card meta copy shortened;
hero title text-shadow; predator given a paler belly gradient + bluer body.

## Pass 2 — `26-p2-desktop.png` (noon), `26-p2-night.png`, `26-p2-mobile.png` (dusk)
Found:
- Desktop noon and night now read beautifully: spaced school, frondy kelp, subtle caustics, glinting night plankton with moon sheen. Predator silhouette reads as a creature.
- Mobile panel census still 3 ragged lines at 240px width; feed hint wraps "FOR / CURRENT".
- Mobile school pressed flat against the left wall — 90px wall margin too large for a 390px viewport.
- Night glints slightly ring-like (dark centre).
- No way to screenshot the reduced-motion scene.

Changed: mobile census/hint font sizes and letter-spacing reduced; wall margin made
adaptive (`min(90, W*0.16)`); bright solid core dot added to bioluminescent glints;
`?rm=1` query param added to force the reduced-motion path for verification.

## Pass 3 — `26-p3-dawn.png`, `26-p3-mobile.png` (dusk), `26-p3-reduced.png`
Found:
- Dawn teal state distinct from noon azure, dusk violet and deep night — four clear moods from one 90 s cycle.
- Mobile: census fits two clean lines, hint fits one, school schooling mid-water (no wall pinning), dusk palette composed.
- Reduced motion: calm scene, fish drifting minimally (polarisation relaxes to ~0.64), kelp near-still — intentional, not broken.
- Zero console errors across every shot, both widths.

No further changes required; shipped.
