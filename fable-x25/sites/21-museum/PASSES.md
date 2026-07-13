# Iteration passes — 21-museum

## Pass 1 (1440×900 hero/scroll/hover/placard + 390×844 hero/scroll)
Found:
- **Mobile hero rendered fully black.** Root cause: `.lightbox{display:flex}` overrides the UA `[hidden]{display:none}` rule, so a full-viewport `backdrop-filter: blur(10px)` layer sat over the page at opacity 0 and broke compositing in the headless renderer at 390×844. Fixed with an explicit `.lightbox[hidden]{display:none}` rule.
- **`?hover=3` showed the hero instead of a rippling piece 3.** The piece-3 image is `loading="lazy"`; offscreen it never loaded, so the WebGL effect never built and the pinned-hover scroll never fired (deadlock). Fixed: when `?hover=N` is present, force that image to `loading="eager"` and scroll its exhibit into view immediately.
- **Picture-light glow (`.spot`) had a hard horizontal cut edge** above each frame — the radial gradient was centred on the element's top edge, so its upper half was clipped by the element bounds. Re-centred the ellipse inside the element (at 19% height, right at the frame's top edge) and widened the element so the fade completes inside it.
Placard lightbox and desktop hero composed well; no console errors at either width.

## Pass 2 (desktop hero + ?hover=3 ripple + ?placard=5 lightbox + 390×844 hero; shots in passes/21-p2-*.png)
Found:
- **Confirmed the `?hover=N` deadlock fix works**: `?hover=3` now scrolls the tapestry into view and the WebGL ripple is clearly visible (concentric rings + RGB fringing at the pinned cursor point). One caveat discovered while verifying: under `file://` the WebGL texture upload is tainted, so all canvases drop to the CSS-zoom fallback (`no-webgl`) by design — the ripple screenshot must be taken over `http://` (local server). Did so; zero console errors both ways.
- **Mobile `.est` line** ("EST. NEVER — CONDEMNED SOON — OPEN NOW") wrapped with an orphaned "— OPEN NOW". Fixed: `text-wrap:balance` plus a ≤480px rule (9.5px / .34em tracking).
- **Mobile `.hours` line** orphaned the single word "certainty". Fixed with `text-wrap:balance`.
- **Wing plaque at 390px** wrapped to two lines where `text-indent:.34em` pushed line 1 off-centre against line 2. Fixed: ≤480px drops the indent, tightens tracking to .22em, balances the wrap.
Placard lightbox composed beautifully (Cormorant SC field labels, italic acquisition fiction, brass-ringed close/nav buttons); frames, spots and wall labels all read well at 1440.

## Pass 3 (full verification sweep over http://; shots in passes/21-p3-*.png)
Shot: desktop hero, `?hover=3` ripple, `?placard=8` lightbox, mobile hero, mobile mid-scroll (`?scroll=1400`), desktop mid-scroll (`?scroll=5800`), plus a prefers-reduced-motion emulation run.
Found:
- Pass-2 mobile typographic fixes confirmed: est line and opening hours wrap in balanced pairs; wing plaque breaks "Wing IV · The / Impossible Collection" centred with no indent skew.
- Hover ripple renders smoothly at 1440 (concentric rings, chromatic offset, warm swell glow); frame gilding, picture-light spots and wall labels all sit correctly at mid-scroll on both widths.
- Placard 8 (Cathedral Moths) verified: Cormorant SC field labels, italic provenance fiction, comfortable measure, no overflow or scrollbar artefacts.
- Reduced-motion emulation: `no-webgl` class applied, zero canvases created, all 14 `.reveal` elements visible immediately, page fully composed (screenshot 21-p3-reduced-motion.png), zero console errors.
- Zero console errors on all six screenshots at both widths, over both `file://` and `http://`.
No remaining defects found — pass 3 clean.

## Hard-requirement checklist
- Favicon: inline SVG data-URI 🏛️ — present.
- FABLE ×25 back-link to `/`: fixed top-left, brass-bordered mono — present at both widths.
- Zero console errors: verified at 1440×900 and 390×844, file:// and http://.
- prefers-reduced-motion: motes/reveals/GL loop gated; CSS animations disabled; verified via emulation.
- Non-WebGL fallback: `.no-webgl` CSS image zoom on hover; also engages automatically when textures can't upload (e.g. file://).
- rAF loops pause on `visibilitychange`; devicePixelRatio capped at 2; below-fold images lazy-loaded.
