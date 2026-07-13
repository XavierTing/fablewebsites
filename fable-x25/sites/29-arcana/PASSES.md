# 29-arcana — iteration passes

Served at http://localhost:8905/ · shot via assets-pipeline/shot.mjs · zero console errors on every shot.
Screenshot params implemented: `?state=drawn&flip=N&seed=X` (forces the spread revealed, deterministic),
`?state=shuffled`, `?scroll=<section-id>` (jumps to a section for mid-page shots).

## Pass 1 — first full render (29-p1-*.png)

Found:
- **Verdict bug**: summary line read "the the door" — card names already contain "The", and the
  verdict templates prepend their own article. Double article on all three names.
- **Gallery shine leak**: giant diagonal light streaks over/behind every fan card. Root cause:
  `.fan-inner` was an inline `<span>`, so `overflow:hidden` never clipped the sweeping `::after` gradient.
- **Drawn state at 1440×900**: verdict block cut off below the fold; masthead scale left a dead band
  because the layout box didn't shrink with the transform.
- **Arrival table**: candle glow too faint to read as candle-light; no light pool under the deck, so
  the "table" didn't read; no scroll affordance hinting at the content below the fold.
- Unused variable in shuffle code.

Changed:
- Verdict names now strip the leading article (`name.replace(/^The\s+/i,"")`).
- `.fan-inner{display:block}` — sweep clipped correctly.
- Drawn/complete state: masthead negative margins + reduced ritual padding + tighter meaning/verdict
  spacing so the whole spread + verdict + ASK AGAIN compose inside 900px.
- Glow intensity up (.13→.17 / core .10→.14), centered on the deck; added an elliptical warm light
  pool under the deck (`.deck-zone::before`); added a pulsing hairline scroll hint at the bottom of
  the ritual section (hidden once cards are drawn).
- Gallery hint margin increased; dead code removed.

## Pass 2 — recheck + interactive flow test (29-p2-*.png)

Found:
- Desktop drawn state much better but **ASK AGAIN still clipped ~20px** at 900.
- **Mobile gallery**: fan rotations still applied — inline `--fr/--fy` custom properties (set from JS)
  beat the media-query override, so cards sat tilted and clipped in the 2-col grid.
- **Mobile revealed**: subtitle collided with the PAST label (desktop negative masthead margins
  leaking into the 760px breakpoint).
- Ran a puppeteer flow test (shuffle → draw → flip ×3 → verdict → ask again → lightbox → Esc):
  every state transition fired, verdict line read correctly ("The compass explains it, the tide
  confirms it, and the door — well. You knew before you shuffled."), lightbox opened/closed,
  zero console errors. Captured 29-p2-flow-complete.png / 29-p2-flow-lightbox.png.

Changed:
- Drawn-state ritual padding-top → 40px, verdict kicker/meaning margins trimmed: full spread +
  verdict + button now fit at 1440×900.
- Mobile fan cards: `transform:none` (declaration-level override instead of custom-prop override).
- Mobile drawn masthead: own margins (`margin-bottom:2px`) at ≤760px — label collision gone.

## Pass 3 — verification (29-p3-*.png)

Found:
- Arrival table (1440 + 390): glow, light pool, stack offsets, scroll hint all composed. No issues.
- Revealed state (1440): three cards + names + readings + "the cards have spoken" + ASK AGAIN all
  inside the viewport, comfortable rhythm. No issues.
- Revealed state (390): cards stack vertically, PAST/PRESENT/FUTURE labels clear of the masthead,
  readings legible. No issues.
- Gallery (1440): clean fan arc, shine clipped, hint clear of the cards. Gallery (390): tidy 2-col
  grid. No issues.
- Zero console errors across all six shots. Pass 3 clean — stopping here.

## Accessibility / motion notes
- `prefers-reduced-motion`: shuffle riffle skipped (instant restack), 3D flips become opacity
  crossfades, candle flicker + breathing instruction + scroll hint animations disabled.
- All cards are real `<button>`s with aria-labels; lightbox is a dialog with focus handoff and Esc.
- Cursor dot only on `pointer:fine`; its rAF loop self-terminates at rest and halts on tab hide.
