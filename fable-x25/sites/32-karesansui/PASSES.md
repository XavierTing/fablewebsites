# 32-karesansui — 枯山水 KARESANSUI · iteration passes

An interactive Japanese dry rock garden (zen garden), rendered top-down on a full-viewport
canvas. The ground is raked gravel; drag to carve multi-tine grooves that read as real relief and
bend around the stones as concentric ripples. On load it draws a beautiful default raking
(rings around each rock + a flowing parallel field) so it is gorgeous before any interaction.

Served over local HTTP (`python3 -m http.server 8907`). Screenshots at 1440×900 and 390×844,
waitMs 4500 (settle after the 1.15s reveal sweep). Interaction + reduced-motion verified with a
small Puppeteer driver (`assets-pipeline/_rake-kare.mjs`) that scripts real rake strokes and
emulates `prefers-reduced-motion`. **Zero console errors (`NO_CONSOLE_ERRORS`) on every shot in
every pass.**

## Technique (how the grooves work)

- **The field is a scalar `phase(x,y)`; grooves are its iso-contours** (spacing = one rake-tine,
  ~15px), traced with marching-squares and drawn as relief: a cool trough + a highlight wall
  offset toward the top-left light + a shadow wall offset away, with contrast scaled by each
  segment's orientation to the light. Grooves therefore read as raked sand, not flat lines.
- `phase` = a gently-waved parallel base, blended near the rim toward an edge-parallel **raked
  border frame**, blended near each stone toward a **radial ring field** (concentric contours).
  Multiple stones are combined by a smooth distance-weighted average → no hard seams, and rings
  merge into figure-eight saddles between neighbours.
- **Live raking** paints the same relief strokes along the drag as N parallel tines; near a stone
  the tine direction blends toward the tangential flow around it, so hand-raked lines bend into
  circles around the rock exactly like the generated field.
- Persistent offscreen buffers (sand+grooves / decor); rAF only runs during the reveal, the reset
  sweep, or an active drag — it pauses when the tab is hidden. DPR capped at 2.

## Pass 1 — `32-p1-desktop.png`, `32-p1-mobile.png`, `32-p1-essay.png`

Found:
1. **Blank page / `PAGEERROR: Unexpected end of input`** — the outer IIFE was never closed
   (`})();` missing before `</script>`). Fixed; JS now parses clean (verified with `vm.Script`).
2. Double generation at boot (resize did an instant generate, then boot ran the reveal) risked a
   flash — split sizing from generation so boot reveals once and resize regenerates instantly.
3. After the fix the garden rendered well (rings, border frame, stones, leaves, engawa, vertical
   haiku, controls) but the **groove relief was a touch flat/faint** — did not fully read as 3D
   grooves the brief demands.
4. **Nearest-stone boundaries left slightly hard diagonal creases** between rocks.
5. **Moss patches floated on open sand as blurry green smudges** near the haiku column.

## Pass 2 — `32-p2-desktop.png`, `32-p2-mobile.png`, `32-p2-raked.png`, `32-p2-reduced.png`

Changed since pass 1: strengthened relief (wider highlight/shadow offset `HW` 1.55→1.85, added a
wide soft ambient-occlusion pass under each groove, brighter highlight walls); switched rock
blending to a **distance-weighted average of all nearby stones** (smooth saddles, seams gone);
re-authored moss as **defined, speckled patches creeping from stone bases**; added faint oversized
kanji watermarks (水/間/波) to the essay's right-hand whitespace.

Found:
1. Relief now unmistakably reads as raked sand — big improvement. But the field/ring blend caused
   **line-bunching / faint moiré in the transition zones** (base values ~hundreds vs ring values
   ~tens created uneven contour spacing) and the highlight was a little glossy.
2. Verified: scripted drag strokes rake correct multi-tine grooves that persist (`raked`); the
   **reduced-motion** shot renders the full static garden immediately with **no sweep**.

## Pass 3 — `32-p3-desktop.png`, `32-p3-mobile.png`, `32-p3-essay.png`, `32-p3-raked.png`, `32-p3-scroll-ma.png`

Changed since pass 2: **baseline-matched each stone's ring field to the local base value**
(`radial = rk.bc + d`) and matched the border frame the same way, so groove spacing stays even
everywhere — the moiré is gone and the sand flows around the stones in graceful, evenly-spaced
ripples (authentic Ryōan-ji). Softened the ambient haze (3.0→2.4px, lower alpha) and toned the
highlight from glossy to matte.

Verified at 1440×900 and 390×844:
1. Default garden is gorgeous and static-shot-safe: even rake lines curving cleanly around six
   stones, raked border frame, moss at stone bases, fallen maple leaves, soft top-left light,
   wooden engawa holding the controls, vertical haiku.
2. **`32-p3-raked.png`** — scripted strokes prove live raking: two straight multi-tine sweeps plus
   a stroke driven at the top-right stone and an arc past it; the tines visibly **bend around the
   stone into circular contours**, matching the generated ripples.
3. **`32-p3-scroll-ma.png`** — the 間 (ma) essay section: correct hierarchy, bilingual copy, moss/
   indigo accents, reveal animations fired, faint 間 watermark seating the whitespace. No overflow.
4. Zero console errors at both widths in every state (default, raked, reduced-motion, mid-scroll).

## Result

A meditative, tactile karesansui that is beautiful on load and rewarding to rake. Grooves read as
genuine sand relief and ripple around the stones both in the generated field and under the hand.
