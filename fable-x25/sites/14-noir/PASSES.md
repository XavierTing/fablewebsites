# PASSES — 14-noir · THE LONG SLEEP

Interactive film-noir case file. Playable detective story, 11 story nodes + 3 endings,
5 AI noir photographs graded in-browser, WebAudio rain toggle, canvas film grain +
projector flicker, evidence drawer, choice stamps, `?node=N` deep-link jump.

Screenshot tool: `assets-pipeline/shot.mjs`. Served over `python3 -m http.server 8714`.
Widths tested: desktop 1440×900, mobile 390×844.

---

## PASS 1 — audit the existing full build

Captured title / mid-scene (`?node=3`) / ending (`?node=end-good`) at both widths,
plus all three endings (`end-good`, `end-bitter`, `end-fatal`) at desktop.

**Verified working:**
- Story graph resolves. `?node=3` renders scene n3 with the correct canonical path seeded
  (Evidence 01) and choices visible. `?node=end-*` renders each ending with the BFS-traced
  decision path stamped in.
- All 5 images load via relative `assets/` paths (grayscale grades applied per node).
- All 3 endings render with distinct dispositions: INDICTMENT FILED (street),
  UNSOLVED — BY CHOICE (office), INVESTIGATOR — D.O.A. (pier).
- **Zero console errors** at 1440×900 and 390×844 on every view.
- Hard reqs present: `<title>`, meta description, inline-SVG emoji favicon, `FABLE ×25`
  back-link → `/`, `prefers-reduced-motion` guard (both CSS clamp + JS `reduced` flag),
  rAF loop pauses on `visibilitychange`.

**Critique (art-director pass):**
1. Ending cards: the "YOUR PATH THROUGH THE LONG SLEEP" label and the path-stamp chips are
   ash-gray with a faint border and no backing — they nearly disappear over the brighter
   fog/pier `end-fatal` image. Legibility failure on a key payoff element.
2. Path-stamp index numbers (`.n`) at 45% opacity are almost invisible.
3. Title card: `CASE FILE №247…` and `A CASE IN FIVE SCENES` sit directly over neon signage
   with no text-shadow — the `№247` glyph loses contrast against the "ROXY/Bendix Radio" sign.
4. Composition, hierarchy, typography, scrims, choice stamps, grain/flicker: all strong,
   no changes needed.

**Changes:** deferred to Pass 2 (below).

---

## PASS 2 — legibility fixes

Applied fixes for the Pass 1 critique:
- `.pstamp`: added `rgba(0,0,0,.55)` backing, brighter text (paper @ 85%), stronger border,
  and a text-shadow so chips stay readable over bright ending imagery.
- `.pstamp .n`: bumped from 45% → 65% opacity.
- `.plabel`: brightened toward paper + added text-shadow.
- `.tc-file` / `.tc-sub` / `.end-bureau`: added subtle text-shadow so metadata caps hold up
  over neon/lit backgrounds.

Re-screenshot title / `?node=3` / `end-good` + `end-fatal` (worst case) at both widths.

**Result:** path stamps and labels now read cleanly over every ending's photograph;
title metadata holds contrast over the neon. Still zero console errors both widths.

---

## PASS 3 — final verification

Re-captured all six required frames (title, `?node=3`, ending × desktop+mobile) and
re-inspected. Confirmed:
- No overflow / dead zones / default-browser elements at either width.
- Text legibility over photos holds via scrims + shadows on every screen.
- Choice stamps, evidence counter, reel counter, back-link, rain toggle all present and clear.
- Zero console errors at 1440×900 and 390×844.

Build ships.
