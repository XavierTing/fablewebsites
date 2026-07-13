# MASS & VOID — Iteration Passes

Site: `sites/25-architecture/` — severe monochrome architecture studio.
Concept: enormous ultra-tight hero type → THE FIELD (draggable/pannable 2D plane with
momentum + edge spring + arrow keys, moving dot-grid, 7 fictional projects as pure-CSS
plans with construction-style dimension lines) → per-project full-screen case study with
CSS-drawn elevations, specs table, and serious architectural prose.

Screenshots taken with a custom Puppeteer shooter (`passes/shoot.mjs`) that scrolls to the
field, performs a real momentum drag, or opens a case study via the `?open=N` param —
because the base pipeline `shot.mjs` only captures the top of the page. All screenshots
read back with the Read tool. Palette verified pure `#ffffff` / `#0a0a0a` (ink at fixed
alphas for hairlines only). Every capture reported `NO_CONSOLE_ERRORS`.

---

## Pass 1 — Full sweep + interaction verification
Captured hero, field (initial framing), a panned/momentum state, and an open case study at
both 1440×900 and 390×844.

Findings:
- **Hero**: excellent — 18vw Archivo `MASS &` / rule / `VOID`, tight leading, rise-up
  entrance, positioning copy + coordinate readout + scroll cue. No changes.
- **THE FIELD** (initial framing): shows project 01 as an anchor plus partials of 02
  (top-right), 03 (bottom) and 04 (left edge) — reads as an invitation to explore. Dot-grid,
  drag hint bar, legend, minimap (dots + live view rectangle) all present and correct.
- **Drag / momentum / bounce**: verified via a scripted 10-step drag — plane translates with
  inertia, settles inside bounds, minimap view rect and live `X/Y` coordinate readout track
  correctly (`X −0020 · Y −0038`, using a real minus glyph).
- **Case study**: huge title, kicker, CSS elevation with dimension lines, specs `<dl>`, essay
  with drop-cap, corner close button. Crisp at both widths.
- **BUG (carried over from prior agent): close-button focus-ring artifact.** The global
  `:focus-visible{ outline-offset:3px }` on the corner-anchored close button (top:0;right:0)
  drew a ring that clipped off-screen on the top/right edges and floated detached on the
  left/bottom — a broken-looking fragment. The top-left `FABLE ×25` back-link had the same
  latent clipping problem.

## Pass 2 — Fix focus artifact + verify reduced-motion & remaining drawings
Changes:
- Added dedicated inset focus rings for corner-anchored chrome:
  `.backlink, .sitemark, .case-close { :focus-visible → outline-offset:-6px }`, with the ring
  switching to white on the dark hover background so it never disappears. Verified by
  keyboard-focusing the close button (Tab into the dialog) — ring now sits cleanly inside the
  64×64 button, no clipping, no detachment.
- **Reduced-motion** (emulated `prefers-reduced-motion: reduce`): hero content is forced to
  `opacity:1` (entrance animations start hidden, so this guard is essential) and renders fully;
  the field's initial camera positions correctly with animation disabled. Drag path falls back
  to a hard clamp (no momentum). Confirmed via screenshot.
- Spot-checked the two most complex elevations — 06 The Long Wall House (vertically-hatched
  52 m wall with three room outlines) and 07 Baths of Still Water (long hall, black sluice,
  hatched bedrock, dashed waterline). Both crisp and legible.

## Pass 3 — Post-fix confirmation
Re-shot hero + field + panned state (1440) and a mobile case study (390, Chapel of the
Interval). No regressions: pure monochrome discipline holds, hairlines stay 1px, all
dimensions in IBM Plex Mono, drag hint visible on load, initial framing still invites
exploration, minimap/coords/momentum all functioning, case-study drawings sharp on mobile.

---

## Verification checklist
- Favicon: inline SVG data-URI (nested squares) — no 404 noise. ✓
- Back-link: fixed top-left `FABLE ×25` → `/`, mono, hover inverts to black. ✓
- Console: zero errors at 1440×900 and 390×844 across every captured state. ✓
- Reduced-motion: guarded — hero visible, momentum disabled, reveals shown. ✓
- Focus: styled `:focus-visible` globally; inset rings on corner chrome (artifact fixed);
  field uses inset `outline-offset:-3px`. ✓
- Interactions: drag + momentum + edge spring, arrow-key pan, minimap tracking, live crosshair
  coordinate readout, click-to-open case study, Esc / X close with focus restore, ←/→ to move
  between projects. ✓

Fonts: Archivo (expanded 125% display) / IBM Plex Mono (dimensions, labels) / Inter (body).
