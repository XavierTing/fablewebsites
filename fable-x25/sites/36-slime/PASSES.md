# PHYSARUM — Iteration Passes

Site: `sites/36-slime/` — live GPU Physarum polycephalum (slime-mould) simulation.
Engine: WebGL2, GLSL ES 3.0. Ping-pong framebuffers: agent state (RGBA32F, up to 524k agents)
+ trail map (RGBA16F). Per-frame passes: update agents → diffuse+decay trail →
deposit agents (additive points) → food splats → tone-mapped palette display.

Screenshot tool: `assets-pipeline/shot.mjs`, served over local HTTP on `:8911`, waitMs 5000.
Verified: real reticulated network renders (not blank/uniform), zero console errors both widths.

---

## Pass 1 — first render (`36-p1-desktop.png`, `36-p1-mobile.png`)
**Found:**
- Simulation works: luminous gold vein networks form within ~4s, 60fps, STEP counter climbing, NO_CONSOLE_ERRORS both widths.
- Central-disc seeding produced a radial "creature" bloom that left the corners/edges dark — read more like a single organism than a self-organising transport network.
- Hero lede + subtitle sat directly over bright trail — low contrast / hard to read.
- Control dock (bottom-left) collided with the subtitle "the intelligence of slime" and the lede.

**Changed:**
- Switched agent seeding to full-field (55% centre-weighted / 45% uniform) so the network fills the screen edge-to-edge as a reticulated web.
- Moved the control dock to bottom-right (clear of the left-aligned hero copy).
- Added `#heroscrim` — a left+bottom dark gradient that darkens behind the copy while keeping the network glowing on the right.
- Lowered display exposure 1.7 → 1.55 so highlights stop blowing out to white.

## Pass 2 — composition + legibility (`36-p2-desktop.png`, `36-p2-mobile.png`)
**Found:**
- Desktop now excellent: full-field network, legible copy, no collisions.
- Desktop lede's right edge still grazed a couple of bright veins (scrim faded a touch early).
- Mobile: hero copy is bottom-aligned over the network — the gold word "slime" and parts of the lede crossed bright veins, contrast too low.

**Changed:**
- Extended the desktop scrim's dark zone (transparent point 58% → 63%; midpoints darker).
- Added a mobile-specific `#heroscrim` override: a stronger bottom-anchored gradient (.94 → transparent at 88%) covering the two-thirds where mobile copy lives.

## Pass 3 — states + polish (`36-p3-*.png`)
**Verified (all NO_CONSOLE_ERRORS):**
- `36-p3-desktop/mobile` — hero copy now crisply legible at both widths; network reads as a living circuit board.
- `36-p3-reduced` — `prefers-reduced-motion` renders a fully-formed static network (260 warm-up steps, then loop paused; HUD STEP 0 / FPS — confirms no animation).
- `36-p3-scroll1/scroll2/footer` — maze section, Tokyo emergent-transport SVG diagram, three-rule model cards, spec row and footer all compose cleanly with strong typography.
- `36-p3-mobile-scroll` — content sections stack responsively.

**Found:** the fixed mobile "CONTROLS" toggle overlapped body text once scrolled into the content sections.

**Changed:** the hero IntersectionObserver now hides the dock, the mobile CONTROLS toggle and the HUD when the hero scrolls out of view (they belong to the sim only).

## Pass 4 — confirm fix (`36-p4-*.png`)
- `36-p4-mobile-scroll` — CONTROLS toggle correctly hidden over content; text unobstructed.
- `36-p4-desktop/mobile` — no regressions; network renders, zero console errors.

---

### Requirements checklist
- [x] Self-contained folder; inline SVG emoji favicon; `<title>` + meta description.
- [x] Back-link reads **XAVIER FABLE ×50** → `/` (top-left, animated dot).
- [x] Responsive 1440×900 and 390×844; heavy sim adapts (smaller agent pool + sim res on mobile).
- [x] Zero console errors at both widths and in reduced-motion / scrolled states.
- [x] rAF pauses on `visibilitychange` (hidden tab) and when hero scrolls out of view; DPR capped at 2.
- [x] `prefers-reduced-motion` → static formed-network frame, no loop.
- [x] Real evocative copy (Nakagaki 2000 maze, Tero 2010 Tokyo rail, Jones agent model) — no lorem.
- [x] Controls: sensor angle, sensor distance, deposit, decay, agent count, 3 palettes (AURUM / BIOLUME / SPORE), DROP FOOD + RESEED; cursor deposits food / swarm attractor.
