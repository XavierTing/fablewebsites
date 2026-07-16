# COLD SET — iteration passes

A digital type-foundry storefront. Near-monochrome warm-paper editorial (`#f2efe6` paper /
`#18160f` ink / one cold cobalt `#2436d8`). Four invented families mapped to live variable
Google Fonts: **Sablier** (Fraunces), **Signal** (Roboto Flex), **Placard** (Bricolage
Grotesque), **Ledger** (JetBrains Mono). Sections: masthead + manifesto → live-specimen
Library → full Type Tester → Glyph table → Licensing + OpenType matrix → In-Use spreads →
colophon. No WebGL / no rAF loop — motion is CSS (@property axis interpolation, scroll-driven
progress bar) + IntersectionObserver reveals, all guarded by `prefers-reduced-motion`.

Screenshots taken at 1440×900 and 390×844 with `shot.mjs` / `scrollshot.mjs`, served over
`http://localhost:8918`. Deep-link params `?to=<section>` and `?fam=<family>` were added to
drive mid-page and per-family captures.

---

## Pass 1 — build + first full audit

**Captured:** masthead, library (mid-scroll), tester, glyphs, licensing, in-use, mobile
masthead/tester/library. Zero console errors at both widths on first render.

**Found:**
- Tester control grid used `auto-fit` → the last row (Align / Style) left a ragged block of
  trailing empty cells; read as unfinished rather than intentional whitespace.
- `font-variation-settings` readout in the tester footer was set in `--faint` — too pale to
  actually read the live values it exists to show.
- The Signal + Sablier editorial "In Use" card left a large dead zone below its short body
  column (card is a fixed 3:4.1 ratio, copy only filled ~55%).
- Everything else (Fraunces masthead, live specimens, glyph table, feature matrix, mobile
  stacking) held up well.

**Changed:** the three items above were queued for pass 2.

---

## Pass 2 — grid discipline + a real bug

**Changed:**
- Tester controls → fixed `repeat(4,1fr)` at ≥960px, so axes land as a disciplined 4×2 block
  (perfectly balanced for Signal's 6 sliders + align + style; one tidy trailing cell for
  families without a width/italic axis).
- Variation readout promoted to `--ink-2`; footer base to `--mut`. The `font-variation-settings`
  string is now clearly legible.
- Editorial card: extended the body copy and pinned a hairline folio line
  ("Words — H. Kessler · fol. 24") to the bottom with `margin-top:auto` — dead zone gone.

**Found (bug):** the `?fam=` deep-link was dead — `setFamily('sablier')` ran *last* in init and
clobbered any requested family. This also meant the family the visitor clicks in the Library
could theoretically be overridden on reload.

**Fixed:** reordered init to set the default first, then apply the `?fam=` override; verified the
tester now loads Signal (width slider revealed, readout `WGHT 400,OPSZ 48,WDTH 100`, correct
designer credit) via `?to=tester&fam=signal`.

---

## Pass 3 — instrumented verification + edge widths

Rather than eyeball only, ran a Puppeteer probe at both viewports:

- **Horizontal overflow:** none. `scrollWidth === clientWidth` at 1440 and 390; **0** elements
  extend past the right edge (the long glyph-caption / licensing labels that *looked* flush are
  within padding).
- **Reduced-motion path:** emulated `prefers-reduced-motion: reduce` at 390 — **0** `.pre`
  reveal elements remain hidden (fallback shows all content); heavy hero-weight animation is
  gated behind `.reduce-ok` so it never runs. At 1440 normal motion, 4 below-fold `.pre`
  elements are still pre-reveal, i.e. IntersectionObserver working as intended.
- **Console:** 0 errors at both widths.

Also captured mobile Licensing (pricing tiers stack cleanly; the 5-column OpenType matrix fits
390px) and mobile Glyphs (6-up Fraunces table). Both clean.

**Result:** no defects remaining. Type tester is fully interactive (size / weight / width /
optical / tracking / leading / alignment / italic, live variation-settings readout, plaintext
paste); library specimens range their weight & width on hover via `@property` interpolation;
glyph table and family switching work; feature matrix and pricing render from data. Shipped.
