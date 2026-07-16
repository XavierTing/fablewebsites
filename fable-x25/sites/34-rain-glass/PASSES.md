# 34-rain-glass — iteration passes

Concept: **Nightglass — rain on a window, on the last train home.** Full-viewport WebGL rain-on-glass with real droplet refraction. Pipeline (Three.js, GLSL ES 1.00, ~0.75 render scale, DPR capped 2):

1. **City lights (sharp)** — instanced additive bokeh + streak-reflection sprites over a night gradient, drifting like a moving train → `sharpRT`.
2. **Blur** — two separable Gaussian passes at half-res → the fogged-pane view.
3. **Fog buffer (persistent, ping-pong)** — a clear/wet channel that slowly re-fogs (`uRegrow`); cursor drags and sliding-drop trails stamp clear into it.
4. **Composite** — per fragment finds the dominant lens (up to 44 CPU hero-drops passed as uniforms + a hashed grid of condensation beads), builds a converging-lens sample (inverted + magnified + edge-bent), then `mix(blur, sharp, fog)` and overlays the lensed sharp view inside drops, with specular, rim, meniscus, grain and vignette.

Sim: hero drops form, cling, grow, then slide under gravity (wobbling, growing as they consume beads) leaving clear trails. Cursor wipes fog; click/tap spawns drops. Screenshots over HTTP (port 8909), waitMs 5000–5500 so drops form. Zero console errors at every pass and width.

## Pass 1 — first full build (`34-p1-*.png`)
**Found (art-director read):**
- Refraction worked but was under-sold: every drop was a tiny bead (CPU drops seeded at r≈0.006–0.02) so no big hero drops showed the signature *sharp inverted mini-city inside a lens* — the whole point of the piece. Drops mostly read as faint rings over blur.
- No visible wiped vertical trails (drops too small/slow to slide within the capture window; fog regrow too fast).
- Warm bottom "horizon glow" was heavy and muddy, bleeding orange up through the title.
- **Mobile:** info-deck spanned nearly full width and sat on top of the "XAVIER FABLE ×35" back-link; the cycling copy lines collided (2-line wrap into a too-short `.lines` box); the "SCROLL" cue overlapped the controls dock.

**Changed:** hero drops enlarged (clinging r 0.011–0.024, big/click 0.024–0.044, sliding cap 0.06) and 3 pre-seeded mid-slide with trails so lensing + trails are present immediately; refraction rewritten as a real converging lens (inverted + magnified centre, edge bending) with brighter interior (`sharp*1.22 + sharp²*0.35`); added occasional bright compact "sign" lights so drops have crisp points to lens; fog `uRegrow` 0.9972→0.9981 so trails linger; toned the horizon glow ~35% and tightened it to the bottom edge. Mobile: compact deck (smaller time, "Northbound·Car 6" hidden), taller `.lines` box + smaller line font, `.scrollcue` hidden ≤640px, hero bottom padding raised.

## Pass 2 — verify refraction + interaction (`34-p2-*.png`, `-scroll1/2`, `-footer`, `-reducedmotion`, `-interact`)
**Found:**
- Refraction now convincing — mobile top-left cluster shows crisp inverted lensed lights; click-spawned drops lens vertical light streaks perfectly (verified by driving the pointer: `34-p2-interact.png` shows a wiped fog streak + freshly spawned lensing drops).
- Scroll sections, field-note cards and footer compose well; glass dims to 40% behind content (readable body contrast); live "drops" counter updates.
- Reduced-motion (`34-p2-reducedmotion.png`) correctly renders a still, beautiful rained-on window (drops + beads present, no motion, Play button paused).
- Remaining nit: drops sitting over dark sky in the upper pane read a little like empty soap bubbles; drops could feel more like 3D water.

**Changed:** widened the vertical light distribution (`pow(rnd,1.4)→1.18`, full −1..1 range) so the upper pane also has catchable lights; added a bright lower **meniscus** crescent (opposite the upper-left light) so drops read as dimensional water beads.

## Pass 3 — final sweep (`34-p3-desktop.png`, `34-p3-mobile.png`)
**Found:** upper-pane drops now catch amber light; drops read clearly as 3D water with specular top + meniscus bottom; mobile shows multiple textbook inverted-city lenses. Hierarchy, spacing, palette, contrast all clean; no overflow at 1440×900 or 390×844; `NO_CONSOLE_ERRORS` at both widths and in the reduced-motion + interaction captures.
**Changed:** nothing further required — shipped. OG/thumb images generated from the pass-3 hero.
