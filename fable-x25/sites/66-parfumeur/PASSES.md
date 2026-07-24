# 66-parfumeur — L'ORGUE · iteration passes

Screenshot tool: `assets-pipeline/shot.mjs` at 1440×900 and 390×844, waitMs 4500.
Every shot in every pass reported `NO_CONSOLE_ERRORS`.

## Engine verification (node, before pass 1)

`assets/66-organ.js` exports the pure accord engine; verified with `node -e "require(...)"`:

- **Determinism** — `accordName(ids)` hashes the *sorted* id list (cyrb53, seed 66):
  same picks in any click order → same name, same ref. Confirmed for 7 combos.
- **Required combos** — bergamote+poivre rose → "Braise de Sel" (top-only card);
  jasmin+iris → "Aveu de l'Aube" (heart-only); vétiver+musc → "Futaie de l'Aube" (base-only);
  ambre preset (bergamote+safran / rose+labdanum / ambre gris+vanille) → "Ambre des Brumes",
  ref OR-919B, full 3-tier description.
- **Dry-down model** — intensity(t) checked at t=0.3 / 3 / 10 h: tops dominate the open,
  hearts the middle, bases the tail. Fixed one grammar bug found here: "A enveloping" → "An enveloping".

## Pass 1 — 66-p1-desktop / 66-p1-accord / 66-p1-extraits / 66-p1-card / 66-p1-methode / 66-p1-mobile

Found (merciless read):
1. **Méthode numerals collapsed to body size** — `.step p` (0,1,1) out-specified `.step-no`
   (0,1,0), so the roman numerals rendered ~15px. → selector raised to `.step .step-no`.
2. **Organ dead zones** — tier label sat above a centered bottle cluster, leaving large empty
   walnut fields left and right of each shelf. → tiers rebuilt as grid `[158px label column | shelf]`,
   labels stacked (name / register hours / count chip); mobile collapses back to a horizontal head row.
3. **Pyramid apex too narrow** — note names overhung the triangle sides at the crown.
   → redrawn as a truncated pyramid (trapezoid, 110px crown) with dashed band dividers.
4. **Timeline "12 h" tick wrapped** to two lines at the right edge → `white-space:nowrap`.
5. **Ombre Verte bottle read as a capsule/pickle** → first reshape (wider, shorter body).
6. **Eau des Orangers engraving hatch too scratchy** on the pale glass → opacity .14 → .08.
7. **og screenshot target** — `?accord=ambre` scrolled to the cabinet, composed card off-screen
   → accord/pick params now scroll to `#accord-card` (with scroll-margin so the wax seal survives).

## Pass 2 — 66-p2-organ / 66-p2-accord / 66-p2-pick / 66-p2-footer / 66-p2-mobile-accord

Verified: organ label-column layout works; truncated pyramid holds two names per band;
`?pick=bergamote,poivre-rose,jasmin,iris,vetiver,musc` → "Aveu de Sel" with all six notes in the
correct pyramid bands and six correctly-spanned timeline bars (tops 0–2h, hearts 0.4–8h,
bases 1.2–12h+); wax seal appears on the complete card; mobile card composes cleanly.

Found:
1. **Shelves still left-weighted** — tête/cœur rows (7 bottles) left ~320px of dark shelf empty
   → `justify-content:space-evenly` + `align-items:flex-start`; rows now breathe evenly and the
   fond row reads denser, like a real organ's base tier.
2. **Dead zone above footer** — méthode bottom padding + footer margin stacked ~200px of empty
   paper → footer top margin removed, section padding-block tightened to clamp(60px,7.5vw,100px).
3. **og shot cropped the timeline** — scroll-margin 60 → 46px so more of the fondu band is in frame.
4. **Extrait figure not keyboard-operable** (role=button, tabindex, no handler) → Enter/Space
   now toggle the pyramid overlay.

## Pass 3 — 66-p3-organ / 66-p3-extraits / 66-p3-empty / 66-p3-mobile-organ / 66-p3b-*

Verified: shelves fill the cabinet at 1440; mobile organ wraps into centered, evenly-spaced rows;
méthode numerals at display size; empty-state card and footer compose; re-shot
extraits / accord / mobile hero / mobile footer all clean, zero console errors at both widths.

Found + fixed:
1. **Ombre Verte still capsule-ish** after the pass-1 reshape → replaced with an iconic round
   *boule* flask (sphere body, straight neck, string tag moved to hang off the shoulder) —
   the three silhouettes (slender gold / square-shouldered amber / round green) are now unmistakably distinct.
2. **Empty accord card left a ~380px dead gap** before La Méthode → absorbed by the pass-2
   padding tightening; confirmed in re-shot.
3. **Empty-state pyramid glyph** still used the old pointed triangle → matched to the truncated shape.

Final state: hard requirements checked — favicon, meta/OG, back-link chip "XAVIER FABLE ×70" → `/`,
`prefers-reduced-motion` guards (vapor canvas, playhead loop, reveals, smooth-scroll), DPR capped at 2,
both rAF loops pause on `visibilitychange` and off-screen (IntersectionObserver), styled
::selection / scrollbar / :focus-visible, zero console errors at 1440×900 and 390×844.
