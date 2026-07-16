# 37-bloom — MORPHOGEN · iteration passes

**Concept:** *MORPHOGEN — patterns that grow themselves.* A live **Gray–Scott
reaction–diffusion** lab (Turing patterns) on **WebGL2 with ping-pong float
FBOs**. Two chemicals `u,v` evolve per texel (9-point Laplacian + reaction, DA=1,
DB=0.5, dt=1) across `RGBA32F` textures (`EXT_color_buffer_float`). A display
shader reads `v`, manually bilinear-samples it and shades it with a relief
normal + ridge highlight through one of four lush colour ramps. The user
**paints seed** (pointer down/drag adds `v` via a brush term inside the sim
shader) and watches it grow. A **phase map** of named regimes (Coral / Mitosis /
Maze / Spots / Waves) plus feed & kill sliders drive the chemistry; four palettes
(bio-teal / ember / mono-ink / opal); reseed & play/pause. Below: Alan Turing's
1952 *Chemical Basis of Morphogenesis*, the two PDEs, a regime gallery, a pull
quote and footer.

Served over local HTTP (`python3 -m http.server 8912`). Screenshots at 1440×900
and 390×844 via `shot.mjs`, `waitMs` 4000–7000. **Every shot in every pass
reported `NO_CONSOLE_ERRORS`.** DPR capped at 2; sim grid tracks screen aspect
(long side 460 desktop / 300 mobile) so texels stay square and features lush;
8 sim substeps/frame desktop, 6 mobile; rAF pauses on `visibilitychange`;
`?static` / `prefers-reduced-motion` warm the culture to a bloomed frame and
render once (play control shows paused). `?preset=`, `?palette=`, `?feed=`,
`?kill=`, `?scroll=` deep-links implemented for screenshots.

Fonts: **Space Grotesk** (display/body) + **IBM Plex Mono** (clinical lab labels,
data, equations).

## Pass 1 — `37-p1-desktop.png`, `37-p1-mobile.png`

Found (art-director critique):
1. Pattern rendered correctly and beautifully (luminous teal coral with 3D
   relief) — but **sparse**: two diagonal coral clusters with a large dead-dark
   band through the centre. Read as unfinished rather than "living wallpaper".
2. Hero **overline too dim** (barely legible) and visually crowding the title top.
3. **Mobile: MORPHOGEN title overflowed the right edge** (hard-requirement bug) —
   `MORPHOGE|N` clipped; large empty top; pattern sparse.
4. Phase-map labels collided ("SPOTS/CORAL" merged).

Changed:
- Reduced mobile `h1` clamp (`12.6vw`, min 44px) so the title always fits.
- Overline brightened to `--mut` + teal accent on "GRAY–SCOTT"; more gap.
- Reworked hero scrim (radial behind the text block + layered vertical gradient)
  so text stays legible once the pattern fills the frame.
- Repositioned phase-map labels (above/below/end-anchored) to stop collisions.
- First attempt at fuller coverage: denser per-pixel seed + longer warm-up.

## Pass 2 — `37-p2*`, `37-p2b*`, `37-p2c*`, `37-p2d*`, `37-p2-wavetest-*`

Found:
1. **Dense per-pixel seeding collapsed the reaction** (`37-p2-desktop`,
   `37-p2-maze-ember`): over-seeding starves `u` globally and every regime decays
   to the trivial empty state. A genuine RD bug.
2. Reverting to sparse near-uniform speckle + long warm-up gave a **gorgeous full
   brain-coral wallpaper** (`37-p2b-desktop`) and molten-lava maze (`37-p2b-maze-
   ember`) — but the fragile low-feed regimes **Mitosis / Spots / Waves still died**
   (`37-p2b/c-mitosis-opal`, `37-p2c-spots-mono`): a bit denser and they vanished.
3. **Waves** (`f0.014/k0.045`) never sustained — its kill/feed ratio (3.2) is far
   above the four working regimes (≤2.1), so `v` decays faster than it's made.

Changed:
- **Switched seeding to localized "blob" nuclei** (like hand-painted seeds) with a
  **regime-aware nuclei count & warm-up** baked into each preset — dense nuclei for
  coral/maze that grow to fill, sparse nuclei for the self-replicating regimes so
  they survive and multiply. This made **all five regimes render richly**:
  `37-p2d-mitosis` (dividing cells), `37-p2d-spots` (leopard dot-lattice),
  `37-p2d-coral`, `37-p2d-maze`.
- **Re-tuned "Waves"** via a parameter sweep (`37-p2-wavetest-a/c`): chose
  `f0.020/k0.048` — a sustained, molten, undulating field that fills and never
  settles. Nuclei count scales with grid area for consistent density on mobile.
- Softened the hero scrim so the now-full pattern reads through around the text.

## Pass 3 — `37-p3-*` (desktop, mobile, content, quote, footer, waves, static, paint-test, mobile-content)

Verified (all `NO_CONSOLE_ERRORS`, both widths):
- **Desktop hero** (`37-p3-desktop`): full-frame luminous brain-coral with relief,
  HUD "CORAL · f0.0545 · k0.0620", legible title, elegant control dock.
- **Mobile** (`37-p3-mobile`): title fits, lush pattern up top, regime chips +
  sliders + palette present (dock horizontally scrollable), copy legible.
- **All regimes × palettes**: coral(bio-teal), maze(ember), mitosis(opal),
  spots(mono-ink), waves(bio-teal) each distinct and lush; phase-map dot & HUD
  track the current regime; sliders/marker stay in sync.
- **Painting** (`37-p3-paint-test`): a scripted pointer drag paints a visible
  sine-wave stroke of new cells that grow — brush term + custom cursor ring work.
- **Content** (`37-p3-content`, `-mobile-content`): Turing 1952 section, two PDEs
  rendered in mono with teal/amber accents, clickable regime gallery; dock + HUD
  correctly fade out when scrolled past the hero. Quote band (`37-p3-quote`) and
  footer masthead (`37-p3-footer`) clean; back-to-gallery link present.
- **Reduced-motion / `?static`** (`37-p3-static`): a single bloomed coral frame,
  play control paused, no rAF. Matches the brief.
- Back-link reads **XAVIER FABLE ×50** → `/`. OG image (`assets/og.jpg`, 1200×630)
  rendered from the live hero.

Nothing new broke; passes complete.
