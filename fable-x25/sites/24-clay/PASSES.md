# DOUGH (24-clay) — Iteration Passes

Screenshots in `passes/`. Shot tool: `scrollshot.mjs <file> <out> <w> <h> <scrollY> <waitMs>`.
All shots reported `NO_ERRORS` (zero console errors) at both 1440×900 and 390×844.

## Pass 1 — baseline audit (24-p1-*)
Shots: desktop hero, mobile hero, cards row 1, cards row 2, knead blob, oven timeline.

Findings:
- **Clay material consistency: PASS.** One light source top-left across every raised surface — hero letters, buttons, backlink, all 6 cards, the 6 CSS pastries, knead blob, timeline beads, hours sign, footer slab, floating crumbs. Highlight inset TL, shade inset BR, soft drop shadow to BR everywhere. Pressed surfaces (scenes, progress track, timeline rail) correctly invert the recipe. Nothing reads flat.
- **Pastry recognizability: PASS.** Cloud Croissant (cloud + laminated dough), Möbius Pretzel (arch + crossed legs + salt), Schrödinger Éclair (glazed éclair + quantum ghost), Gravity Bagel (ring + hole + orbiting crumb), Echo Macaron (two shells + filling), Infinite Mille-Feuille (stacked layers + 1,001 badge). All read as their pastry.
- **Knead blob: PASS.** Reads as a squishy pink clay ball with a face; spring physics (hand-rolled STIFF/DAMP integrator) deforms on poke and springs back.
- **Warm palette: PASS.** Cream/pink/butter/pistachio/cocoa — cohesive and warm.
- **FLAW (mobile):** at 390px the "DOUGH" hero headline wrapped 4+1, orphaning a lone "H" on line 2 — unbalanced for a showcase.

Fix applied:
- Added a ≤640px sizing block for `.word`/`.letter` (tighter gap + smaller clamp min) so all five clay letters sit on one row at 390px.

## Pass 2 — verify mobile headline + re-audit (24-p2-*)
- Re-shot mobile hero + desktop + cards + knead.
- Mobile "DOUGH" now sits on a single balanced row; hero composition intact.
- No new issues; lighting/recognizability unchanged and consistent.

## Pass 3 — final verification (24-p3-*)
- Full re-shoot desktop/mobile/cards/knead, plus reduced-motion mobile check.
- Verified: favicon (🥐 inline SVG), FABLE ×25 back-link → `/`, zero console errors both widths, reduced-motion disables proof/blobby/sway/drift/orbit/echo/snow/superpose + reveals shown, blob spring guarded behind `!reduced`.
- Ship-ready.
</content>
