# 67-eaux — ode. · iteration passes

Screenshot tool: `assets-pipeline/shot.mjs` (+ `scrollshot.mjs` for mid-page states) at
1440×900 and 390×844, waitMs 4500. **Every shot in every pass reported `NO_CONSOLE_ERRORS`.**

## Engine verification (node, before pass 1 — re-run after every engine edit)

`assets/67-eaux-engine.js` is a UMD module (data + pure scoring/palette functions), verified
with a node script that enumerates the whole finder:

- **All paths resolve** — 144/144 answer paths (3×4×3×4) produce a valid eau.
- **Every eau reachable** — win distribution: solaire 38, milk-teeth 27, open-water 25,
  grey-area 22, tantrum 22, houseplant 10.
- **Deterministic tie-breaks** — 32 tied paths all break to the earliest eau in line order
  (strict `>` comparison over the fixed EAUX array); scoring re-run twice gives identical results.
- **`?found=` works for all six** — ids, names, and space/`+` variants normalize correctly;
  unknown slugs return null (quiz starts normally).
- **Note→color determinism** — all 16 notes used anywhere have exactly one entry in
  NOTE_COLORS; `fieldsFor()` is keyed by note string only, so fig leaf's gradient fields are
  byte-identical between solaire and houseplant (JSON-compared).
- Six result texts distinct, each ≥ 2 sentences.

## Pass 1 — 67-p1-desktop / -mobile / -found / -step2 / -line / -secrets / -refill / -mobile-line

Found (merciless read):
1. **Gradients read as airbrushed 3D spheres, not silky mesh** — fields clustered at
   0.18–0.82 with small radii over a near-white base gave saturated centers and milky rims
   (tantrum = "rusty ball", houseplant = dark green ball). → fields now spread past the
   edges (−0.10…1.10), radii 0.85–1.20 wash + 0.5–0.72 core, base pulled only 55% to paper
   and mixed from the first *two* notes, dark notes (charcoal/umber/vetiver) alpha-damped ×0.72.
2. **Vertical banding** on the big `?found=` canvas (108px buffer bilinear-upscaled to 1288).
   → buffer res raised (w/10, cap 160) + `ctx.filter: blur()` scaled to the upscale factor,
   with 2×blur overdraw so no transparent rim shows.
3. **Bag chip typo-bug: "bag ( 0 )"** — `display:inline-flex; gap:7px` inserted flex gaps
   around the count `<span>`. → gap removed, tabular-nums added; renders "bag (0)".
4. **"smells like leaving early." collided with the houseplant blob** (low contrast over
   dark green). → aside moved to right:0/bottom:−7% + nowrap; blob 6 nudged left.
5. **Finder option tiles too small for "large editorial tiles"** — 84px tall, 36px chips.
   → 116px min-height, 44px chips, 17.5px labels, wider grid tracks.
6. **Mobile line rows broke** — "50 ml · eau de parfum" wrapped to a stray second line under
   the identity. → price markup split (`.edp` hidden on mobile), nowrap on desktop.
7. **Mobile cluster read as an egg carton** — six equal circles in two neat rows.
   → staggered margin-top offsets per shape.

## Pass 2 — 67-p2-desktop / -mobile / -found / -step2 / -line / -mobile-line

Verified: gradients now flat, edge-to-edge silk (tantrum a rust-leather field, solaire
mustard/olive with neroli corner); banding gone on the full-bleed result; bag chip clean;
tiles have presence; mobile rows aligned (€ 84 · 50 ml | add to bag). Found:
1. **Pale identities dissolve into the paper** — milk teeth and grey area had no edge on
   #fbfbf9. → 1px inset hairline ring via `.identity::before` (disabled on the full-bleed
   result canvas to avoid doubling the stage border).
2. **Grey area read "dirty beige", not iris** — iris #b4a4cb too grey next to musk+cedar.
   → deepened to #a893c6 (map change re-verified in node; determinism holds).

## Pass 3 — 67-p3-desktop / -found-tantrum / -found-milk (390w) / -step3-mobile / -refill / -secrets-mobile / -line2 / -footer

Verified: tantrum's dark full-bleed result stays legible behind the frosted panel; mobile
result composes bottom-anchored; mobile quiz step 3 clean (stacked tiles, dots, back);
refill diagram + footer composed; **fig-leaf dot visibly identical on solaire (01) and
houseplant (06) rows — the determinism claim is checkable on the page**. Found:
1. **~230px dead white band** between the last line row and "the finder" heading (two
   section paddings stacking). → line-sec bottom padding trimmed to clamp(60px, 8vh, 100px).

## Pass 4 (final verification) — 67-final-desktop / -mobile / -og (?found=solaire) / -step2 / -grey (?found=grey-area)

All states re-shot after the trims: composed at 1440×900 and 390×844, og state clean,
mid-quiz clean, grey-area full-bleed now properly iris-lilac→cedar. No new findings.

## Hard-requirement checklist

- Zero console errors across all 19 shots (both widths, quiz/result/og states).
- `prefers-reduced-motion`: CSS media guards on floaty/bagpop/bloom/reveal/dash animations +
  smooth-scroll; JS `REDUCE` renders one static gradient frame and never starts the rAF loop.
- rAF loop pauses on `visibilitychange` (hidden) and skips offscreen canvases (IntersectionObserver).
- `devicePixelRatio` capped at 2; gradient buffers are tiny (≤160px) regardless of canvas size.
- Back-link chip "XAVIER FABLE ×70" → `/`, fixed bottom-left, styled to the system.
- `?found=<eau>` for og shots, `?step=N` for mid-quiz shots — both scroll instantly to the stage.
